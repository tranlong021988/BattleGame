# AI-CONTEX

Handoff note cho Codex khác khi làm tiếp dự án `BattleGame`.

Ngày ghi chú ban đầu: 2026-06-16. Cập nhật gần nhất: 2026-06-18.

Người dùng đang dùng hai Codex ở hai máy khác nhau. Hai phiên không chia sẻ trí nhớ hội thoại, nên trước khi sửa source phải đọc file này và rà lại source hiện tại. Không làm theo trí nhớ cũ nếu code đã đổi.

## Nguyên tắc làm việc

- Ưu tiên performance mobile browser.
- Sửa ít file nhất có thể, hạn chế phình kiến trúc.
- Mỗi thay đổi logic phải soi ảnh hưởng tới wave, lane, hero, minimap, AI, worker.
- Không tự ý reverse thay đổi của user.
- Không thêm log không tắt được. Log giữ lại phải có `enableDebugLog`, `enableStateLog` hoặc inspector toggle tương tự.
- Khi cần kiểm tra nhanh hiện tại, dùng `rg` trước.
- Project hiện không có script typecheck/build rõ ràng trong `package.json`; thường chỉ kiểm `git diff --check`. Local `tsc` có thể không có trong `node_modules`.
- Git có thể hiện nhiều file `library/`, `temp/` do Cocos Editor sinh ra. Đừng commit/sửa các file generated này nếu không có lý do rõ.

## File quan trọng

- `assets/scripts/GameManager.ts`: orchestration chính, spawn, wave recovery, hero unlock, spatial grid rebuild, RVO step.
- `assets/scripts/BattleWave.ts`: wave state, laneId, combat mode, pending lane transfer, runtime cache alive/engaged theo frame.
- `assets/scripts/Unit.ts`: hành vi unit, onForward, freehunt, engage, target search, lane return.
- `assets/scripts/UnitBehavior.ts`: attack interval, deal damage, kill/despawn callback.
- `assets/scripts/UnitSpawner.ts`: pooling unit.
- `assets/scripts/BattleSpatialGrid.ts`: spatial grid, batch nearest target worker, main-thread fallback.
- `assets/scripts/rvo/RVOWorkerSimulator.ts`: RVO worker.
- `assets/scripts/ArmyBrain.ts`: AI spawn/counter/lane choice.
- `assets/scripts/TrueMiniMapPanel.ts`: minimap mới.
- `assets/scripts/BattleInformationIconItem.ts`: vẫn đang được minimap mới dùng cho icon visual. Đừng xóa nhầm.

## Gameplay hiện tại

Game là battle hai phe A/B. Unit spawn theo wave. Wave có `laneId`, hiện theo 3 lane: left/mid/right, tương ứng index 0/1/2.

Wave spawn vào lane, unit được gán `laneId` và `forwardLaneOffsetX`. Khi đổi lane, wave dùng `setLaneId()` rồi `resumeForward()`, unit sẽ `setWaveForwardLane()` và có trạng thái `returningToWaveLaneSlot` để chạy ngang vào lane/slot trước khi forward tiếp.

Không còn làm full regroup square phức tạp. Cơ chế hiện là lane return/slot return đủ nhẹ để giữ visual trong lane.

## OnForward, Freehunt, Combat

Unit đang `onForward` sẽ:

- Tìm enemy cùng lane gần nhất.
- Tìm enemy lane kề gần nhất.
- Nếu đã vượt target theo forward dir thì gọi `GameManager.onWaveForwardPassedAdjacentTarget()`.
- Điều kiện lane kề được chặn bằng same/adjacent lane. Không được nhảy trực tiếp left sang right.

Quan trọng: hiện không còn điều kiện "lane hiện tại phải trống mới xét lane kề". Khi forward và vượt enemy lane kề thì release forward/freehunt.

Khi một unit phát hiện enemy trong attack range:

- `GameManager.onWaveCombatStarted(unit, enemy)` được gọi.
- Wave của unit ghi lane candidate từ vị trí unit đang engage.
- Wave vào `combatModeActive`.
- Enemy wave cũng được note và vào combat mode.
- `BattleWave.enterCombatMode()` làm toàn wave thoát forward, các unit chuyển sang wave combat/freehunt behavior.

Freehunt hiện là unit-level hunt toàn map, nhưng được điều tiết bởi wave recovery:

- Unit tự tìm enemy gần nhất qua spatial grid/worker.
- Nếu unit chưa có target hợp lệ, nó tự search theo `targetSearchRange` trước; nếu không tìm được mới hỏi target của đồng đội trong cùng wave. Target mượn không bị giới hạn bởi `targetSearchRange`.
- Khi unit engage, lane candidate của wave được ghi từ vị trí unit phe mình đang engage, không lấy lane từ enemy nữa.
- Khi wave không còn unit nào engaged và không còn target hợp lệ đủ `freeHuntNoTargetRecoveryFrames`, `GameManager.recoverWaveCombat()` hoặc `processForwardReleaseRecoveries()` sẽ dùng `preparePendingLaneFromLastEngagedUnit()`.
- Nếu có pending lane và wave không còn engaged, `tryApplyPendingLaneTransfer()` đổi lane, rồi forward.

Nếu wave release forward/freehunt nhưng chưa bao giờ engage ai, nó có thể không có `lastEngagedUnitLaneId`. Code hiện có `freeHuntNoTargetRecoveryFrames`: nếu toàn wave không engaged và không ai giữ target hợp lệ đủ số frame này, wave chọn lane theo majority vị trí unit alive rồi regroup/forward.

## Lane decision hiện tại

Lane mới không dựa vào target đã chọn và cũng không dựa vào kill cuối.

Logic hiện tại:

- Lane transfer ưu tiên dựa trên unit phe mình cuối cùng còn/đã engage (`lastEngagedUnitLaneId`).
- `GameManager.onWaveCombatStarted()` ghi lane candidate cho cả hai wave bằng vị trí unit của chính wave đó.
- `GameManager.onUnitKilled()` ghi lane candidate bằng vị trí killer và victim, không lấy lane từ enemy/victim làm lane quyết định cho wave kia.
- Nếu không còn engaged nhưng vẫn còn target hợp lệ, wave tiếp tục freehunt/chase.
- Nếu không còn engaged và toàn wave mất target đủ `freeHuntNoTargetRecoveryFrames`, wave sẽ dùng lane candidate từ unit cuối engage; nếu không có candidate thì chọn lane theo majority vị trí unit alive.

Những hướng đã thử và bỏ:

- Cấm truy đuổi ngược: gây unit đứng nhìn enemy, lỗi forward, đã bỏ.
- Lane quyết định từ target lúc set target: làm wave "lậm target", một số case forward/freehunt không tự nhiên, đã bỏ.
- Lane quyết định từ enemy bị giết cuối cùng: tạo case hai wave lane kề lướt qua nhau hoặc unit chạy về lane cũ rồi quay lại, đã bỏ.
- Event/counter alive/engaged bằng WeakMap/setter `onBusy`: đã thử ngày 2026-06-16, frametime không cải thiện và có vẻ cao hơn, đã reverse. Hiện giữ runtime cache theo frame trong `BattleWave`.

## BattleWave state

`BattleWave` đang có runtime cache theo frame:

- `getRuntimeAliveCount(frame)`
- `isDeadRuntime(frame)`
- `hasEngagedRuntime(frame)`

Cache này scan unit trong wave tối đa một lần mỗi frame cho các recovery loop chính. Không dùng event/counter persistent.

Các method public cũ vẫn còn:

- `getAliveCount()`
- `getAliveRatio()`
- `hasEngaged()`
- `isDead()`

Các method này vẫn scan khi gọi trực tiếp. Trong hot loop của `GameManager`, ưu tiên dùng runtime variant.

## Hero hiện tại

Hero được xem như một unit đặc biệt và có hero wave 1 unit ở lane mid.

Hero ban đầu steady:

- `isSteady = true`
- không tự đi forward.
- vẫn có thể đánh trả tại chỗ nếu enemy vào range vì attack check xảy ra trước nhánh steady return.

Hero unlock/freehunt:

- `GameManager.tryUnlockHeroForward(team)` kiểm tra CP/spawn/non-hero unit/wave.
- Khi không còn khả năng spawn và không còn unit/wave thường alive, hero thoát steady.
- `unlockHeroForward()` set `heroForwardUnlocked[team] = true`, `hero.setSteady(false, false)`, `hero.enterFreeHuntMode(heroFreeHuntSearchRange)`.
- Khi hero của team A unlock, các normal wave của team B bị force freehunt. Tương tự chiều ngược lại.
- Enemy hero không tự thoát steady theo hero kia; nó chỉ thoát steady khi chính team nó đạt điều kiện unlock.
- Future normal waves spawn sau khi enemy hero unlock cũng bị force freehunt qua `shouldForceTeamFreeHunt()`.

Hero kill không earn CP:

- `GameManager.reportKill()` chỉ `addCombatPointFromVictim()` nếu `!killer.isHero`.

## ArmyBrain hiện tại

`ArmyBrain` ban đầu thiết kế cho gameplay 1 lane, đã được nâng nhẹ cho 3 lane nhưng không làm phức tạp pressure system.

Inspector knobs chính:

- `attackModeChance`
- `defenseModeChance`
- `aiIntelligence`
- `minSpawnInterval`, `maxSpawnInterval`
- `maxAliveWaves`
- `counterSameLaneChance`
- `laneAwareness`
- `flankAggression`

Ý nghĩa ngắn:

- Attack/Defense chance quyết định mode/misread.
- AI Intelligence càng cao càng chọn quân counter đúng, thấp thì random affordable nhiều hơn.
- Counter selection vẫn là cốt lõi sống còn của AI.
- `counterSameLaneChance`: xác suất spawn cùng lane target.
- `laneAwareness`: mức AI quan tâm lane đang bị bỏ trống/đe dọa.
- `flankAggression`: thiên hướng chọn lane kề hỗ trợ/flank thay vì cùng lane.

`defenseUrgency` từng được đề xuất nhưng đã bỏ vì trùng/khó chỉnh.

Lane pressure snapshot trong `ArmyBrain` đã được tối ưu:

- Chỉ đếm wave theo lane.
- Không gọi `getAliveRatio()`, `getClosestDistanceSqTo()`, `hasEngaged()` trong snapshot.
- Mục tiêu là O(number of waves), không scan unit.

AI target selection vẫn có chỗ gọi `getClosestDistanceSqTo()` và `getAliveRatio()`. Vì chạy theo spawn interval nên chưa phải hot path chính, nhưng nếu spawn interval quá thấp có thể gây spike.

## Minimap hiện tại

Component cũ `BattleInformationPanel.ts` và `.meta` đã bị xóa. Scene không còn type `BattleInformationPanel`/`UnitIconInfo` cũ. Nếu thấy lỗi missing script thì mở lại scene bằng Cocos để refresh serialized data.

Minimap mới là `TrueMiniMapPanel.ts`, gắn trên node `true-mini-map`.

Nó dùng:

- `background`
- `icon-list-A`
- `icon-list-B`
- `teamAIcons`, `teamBIcons`
- hero icon riêng

Feature:

- Icon đại diện wave theo unit type.
- Icon A/B nằm trong root riêng.
- Vị trí icon phản ánh vị trí tương đối world X/Z qua `battleMinX`, `battleMaxX`, `battleMinZ`, `battleMaxZ`.
- Có `worldToMiniMapScale`.
- Có `updateInterval`, `smoothDampTime`, `tweenScaleDuration`.
- Wave engaged thì icon flashing.
- Spawn icon scale lên, remove icon scale xuống rồi về pool.
- Dùng pooling node icon.

Tối ưu đã làm:

- `resolveIconOverlaps()` không còn so all-pairs thuần; đã đổi sang grid 2D nội bộ cho icon separation.
- `scanWaveForMiniMap()` dùng `maxPositionSampleUnits = 8` để sample vị trí wave, không luôn scan full wave.
- Alive/engaged trong minimap lấy qua runtime cache nếu có `GameManager.frame`.
- Nếu sample không trúng unit sống, fallback scan full một lượt để không mất position.

Đừng xóa `BattleInformationIconItem.ts`; minimap mới còn dùng nó.

## Performance hiện tại

Định hướng performance mobile là cực kỳ quan trọng.

Đã có:

- RVO worker: `GameManager.useWorkerRVO = true`, worker name `RVOWorkerSimulator`.
- RVO step throttle theo `GameManager.updateInterval` frame.
- Spatial grid rebuild theo `spatialGridUpdateInterval`.
- Target query worker trong `BattleSpatialGrid`, worker name `BattleSpatialGridTargetWorker`.
- Main-thread fallback nếu worker không available.
- Unit target search throttle:
  - `attackCheckIntervalFrames`
  - `targetSearchIntervalFrames`
- Forward lane scan trong `Unit.findNearestEnemyInSameLane()` và `findNearestEnemyInAdjacentLane()` đã đổi sang `BattleSpatialGrid.queryEnemies()` thay vì duyệt full enemy list.
- `BattleWave` runtime cache alive/engaged theo frame cho recovery loop.
- ArmyBrain lane pressure snapshot nhẹ, không scan unit.
- Minimap overlap grid + position sampling.

Thử event/counter alive/engaged không giúp frametime và đã bị reverse.

Nghi phạm performance còn lại:

- RVO worker step/transfer buffer, nhất là khi agent count cao.
- `BattleSpatialGrid` worker target query đang gửi `number[]` (`targetSnapshot`, `packedRequests`) qua `postMessage`; structured clone có thể tốn. Có thể cân nhắc typed array/reuse buffer nếu profile chỉ ra.
- `Unit.update()` chạy mỗi frame trên toàn bộ unit.
- Spatial grid rebuild mỗi `spatialGridUpdateInterval` frame.
- Minimap nếu `updateInterval` thấp, icon nhiều, `iconSeparationIterations` cao.
- Cocos UI/tween overhead khi nhiều icon spawn/despawn.

Nếu cần đo:

- Dùng Chrome DevTools Performance.
- Trong Sources/Threads có thể thấy `Main`, `RVOWorkerSimulator`, `BattleSpatialGridTargetWorker`.
- Worker name đã được set bằng option `{ name }` nếu browser hỗ trợ.

## Known edge cases và lưu ý

- Nếu wave freehunt nhưng chưa kịp engage, mà target bị wave khác giết, wave có thể chưa có `lastEngagedUnitLaneId`. Hiện `freeHuntNoTargetRecoveryFrames` sẽ kéo wave về lane majority theo vị trí unit alive khi toàn wave không engaged và không ai có target hợp lệ.
- Nếu thấy wave chuyển lane kỳ lạ, kiểm tra `lastEngagedUnitLaneId`, `noteEngagedUnitLane()`, `noteCurrentEngagedUnitLane()`, `regroupWaveByMajorityLane()`, `onWaveCombatStarted()`, `onUnitKilled()`.
- Nếu thấy left sang right trực tiếp, kiểm tra `Unit.isAdjacentLane()`, `GameManager.areSameOrAdjacentLanes()`, và laneId của target/hero.
- Nếu hero bị vây mà enemy vẫn forward/regroup, kiểm tra `heroForwardUnlocked`, `shouldForceTeamFreeHunt()`, `forceWaveToHeroPressureFreeHunt()`.
- Nếu icon minimap di chuyển lạ khi chết/pool, kiểm tra `releaseIcon()`, `recycleIcon()`, `record.removing`, và target/raw position freeze.
- Nếu chỉnh scene bằng Cocos, có thể sinh thay đổi trong `library/` và `temp/`; đừng lẫn với source changes.

## Những hướng nên tránh lặp lại

- Đừng tái áp dụng rule "không cho wave/unit chase ngược" theo cách cứng; đã gây unit đứng im/không forward.
- Đừng quyết định lane từ target được chọn nếu chưa test kỹ; đã gây case "lậm target".
- Đừng đổi lane theo kill cuối nếu chưa thiết kế lại combat; đã gây lane kề lướt qua nhau và unit quay về lane cũ.
- Đừng event hóa vị trí unit bằng "unit moved" event; unit move liên tục, event overhead có thể nặng hơn scan/sample.
- Đừng thêm nhiều inspector knob cho AI nếu không thật sự cần; user muốn chỉnh được nhưng không muốn rối.

## Trạng thái dừng hôm nay

- Event/counter alive/engaged đã thử và reverse.
- Current source nên giữ ở hướng runtime cache + spatial grid + worker + sampling.
- User tạm dừng và muốn Codex ở máy khác đọc file này để bắt kịp.

## Cập nhật performance tối 2026-06-16

User test visual hiện đã khá đúng ý. Vấn đề chính còn lại là frametime tăng. Đã dùng Chrome DevTools Performance trace để đo thật, không chỉ đoán từ source.

Trace trước tối ưu:

- File user đưa: `Trace-20260616T214201.json`.
- Môi trường record: Chrome DevTools, emulated `iPhone SE`.
- Bottleneck chính nằm ở main thread: `Unit.updateForwardPhase()` -> `findNearestEnemyInSameLane()` -> `BattleSpatialGrid.queryEnemies()`.
- Số liệu đáng chú ý:
  - DroppedFrame khoảng `735`.
  - `FireAnimationFrame` avg khoảng `3.40ms`, p95 khoảng `8.81ms`.
  - `updateForwardPhase` inclusive khoảng `5002ms`.
  - `BattleSpatialGrid.queryEnemies` self khoảng `3911ms`.
  - `findNearestEnemyInSameLane` inclusive khoảng `4029ms`.
- Kết luận: thủ phạm không phải wave scan. Thủ phạm là forward lane detection đang dùng `targetSearchRange` lớn cho từng unit đang forward, mỗi frame.

Bối cảnh map:

- User nói battlefield thực tế combat theo trục Z.
- Kích thước chiến trường khoảng `x = -8..8`, `z = -21..21`.
- `targetSearchRange` thực tế user set trong Inspector là khoảng `35`, không phải default `60`.
- Dù là `35`, với map này vẫn rất rộng: gần phủ toàn bộ chiều ngang và phần lớn chiều dài.
- `spatialGridCellSize = 4`, radius `35` tương đương `cellRange = ceil(35 / 4) = 9`, tức có thể lookup khoảng `19 x 19` cell mỗi query.
- Vì mỗi unit forward tự scan, chi phí nhân theo số unit forward.

Giải pháp đã code:

- Trong `assets/scripts/Unit.ts` thêm:
  - `forwardScanRange = 12`
  - `forwardScanIntervalFrames = 2`
- `findNearestEnemyInSameLane()` và `findNearestEnemyInAdjacentLane()` hiện dùng `forwardScanRange`, không dùng `targetSearchRange`.
- `targetSearchRange` vẫn giữ cho freehunt/target search bình thường.
- Có fallback: nếu `forwardScanRange <= 0`, dùng lại `targetSearchRange`.
- Forward scan được throttle qua `forwardScanIntervalFrames`.
- Forward scan hiện dùng `Use Wave Front Scanner`: mỗi wave chỉ cho unit đang đi xa nhất theo `forwardDir` được quyền scan. Nếu tắt flag này thì quay về mọi unit đang forward đều có thể scan.
- Không còn `Forward Scanner Switch Interval Frames`/round-robin scanner. Scanner đổi tự nhiên theo "ai ở mũi đội hình".
- `Unit.frameCounter` đã được khởi tạo bằng `updateOffset`, nên `attackCheckIntervalFrames`, `targetSearchIntervalFrames`, và `forwardScanIntervalFrames` đều đã tự rải phase giữa các unit. Không cần cộng `updateOffset` thêm lần nữa.
- Thêm cache `forwardLaneTarget` cho same-lane, dùng chung với cache cũ `forwardAdjacentTarget`.
- Frame không tới lượt scan vẫn check target cache để phát hiện đã vượt enemy, tránh bị "mù" giữa 2 lần scan.
- Khi unit đổi lane/freehunt/combat/steady/despawn/clear enemy thì clear cache forward target.

Trace sau khi thêm `forwardScanRange`:

- File user đưa: `Trace-20260616T220253.json`.
- Kết quả:
  - DroppedFrame giảm từ khoảng `735` xuống `76`.
  - `FireAnimationFrame` avg giảm từ khoảng `3.40ms` xuống `1.50ms`.
  - `FireAnimationFrame` p95 giảm từ khoảng `8.81ms` xuống `4.55ms`.
  - `updateForwardPhase` inclusive giảm từ khoảng `5002ms` xuống `571ms`.
  - `BattleSpatialGrid.queryEnemies` self giảm từ khoảng `3911ms` xuống `415ms`.
  - `findNearestEnemyInSameLane` inclusive giảm từ khoảng `4029ms` xuống `339ms`.
- Kết luận: `forwardScanRange = 12` đánh đúng bottleneck. Chưa cần vội chuyển sang wave-level cache nếu visual vẫn ổn.

Throttle/offset đã rà:

- Trong `assets/scripts/GameManager.ts` thêm:
  - `rvoUpdateFrameOffset = 0`
  - `spatialGridUpdateFrameOffset = 1`
  - helper `shouldRunFrameInterval(interval, offset)`
- Mục tiêu: RVO step và spatial grid rebuild đều default interval `2`; offset grid `1` giúp tránh dồn cả hai vào cùng frame.
- Không thêm offset cho:
  - `ArmyBrain`: đã random `nextInterval`.
  - `UnitBehavior`: attack interval đã random per unit.
  - `TrueMiniMapPanel`: thường chỉ một instance, offset không có nhiều ý nghĩa.
  - `SpawnBackPressureGate`: một gate global, offset không giúp.
  - `BattleSpatialGrid` worker flush: dùng microtask batching, không nên frame-offset.

Memory/listener từ trace:

- User thấy DevTools Listener đi ngang, memory răng cưa tăng rồi tụt mạnh.
- Đã parse counter trong trace:
  - `jsEventListeners`: khoảng `130` rồi xuống `119`, không tăng bậc thang.
  - `nodes`: giữ nguyên khoảng `30569`.
  - `documents`: giữ nguyên `2`.
  - `jsHeapSizeUsed`: tăng răng cưa tới khoảng `189MB`, sau GC tụt về khoảng `51-59MB`.
- Kết luận: hiện chưa thấy dấu hiệu listener leak hoặc node leak. Đây giống allocation + GC bình thường.
- Game có listener thật ở:
  - `TopDownCameraDrag`: input touch/mouse wheel, có `off` trong `onDisable`.
  - `BattleCinematicCameraController`: input touch/mouse down, có `off` trong `onDisable`.
  - `TrueMiniMapPanel`: mỗi icon clickable có `TOUCH_START` + `TOUCH_END`; khi reuse/destroy có `clearIconEvents`.
  - `DebugStats`: director events, có `off` trong `onDestroy`.

Performance hiện tại cần theo dõi tiếp:

- `postMessage` worker vẫn hiện trong trace. Chưa phải bottleneck chính, nhưng nếu scale 500-600 unit có thể tối ưu bằng typed array/reuse buffer/batch tốt hơn.
- RVO worker `collectNeighbors` còn là vùng cần theo dõi khi unit count cao.
- Wave recovery và minimap trong trace hiện rất nhỏ, chưa phải vấn đề.
- Nếu sau này forward scan lại thành bottleneck, hướng tiếp theo mới là wave-level forward detection cache. Không nên quay lại scan per-unit với range lớn.

Lưu ý khi test tiếp:

- Giá trị khuyến nghị hiện tại:
  - `forwardScanRange = 12`
  - `forwardScanIntervalFrames = 2`
- Nếu visual phản ứng hơi trễ khi vượt enemy lane kề/cùng lane, thử tăng `forwardScanRange` lên `14` hoặc `16`.
- Không khuyến nghị đưa `forwardScanRange` lên lại `35` trên map hiện tại.
- Nếu muốn nhẹ hơn nữa, có thể thử `forwardScanIntervalFrames = 3`, nhưng cần test visual vì có thể làm phát hiện trễ hơn.

## Cập nhật scale 300 unit ngày 2026-06-17

User muốn chuẩn bị scale lên khoảng 300 unit trên map. Đã tối ưu bước đầu trong `assets/scripts/BattleSpatialGrid.ts`, chỉ đụng target-query worker, không đổi gameplay:

- Main thread không còn pack `targetSnapshot`/requests bằng `number[]`; đổi sang `Float64Array` có capacity reuse.
- `flushNearestWorkerRequests()` không còn `slice()` pending requests; pack trực tiếp vào buffer tái sử dụng.
- Worker source không còn tạo grid object/results array mới hoàn toàn mỗi batch:
  - giữ reusable `teamAGrid`, `teamBGrid`, key list, và `Int32Array` result buffer.
  - bỏ object `best` cấp phát mỗi request; dùng biến scratch `bestId`, `bestDistSq`.
- Vẫn giữ main-thread fallback: nếu worker không ready/fail thì `Unit` fallback qua spatial grid main thread như trước.
- Đã test worker source bằng Node/vm với batch mẫu; kết quả nearest đúng.

Lưu ý test tiếp:

- Hãy record trace 300 unit khoảng 60-90s, có Memory nếu trình duyệt chịu được.
- So lại `HandlePostMessage`, worker heap, `queryEnemies`, `collectNeighbors`.
- Nếu worker heap tăng rồi ổn định ở plateau nhỏ thì chấp nhận được; nếu tăng đều không hạ thì soi tiếp worker allocation.

## Handoff 2026-06-17 cuối ngày

User đã reverse source về mốc "vừa giữ fix BattleSpatialGrid worker, chưa giữ các thử nghiệm RVO". Đã rà lại sau reverse:

- `assets/scripts/rvo/RVO.ts` và `assets/scripts/rvo/RVOWorkerSimulator.ts` không còn diff, đã quay về logic gốc.
- Không còn residue của thử nghiệm RVO như `insertSortedNeighbor`, `neighborDistanceScratch`, `collectNeighbors(a, result, distances...)`, hoặc `applyAllyOvertake(a, cellSize)`.
- `currentNeighborAgent` vẫn còn trong RVO worker, nhưng đó là logic gốc.
- `assets/scripts/BattleSpatialGrid.ts` vẫn giữ tối ưu có ích:
  - `targetSnapshot` và `packedRequestData` là `Float64Array` reuse buffer.
  - `flushNearestWorkerRequests()` pack trực tiếp, không `slice()` pending requests.
  - Worker dùng reusable grid/key list và `Int32Array` result buffer.
- Working tree sau reverse chủ yếu dirty ở generated/log (`library/.assets-info.json`, `temp/...`). Không tự ý revert nếu không được yêu cầu.

Các trace thử nghiệm RVO trong ngày:

- `Trace-20260617T144755.json`: baseline scale khoảng 230 unit sau fix BattleSpatialGrid worker, vẫn playable; target worker heap thấp; RVO/postMessage bắt đầu là vùng cần theo dõi.
- Thử tối ưu RVO `collectNeighbors` bằng bounded insertion và lọc overlap sớm: không hiệu quả.
- Thử đổi `applyAllyOvertake` sang grid-scan: tệ hơn loop tuyến tính ở cỡ 230 unit.
- Sau các trace `Trace-20260617T153807.json`, `Trace-20260617T155317.json`, `Trace-20260617T160059.json`, kết luận là không giữ hướng RVO micro-opt này. Đừng lặp lại bounded insertion/grid-scan RVO nếu chưa có benchmark cục bộ chứng minh ngược lại.

Hướng performance tiếp theo nếu cần quay lại:

- Tạm không đào sâu tối ưu nữa theo ý user.
- Nếu cần tiếp tục sau này, ưu tiên đo được average/max alive agent count trong trace hoặc bằng debug counter nhẹ trước khi tối ưu.
- Hướng đáng cân nhắc hơn RVO micro-opt là giảm tần suất/khối lượng worker payload hoặc thêm spawn/backpressure theo gameplay, nhưng phải test visual kỹ.

Ghi chú UI bottom bar:

- User đang thiết kế `ui-bottom` gồm `icon-container` bên trái và `minimap` bên phải.
- Vấn đề: minimap size do code quyết định, có thể làm `icon-container` overlap hoặc tạo gap.
- Cocos built-in `Layout` không có flex-grow kiểu CSS để một child tự ăn phần còn lại khi sibling đổi size động.
- `Widget` stretch được theo parent/ancestor, nhưng không tự gắn mép phải của `icon-container` vào mép trái của `minimap`.
- Nếu muốn không viết TS, chỉ ổn khi minimap fixed/percent size trong Inspector. Nếu minimap vẫn dynamic bằng code, giải pháp sạch nhất là một component layout nhỏ sync `iconWidget.right = minimapWidth + gap`, nhưng user hiện muốn tìm cách khác và tạm chưa triển khai.

## Handoff 2026-06-18: UI, minimap sizing, FairyGUI

User tạm dừng ở đây. Hôm nay chủ yếu bàn và sửa phần UI layout quanh minimap.

Trạng thái UI hiện tại:

- User đang xây dựng UI, trong đó có `ui-bottom`, `icon-container` và minimap.
- Vấn đề: minimap trước đây tự tính size từ `worldToMiniMapScale`, nên khi world bounds/scale thay đổi thì width/height minimap thay đổi, dễ xung đột layout với các thành phần UI khác.
- Đã thử ý tưởng fixed width rồi user đổi yêu cầu sang fixed height.

Thay đổi đã code trong `assets/scripts/TrueMiniMapPanel.ts`:

- Thêm inspector property:
  - `fixedMapHeight = 0`
- Logic `configureMapSize()` hiện là:
  - Nếu `fixedMapHeight > 0`: giữ height minimap cố định, width tự tính theo ratio battlefield.
  - Nếu `fixedMapHeight <= 0`: fallback về logic cũ dùng `worldToMiniMapScale`.
- Công thức fixed-height:
  - `worldWidth = battleMaxX - battleMinX`
  - `worldHeight = battleMaxZ - battleMinZ`
  - `mapHeight = fixedMapHeight`
  - `mapWidth = mapHeight * worldWidth / worldHeight`
- Với map user nói `x = -8..8`, `z = -21..21`, ratio width/height là `16/42`.
  - Ví dụ `fixedMapHeight = 210` thì `mapWidth = 80`.
- Không còn `fixedMapWidth` trong source.
- Các logic icon/clamp/overlap/click không cần đổi vì vẫn dùng `mapWidth/mapHeight` sau khi tính.

Lưu ý khi test UI:

- Cần set `fixedMapHeight` trong Inspector của node minimap nếu muốn layout ổn định theo chiều cao.
- Nếu để `fixedMapHeight = 0`, minimap vẫn chạy theo `worldToMiniMapScale` như trước.
- Cocos Editor có thể đã ghi thay đổi vào `assets/Test.scene` khi user chỉnh UI. Đừng tự revert scene nếu user không yêu cầu.
- Working tree hiện có nhiều file generated/temp/library dirty do Cocos Editor. Đừng lẫn với source change thật.

FairyGUI discussion:

- User hỏi có thư viện miễn phí cho Cocos dynamic layout không.
- Đã rà và trao đổi:
  - `FairyGUI-cocoscreator` là runtime/framework cho Cocos Creator, repo chính thức ghi MIT license.
  - FairyGUI runtime dùng object/API riêng như `GRoot`, `GComponent`, `GButton`, `GList`, `GTextField`, không phải thao tác từng UI bằng Cocos `Node/Button/Label` thuần.
  - Workflow cơ bản: thiết kế trong FairyGUI Editor -> publish package -> đưa vào Cocos -> `fgui.UIPackage.addPackage(...)` -> `fgui.UIPackage.createObject(...)` -> add vào `fgui.GRoot`.
- Nhận định:
  - Nếu chỉ xử lý minimap/bottom bar thì không nên đưa FairyGUI vào, custom Cocos layout nhỏ rẻ hơn.
  - Nhưng user nói game sẽ có menu chọn lính, chọn bùa, inventory, popup, list/grid... nên FairyGUI đáng cân nhắc nghiêm túc cho UI lớn.
  - Không nhất thiết migrate minimap hiện tại sang FairyGUI ngay; minimap realtime/gameplay có thể giữ bằng Cocos, còn menu/inventory/chọn lính/chọn bùa có thể nghiên cứu FairyGUI.
- Về free/paid:
  - Runtime Cocos trên GitHub là MIT.
  - Phần free/paid nhiều khả năng nằm ở FairyGUI Editor/tooling/workflow, không phải runtime Cocos.
  - Khuyến nghị chưa mua vội; thử bản free bằng một vertical slice nhỏ trước: bottom HUD placeholder, chọn lính list/grid, inventory scroll/list item, export vào Cocos và đo workflow/performance.

Trạng thái dừng:

- User tạm dừng, chưa quyết định dùng FairyGUI.
- Source change đáng chú ý hiện tại: `TrueMiniMapPanel.ts` có `fixedMapHeight`.
- Scene/UI có thể đang dirty do chỉnh bằng Cocos Editor.
- Nếu Codex khác làm tiếp, hãy đọc source hiện tại trước khi sửa, đặc biệt `TrueMiniMapPanel.ts` và `assets/Test.scene`.

## Handoff 2026-06-18 cuối ngày: Unit scan, freehunt recovery, rotation cleanup

User chuyển trọng tâm về performance/visual của unit sau các vòng test trace. Trạng thái source cần nhớ:

- `Unit` Inspector đã được sắp lại theo nhóm dễ chỉnh hơn:
  - visual/rotation: `visualRoot`, `visualYawOffset`, `rotationSpeed`, `moveThreshold`, `visualThreshold`
  - movement: `moveSpeed`, `radius`
  - combat range: `attackRange`, `attackCheckIntervalFrames`
  - freehunt search: `targetSearchRange`, `targetSearchIntervalFrames`
  - forward scan: `forwardScanRange`, `forwardScanIntervalFrames`, `Use Wave Front Scanner`
  - lane return: `laneReturnTolerance`
  - runtime defaults/state: `forwardDir`, `onForward`, `isSteady`
  - ally overtake settings
- Forward scan không còn round-robin. `BattleWave.pickFrontMostForwardScanner()` chọn unit alive/onForward đi xa nhất theo dot(`agent.pos`, `forwardDir`) làm scanner của wave trong frame hiện tại.
- `forwardScanIntervalFrames` vẫn là nhịp scan enemy thật. `Use Wave Front Scanner = false` sẽ cho mọi unit đang forward scan như kiểu cũ.
- `Forward Scanner Switch Interval Frames` đã bị bỏ khỏi source.
- Freehunt target sharing: unit không có target hợp lệ sẽ tự search theo `targetSearchRange` trước. Nếu không tự tìm được mới hỏi target của đồng đội trong wave; target mượn không áp `targetSearchRange`.
- Nếu wave đã release forward/freehunt nhưng toàn wave không engaged và không ai có target hợp lệ trong `freeHuntNoTargetRecoveryFrames`, `GameManager.processForwardReleaseRecoveries()` sẽ `resumeForward()` tại lane hiện tại.
- Hero unlock/freehunt dùng `heroFreeHuntSearchRange` để tránh trường hợp range thường quá ngắn làm unit mất target khi hero phase.
- Rotation cleanup: các thử nghiệm smooth-damp/move-threshold mới đã bị bỏ. Rotation đang dùng logic cũ (`rotationSpeed`, `lerpAngle`) cộng thêm reset `lastStablePos` khi đổi mode. Riêng khi `returningToWaveLaneSlot`, unit xoay theo hướng trái/phải về lane target thay vì đọc delta visual, để giảm cảm giác step-step trong regroup.

Trace cuối ngày:

- `Trace-20260618T181936.json` với setting user gửi:
  - `targetSearchRange = 8`
  - `forwardScanRange = 12`
  - `forwardScanIntervalFrames = 30`
  - `Use Wave Front Scanner` bật
  - `attackCheckIntervalFrames = 15`
  - `targetSearchIntervalFrames = 30`
- Kết quả trace ổn:
  - `FireAnimationFrame` avg khoảng `1.64ms`
  - p95 khoảng `3.22ms`
  - p99 khoảng `5.36ms`
  - max khoảng `14.56ms`
  - không có RAF frame vượt `16.7ms`
- Nhận định: tăng interval lên cao giúp nhẹ nhưng không tạo cải thiện lớn so với report trước. Nếu visual phản ứng trễ, test lại cấu hình trung gian như `forwardScanIntervalFrames = 15-20`, `attackCheckIntervalFrames = 8-12`.

Lưu ý:

- Đừng quay lại round-robin scanner nếu chưa có lý do visual rõ ràng. Front-most scanner vừa ít thông số vừa hợp logic "người đi đầu phát hiện trước".
- Nếu sửa rotation tiếp, chỉ tập trung pha cụ thể. Tránh reintroduce `rotationSmoothTime`, smooth-damp angle, hoặc visual velocity filter cũ vì user đã test thấy rung hơn.
- Working tree có nhiều file generated/temp/library dirty do Cocos. Không tự revert/clean chúng nếu user không yêu cầu.

## Handoff 2026-06-19: A2 rung/nhích sau ally wave, kết luận debug

User báo một case visual không hẳn là bug:

- A1 và B1 đang đánh nhau ở mid.
- A2 cũng ở mid đang forward, bị A1 chắn phía trước nên đứng sau chờ tràn lên.
- Khi một unit hàng đầu của B1 chết, unit A2 phía sau có cảm giác rung/nhích như sắp đi hướng khác.

Đã thêm debug tạm thời rồi sau đó đã gỡ sạch khỏi source theo yêu cầu user. Không còn `MotionDebug`, `WaveDebug`, hoặc các property debug trong `GameManager.ts`/`Unit.ts`.

Kết quả debug user test:

- Không có `MotionDebug` khi chỉ log trường hợp unit vẫn `onForward=true` nhưng movement bị lệch. Vì vậy không phải RVO bẻ hướng trong lúc vẫn forward.
- Có `WaveDebug`.
- Không có `combat-recover-resume-forward`, nên không phải regroup/recover-forward.
- Có nhiều log:
  - `forward-passed-target-release`
  - `forward-passed-target-release-target-wave`
- Kết luận: wave A2 bị rule `onWaveForwardPassedAdjacentTarget()` kích hoạt, tức là vượt target cùng lane/lane kề thì `releaseForwardToFreeHunt()`. Visual nhìn như nhích/rung vì wave đã vào freehunt thật, nhưng phía trước nhiều ally A1 chắn nên không lao đi xa được.

Nhận định logic:

- Rule hiện tại đang hoạt động đúng theo yêu cầu cũ: vượt enemy cùng lane hoặc lane kề thì release cả wave sang freehunt.
- Nhưng trong case ally wave đang chắn phía trước và đang đánh enemy cùng lane, rule này hơi nhạy: wave sau có thể freehunt dù thực tế nên tiếp tục giữ forward/xếp hàng.
- User nêu hướng sửa có thể hợp lý: với enemy cùng lane thì bỏ rule "vượt enemy gần nhất -> freehunt"; chỉ cho wave cùng lane rời forward khi có ít nhất một unit trong wave thật sự engage (`onWaveCombatStarted`). Rule vượt enemy lane kề vẫn giữ để tránh bỏ qua giao tranh bên cạnh.
- Chưa code thay đổi này. Nếu tiếp tục, ưu tiên sửa nhỏ ở `Unit.updateForwardPhase()` hoặc `GameManager.onWaveForwardPassedAdjacentTarget()` để phân biệt target cùng lane và target lane kề.

## Handoff 2026-06-19: lane recovery theo unit cuối engage

User đã backup source và yêu cầu thử đổi sâu logic lane recovery:

- Không quyết định lane bằng lane của enemy cuối cùng nữa.
- Lane candidate của wave giờ lấy từ vị trí unit phe mình đang engage.
- Nếu nhiều unit đang engage, mỗi recovery frame ghi lại lane của unit đang `onBusy`; khi chỉ còn một unit còn engage, candidate sẽ phản ánh unit cuối cùng còn đánh.
- Khi kill xảy ra, `GameManager.onUnitKilled()` ghi lane candidate theo vị trí killer và victim để không mất thông tin nếu target chết/clear trong cùng frame.
- Wave chỉ regroup khi không còn engaged và không còn target hợp lệ đủ `freeHuntNoTargetRecoveryFrames`.
- Nếu có `lastEngagedUnitLaneId`, wave apply pending lane đó rồi regroup/forward.
- Nếu chưa từng engage mà chỉ chase rồi mất target, wave chọn lane theo majority vị trí các unit alive (`regroupWaveByMajorityLane()`), tie-break giữ lane hiện tại vì chỉ đổi khi count lane khác lớn hơn.

Các điểm code chính:

- `BattleWave.lastEngagedEnemyLaneId` đã đổi thành `lastEngagedUnitLaneId`.
- `BattleWave.noteEngagedEnemy()` và `preparePendingLaneFromLastEngagedEnemy()` đã bị bỏ/đổi sang:
  - `noteEngagedUnitLane(laneId)`
  - `preparePendingLaneFromLastEngagedUnit()`
- `GameManager.onWaveCombatStarted()` không còn note lane từ enemy. Nó gọi `noteWaveEngagedUnitLane(wave, unit)` và `noteWaveEngagedUnitLane(enemyWave, enemy)`.
- `GameManager.recoverWaveCombat()`:
  - nếu còn engaged: `noteCurrentEngagedUnitLane(wave)` rồi chờ.
  - nếu hết engaged nhưng còn target: chờ tiếp.
  - nếu no-target đủ frame: apply `lastEngagedUnitLaneId`; nếu không có thì majority lane.
- `GameManager.processForwardReleaseRecoveries()` cũng chỉ regroup sau khi `shouldRecoverNoTarget()` true; trước đó không apply lane sớm.

Điểm cần test kỹ:

- Hỗn chiến nhiều wave, một unit lẻ bị phục kích trong lúc regroup: kỳ vọng wave không còn bị enemy lane kéo quá mạnh; lane lấy theo unit phe mình hoặc majority khi mất target.
- Case unit bị giết khi đang là unit cuối engage: hiện kill callback vẫn ghi candidate bằng vị trí victim. Nếu visual không ổn, có thể cân nhắc chỉ ghi candidate cho killer, còn victim wave fallback majority.
- Hero phase: `shouldForceTeamFreeHunt()` vẫn ưu tiên force freehunt, không nên bị majority regroup phá.
- Nếu wave chase lâu vì còn target hợp lệ, đó là intentional theo yêu cầu mới; regroup chỉ xảy ra khi toàn wave mất target.

## Handoff 2026-06-19: wave state sync fix

User clarified an important invariant:

- If one unit in a wave engages, the whole wave must leave forward/regroup and enter combat/freehunt.
- While any unit in a wave is still `onBusy`, the wave must not regroup/resume forward.
- Regroup/resume forward must be wave-wide, not "most units regroup while busy units are skipped".

Code changes:

- `BattleWave.resumeForward()` is now all-or-nothing:
  - returns `false` if the wave is released or any unit is `onBusy`.
  - if it runs, it applies `setWaveForwardLane(...)` to every alive unit.
  - removed the old per-unit `if (u.onBusy) continue` exception.
- `BattleWave.tryApplyPendingLaneTransfer()` always refuses to apply while the wave has any engaged unit.
  - The old `skipEngagedCheck` behavior is intentionally neutralized, even though the parameter remains as `_skipEngagedCheck` to avoid changing call sites.
- `BattleWave.enterCombatMode()` no longer early-returns when `combatModeActive` is already true.
  - Every new engage re-broadcasts combat mode to all alive units, clearing any accidental regroup/forward state across the whole wave.

Expected behavior after this fix:

- Regroup/forward and combat/freehunt are synchronized at wave level.
- A new engage during regroup immediately pulls the whole wave back into combat/freehunt.
- A wave cannot partially resume forward while one of its units is still fighting.

## Handoff 2026-06-19: regroup slot vs lane discussion

### Current Source State

- Regroup/resume still uses slot-based lane return.
- `BattleWave.resumeForward()` calls `Unit.setWaveForwardLane(laneId, forwardLaneOffsetX)` for every alive unit only when the whole wave is free of `onBusy`.
- `Unit.setWaveForwardLane(...)` sets:
  - `laneId`
  - `forwardLaneOffsetX`
  - `returningToWaveLaneSlot = true`
  - `onForward = false` while returning
- `Unit.shouldReturnToLaneSlot()` checks distance to:
  - `GameManager.getLaneCenterX(laneId) + forwardLaneOffsetX`
- Therefore a unit that is already inside the correct lane can still make a small horizontal correction if it is not close enough to its own slot X.

### User Concern

User asked whether regroup should ignore exact slot and only require the unit to be inside the target lane.

Desired possible behavior:

- If a unit is already inside the target lane, it should immediately forward.
- Only units outside the target lane should move horizontally back into the lane.
- This would reduce tiny regroup corrections and reduce visual "regroup finished but still twitching into formation".

### Analysis

- Performance cost of lane-based return would be tiny:
  - current slot check is a few arithmetic operations per regrouping unit.
  - lane bounds check would also be a few arithmetic operations per regrouping unit.
- `forwardLaneOffsetX` is currently useful cached formation data and should not be removed casually.
- Pure lane-based return has a visual risk:
  - units entering from a neighboring lane may stop as soon as they touch the lane edge.
  - this can make a wave forward while crowded on the lane border instead of near the lane center.
  - with only three lanes, border crowding may make adjacent-lane combat look ambiguous.

### Current Decision

- Do not change regroup logic yet.
- Keep current slot-based return for now.
- User paused this topic and wants to revisit later.

### If Continuing Later

Prefer a middle-ground design instead of pure lane-edge acceptance:

- Do not require exact formation slot.
- Require the unit to enter a center band around the lane center.
- Example concept:
  - target lane center = `GameManager.getLaneCenterX(laneId)`
  - allow forward if `abs(unitX - laneCenterX) <= laneCenterTolerance`
  - move horizontally toward lane center only while outside that center band
- This avoids tiny slot corrections while also avoiding units gathering on lane edges.

Implementation should be small and localized, likely in `Unit.shouldReturnToLaneSlot()` / `Unit.updateForwardPrefVelocity()`. Do not remove `forwardLaneOffsetX` unless there is a larger formation redesign.

## Handoff 2026-06-19: majority-only lane recovery

User clarified the intended lane recovery rule:

- After a wave leaves forward and enters freehunt/combat, units may chase naturally.
- A unit without a target can search, then borrow a valid target from teammates.
- The wave should keep freehunt/chase until the whole wave has no `onBusy` unit and no valid target.
- Only then should the wave choose its next `laneId`.
- The next `laneId` should be based on the current positions of the alive units in the wave, not on enemy lane and not on a single engaged unit.
- If most alive units are near left, choose left; if most are near mid, choose mid. Current implementation keeps current lane on ties because `getMajorityLaneIdForWave()` only switches when another lane has a strictly larger count.

This supersedes the earlier `lastEngagedUnitLaneId` approach.

Code changes made:

- Removed `BattleWave.pendingLaneId`.
- Removed `BattleWave.lastEngagedUnitLaneId`.
- Removed `BattleWave.noteEngagedUnitLane()`.
- Removed `BattleWave.preparePendingLaneFromLastEngagedUnit()`.
- Removed `BattleWave.tryApplyPendingLaneTransfer()` and related pending-lane helpers.
- Removed `GameManager.pendingLaneWaves` and `processPendingWaveLaneTransfers()`.
- Removed `GameManager.onUnitKilled()` because it only existed to record lane candidates.
- Removed the `gm.onUnitKilled(...)` call from `UnitBehavior`.
- `GameManager.onWaveCombatStarted()` now only broadcasts combat state to both involved waves and no longer records a lane candidate.
- `GameManager.recoverWaveCombat()` now:
  - returns while the wave has any engaged unit,
  - returns while `shouldRecoverNoTarget(...)` is false,
  - then calls `regroupWaveByMajorityLane(wave)`.
- `GameManager.processForwardReleaseRecoveries()` uses the same rule after forward-release/freehunt:
  - wait while engaged,
  - wait while any valid target remains,
  - then `regroupWaveByMajorityLane(wave)`.

Expected behavior:

- A single outlier/dead/last-engaged unit can no longer drag the whole wave to its lane.
- The observed dangerous flow `mid -> regroup left -> return mid` caused by `lastEngagedUnitLaneId` should be removed.
- If a wave chases toward an enemy that dies before contact, it should regroup based on where its units currently are, reducing the old "run out then snap back to original lane" behavior.

Current caveats:

- Same-lane `forward-passed-target-release` still exists. A wave can still enter freehunt after passing a same-lane target; that is a separate issue and was not changed in this patch.
- Regroup still uses slot-based lane return, not lane-band return. A later UX fix may adjust `Unit.shouldReturnToLaneSlot()` / `Unit.updateForwardPrefVelocity()`.
- `findNearestEnemyInCurrentLane()` remains unused in `GameManager`; it is legacy/dead code and was not touched in this patch.

## Handoff 2026-06-21: performance audit, orbit tap, healthbar instancing, render budget

### Current Status

- Visual gameplay is currently acceptable enough for the user to move toward graphics/VFX/UI work.
- The main risk is no longer basic wave AI correctness, but keeping frame budget stable when adding more visuals.
- Recent Chrome trace reports show no clear memory leak:
  - DOM nodes stayed stable.
  - event listeners stayed stable.
  - JS heap showed normal sawtooth allocation/GC behavior.
- Orbit view is not a sustained performance problem in the latest traces. It had one worse spike, but average/p95/p99 were comparable or slightly better than top-down.

### Source Changes Recently Confirmed

#### `BattleSpatialGrid.ts`

- Target-search worker now uses reusable typed arrays:
  - `targetSnapshot: Float64Array`
  - `packedRequestData: Float64Array`
- `flushNearestWorkerRequests()` packs batch nearest-target requests into typed arrays before `postMessage`.
- Worker result handling validates both requester and target by `lifeId`, so pooled/despawned units should not remain valid stale targets.
- Main-thread fallback still exists if worker creation/postMessage fails.
- Current profile result:
  - `flushNearestWorkerRequests` is the largest project-specific main-thread item, but still small relative to the full 60s trace.
  - Do not move it back to raw `number[]` unless there is a measured reason.

#### `GameManager.ts`

- Majority-lane regroup remains the active lane recovery rule:
  - after freehunt/combat, wait until no unit is engaged and the wave has no valid target for `freeHuntNoTargetRecoveryFrames`;
  - then choose lane by majority position of alive units;
  - tie keeps current lane because the code only switches when another lane has strictly larger count.
- `laneVoteCounts` is reused as a small buffer to avoid allocating a new array on every majority-lane vote.
- `processForwardReleaseRecoveries()` iterates `forwardReleasedWaves.keys()` directly. Avoid reintroducing `Array.from(...)` in this hot-ish loop.
- Hero unlock/freehunt remains intentional:
  - when a team cannot spawn normal units anymore and has no alive normal units, hero can be released from steady;
  - hero kills should not award CP.

#### `Unit.ts`

- Forward rotation was changed to follow movement intent (`agent.prefVel`) instead of tiny visual-position deltas.
- Current forward path:
  - set pref velocity;
  - call `lookMoveIntentSmooth(deltaTime)`;
  - call `sync(deltaTime, false)`.
- `lookMoveIntentSmooth()` caches the last intended direction and stops rotating when:
  - pref velocity is near zero;
  - or visual yaw is within about `0.5` degree.
- This was meant to reduce:
  - units standing still but rotating back and forth;
  - units looking one way while moving another way during forward/regroup transitions.
- `returningToWaveLaneSlot` still uses lane-return facing logic, not full formation redesign.

#### `BattleCinematicCameraController.ts`

- Battlefield unit tap/click focus exists.
- Implementation:
  - listens to touch/mouse start/end;
  - ignores drag by `unitTapMaxMovePixels`;
  - projects screen point to battle plane;
  - scans alive units from both teams and picks closest unit within `unitTapPickRadius` / unit radius;
  - calls orbit focus on the picked unit.
- This is not per-frame work. It only runs on tap/click, so current cost is acceptable.
- It is not currently using spatial grid. That is fine for now because user input events are rare.
- If unit count later grows much higher and tap picking becomes expensive, optimize by querying nearby grid cells around the projected tap point instead of scanning both alive arrays.

#### `HealthBar3D.ts`, `HealthBar.effect`, `HealthBarMat.mtl`

- Healthbar is set up for instancing.
- `HealthBarMat.mtl` has `USE_INSTANCING: true`.
- `HealthBar.effect` reads:
  - `a_health_params`
  - `a_bar_color`
- `HealthBar3D` writes per-instance data via:
  - `renderer.setInstancedAttribute('a_health_params', ...)`
  - `renderer.setInstancedAttribute('a_bar_color', ...)`
- Blue and Red prefabs both reference the same `HealthBarMat` material asset.
- No source code currently calls `getMaterialInstance`, `setMaterial`, `setProperty`, or `customMaterial` for healthbars.
- Recent fix:
  - reused `healthParams` and `barColor` arrays instead of allocating new arrays;
  - added `colorDirty`;
  - reapplies color when bar becomes visible, fixing the case where some healthbars showed only background color without the colored HP fill.
- Caveat:
  - `renderer.enabled` is toggled when full HP / damaged. This can add/remove instances from the batch, but it is still better than rendering every full-health bar.

### Latest Trace Comparison: top-down vs orbit

Files compared:

- `Trace-20260621T213922.json` = top-down.
- `Trace-20260621T214149-orbit.json` = orbit.

Main thread / RAF summary:

| Metric | Top-down | Orbit |
| --- | ---: | ---: |
| `FireAnimationFrame` average | about `1.411ms` | about `1.375ms` |
| p95 | about `3.673ms` | about `3.655ms` |
| p99 | about `5.082ms` | about `4.614ms` |
| max | about `9.541ms` | about `29.562ms` |
| frames over `8.33ms` | `9` | `10` |
| frames over `16.67ms` | `0` | `1` |

Memory/counter summary:

- Nodes stable in both reports.
- Listeners stable in both reports.
- Heap sawtooth is normal allocation + GC, not retained growth.
- Orbit had lower heap p50/p95/max than top-down in this pair of traces, but one worse frame spike.

Interpretation:

- Orbit camera code is not the sustained bottleneck.
- The single orbit spike should be watched, but not treated as proof that orbit is broken.
- Rendering/engine work is more important than camera math:
  - WebGL buffer/update calls;
  - Cocos UBO/pass updates;
  - instanced world matrix updates;
  - material/render-state churn.

### Performance Findings To Keep In Mind

- RVO worker is currently acceptable.
  - Hot worker function is `collectNeighbors`, as expected.
  - It is off-main-thread and did not dominate the traces.
- Target-search worker is currently acceptable.
  - The worker scan functions are cheap.
  - Main-thread request packing is visible but not currently dangerous.
- The next likely performance risks are visual/render features:
  - too many VFX nodes;
  - unpooled particles;
  - per-unit material instances;
  - dynamic material property updates per frame;
  - many transparent objects;
  - shadows/lights on many units;
  - healthbar or UI elements that accidentally stop batching.

### What Worked

- Keeping AI scans throttled:
  - `attackCheckIntervalFrames`
  - `targetSearchIntervalFrames`
  - `forwardScanIntervalFrames`
- Using the front-most wave scanner for forward scan instead of every unit scanning every frame.
- Moving target search and RVO work to workers with main-thread fallback.
- Using runtime per-frame wave cache instead of event/counter bookkeeping.
- Majority-lane recovery removed several bad cases caused by last enemy/last engaged lane dragging the whole wave.
- Healthbar instancing plus per-instance attributes is the right direction.
- Unit tap orbit focus as event-only scan is acceptable; no need to over-optimize it yet.

### What To Avoid

- Do not create material instances per healthbar/unit just to change HP color or fill.
  - Use instanced attributes for per-unit variation.
- Do not call `material.setProperty(...)` per unit per frame.
- Do not add permanent debug logging in `Unit.update`, target search, RVO, or recovery loops.
- Do not reintroduce event/counter alive/engaged bookkeeping unless a new trace proves it helps; it was previously tested and not better.
- Do not widen `targetSearchRange` / `forwardScanRange` casually.
  - The battlefield is small (`x=-8..8`, `z=-21..21`), so large ranges quickly behave like whole-map scans.
- Do not scan all units every frame for UI/minimap/camera helpers.
  - Tap/click scan is fine because it is event-only.
  - Realtime UI should use intervals, sampling, pooling, and cached wave data.
- Do not replace worker paths with main-thread-only logic unless debugging a worker failure.
- Do not start a large rewrite of regroup/lane logic while adding VFX unless there is a clear gameplay bug.

### Recommended Direction

#### For VFX/graphics

- Pool VFX nodes and particles.
- Prefer shared materials and instancing-friendly data.
- Keep unit count in mind: target scale is roughly `500-600` units.
- Avoid per-unit dynamic lights/shadows.
- If using particles, keep lifetime/count short and test worst-case clashes, not only clean 1v1 cases.
- Use Cocos/Chrome profiler after each visual feature, especially Draw Calls, GPU time, and RAF p95/p99.

#### For healthbars

- Keep the current instanced shader/material path.
- If adding more healthbar states, add per-instance attributes instead of material instances.
- Verify in Cocos profiler that many visible healthbars do not increase draw calls linearly.

#### For wave/unit logic

- Keep majority-lane recovery as the active baseline.
- Preserve the invariant:
  - if one unit in a wave engages, the whole wave should leave forward/regroup and enter combat/freehunt;
  - regroup/forward only resumes when the wave has no engaged unit and no valid target for the configured recovery frames.
- Same-lane `forward-passed-target-release` still exists. If user reports rear waves behind an ally frontline entering freehunt too early, revisit that rule specifically.
- Avoid mixing new lane-transfer concepts with old pending-lane / enemy-lane / last-kill rules.

#### For camera/orbit

- Current unit tap-to-orbit is okay.
- Keep it event-driven.
- If optimizing later, spatial-grid pick around tap point is the natural next step, but only after measurement.

### Quick Checklist For The Next Codex

- Before changing logic, read:
  - `GameManager.ts`
  - `BattleWave.ts`
  - `Unit.ts`
  - `BattleSpatialGrid.ts`
  - `HealthBar3D.ts`
  - `BattleCinematicCameraController.ts`
- If performance regresses after visual work, inspect render/material/VFX first before blaming AI.
- If logic regresses, check whether a new change broke wave-wide state sync or majority-lane recovery.
- Keep generated Cocos files in `library/` and `temp/` out of source reasoning unless the user explicitly asks about them.

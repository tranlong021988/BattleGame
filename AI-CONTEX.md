# AI-CONTEX

Handoff note cho Codex khác khi làm tiếp dự án `BattleGame`.

Ngày ghi chú: 2026-06-16.

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
- Wave của unit `noteEngagedEnemy(enemy)`.
- Wave vào `combatModeActive`.
- Enemy wave cũng được note và vào combat mode.
- `BattleWave.enterCombatMode()` làm toàn wave thoát forward, các unit chuyển sang wave combat/freehunt behavior.

Freehunt hiện là unit-level hunt toàn map, nhưng được điều tiết bởi wave recovery:

- Unit tự tìm enemy gần nhất qua spatial grid/worker.
- Khi unit engage, lane của enemy cuối cùng được ghi vào `lastEngagedEnemyLaneId`.
- Khi wave không còn unit nào engaged, `GameManager.recoverWaveCombat()` hoặc `processForwardReleaseRecoveries()` sẽ dùng `preparePendingLaneFromLastEngagedEnemy()`.
- Nếu có pending lane và wave không còn engaged, `tryApplyPendingLaneTransfer()` đổi lane, rồi forward.

Nếu wave release forward/freehunt nhưng chưa bao giờ engage ai, nó có thể không có `lastEngagedEnemyLaneId`. Trường hợp này hiện không có timeout cố ép forward. User đã chấp nhận edge case "con mồi bị wave khác cướp mất thì cứ freehunt tới khi engage".

## Lane decision hiện tại

Lane mới không dựa vào target đã chọn và cũng không dựa vào kill cuối.

Logic hiện tại:

- Lane transfer dựa trên enemy cuối cùng đã engage (`lastEngagedEnemyLaneId`).
- `GameManager.onWaveCombatStarted()` note lane cho cả hai wave.
- `GameManager.onUnitKilled()` cũng gọi `killerWave.noteEngagedEnemy(victim)` để ghi lane từ victim.
- Nếu không còn engaged, wave có pending lane thì đổi sang lane đó.

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
- `unlockHeroForward()` set `heroForwardUnlocked[team] = true`, `hero.setSteady(false, false)`, `hero.enterFreeHuntMode()`.
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

- Nếu wave freehunt nhưng chưa kịp engage, mà target bị wave khác giết, wave có thể chưa có `lastEngagedEnemyLaneId`. Hiện không có timeout. User từng nói chấp nhận cho nó freehunt tới khi engage.
- Nếu thấy wave chuyển lane kỳ lạ, kiểm tra `lastEngagedEnemyLaneId`, `noteEngagedEnemy()`, `onWaveCombatStarted()`, `onUnitKilled()`.
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


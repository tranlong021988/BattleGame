System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, RVOAgent, RVOSimulator, _crd;

  _export({
    RVOAgent: void 0,
    RVOSimulator: void 0
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "220c2A87xFMoI08RgeZmoqI", "RVO", undefined);

      _export("RVOAgent", RVOAgent = class RVOAgent {
        constructor(x, z) {
          this.pos = {
            x: 0,
            z: 0
          };
          this.vel = {
            x: 0,
            z: 0
          };
          this.prefVel = {
            x: 0,
            z: 0
          };
          this.maxSpeed = 2;
          this.radius = 0.5;
          this.waveRuntimeId = -1;
          // ===== neighbor tuning =====
          this.neighborDist = 2.4;
          this.maxNeighbors = 8;
          this.locked = false;
          this.canBePush = 0;
          this.isHero = 0;
          this.canBePassedThroughByForwardAlly = 0;
          this.team = -1;
          this.onForward = 0;
          this.forwardX = 0;
          this.forwardZ = 1;
          this.enableAllyOvertake = 0;
          this.overtakeLookAhead = 2.2;
          this.overtakeSideRange = 1.2;
          this.overtakeSideStrength = 0.75;
          this.overtakeSpeedDiff = 0.15;
          this.overtakeSeed = 1;
          this.overtakeSideLock = 0;
          this.overtakeHoldFrames = 0;
          this.forwardSlowFrames = 0;
          this.gridX = 0;
          this.gridZ = 0;
          this.pos.x = x;
          this.pos.z = z;
        }

      });

      _export("RVOSimulator", RVOSimulator = class RVOSimulator {
        constructor() {
          this.agents = [];
          this.circleObs = [];
          this.rectObs = [];
          this.grid = new Map();
          this.gridKeyRows = new Map();
          this.activeGridCells = [];
          this.neighborScratch = [];
          this.cellSize = 2.2;
          this.timeStep = 1 / 60;
          this.minStepDeltaTime = 1 / 120;
          this.maxStepDeltaTime = 1 / 20;
          this.overtakeSlowFrameThreshold = 8;
          // Số vòng chống xuyên vật cản.
          // Tăng lên 4-5 nếu unit chạy rất nhanh hoặc obstacle sát nhau.
          this.obstacleSolveIterations = 3;
          // ===== battlefield bounds =====
          this.useBounds = false;
          this.minX = -99999;
          this.maxX = 99999;
          this.minZ = -99999;
          this.maxZ = 99999;
        }

        setBattlefield(minX, maxX, minZ, maxZ) {
          this.useBounds = true;
          this.minX = minX;
          this.maxX = maxX;
          this.minZ = minZ;
          this.maxZ = maxZ;
        }

        destroy() {
          this.agents.length = 0;
          this.circleObs.length = 0;
          this.rectObs.length = 0;
          this.activeGridCells.length = 0;
          this.neighborScratch.length = 0;
          this.grid.clear();
          this.gridKeyRows.clear();
        }

        addAgent(x, z) {
          var a = new RVOAgent(x, z);
          this.agents.push(a);
          return a;
        }

        removeAgent(a) {
          var idx = this.agents.indexOf(a);

          if (idx >= 0) {
            this.agents.splice(idx, 1);
          }
        }

        setPrefVelocity(a, vx, vz) {
          a.prefVel.x = vx;
          a.prefVel.z = vz;
        }

        addCircleObstacle(x, z, r) {
          this.circleObs.push({
            x,
            z,
            r
          });
        }

        addRectObstacle(x, z, hx, hz, angle) {
          this.rectObs.push({
            x,
            z,
            hx,
            hz,
            cos: Math.cos(angle),
            sin: Math.sin(angle)
          });
        }

        clamp(v, min, max) {
          return Math.max(min, Math.min(max, v));
        }

        getSafeDeltaTime(deltaTime) {
          if (typeof deltaTime !== 'number' || !isFinite(deltaTime) || deltaTime <= 0) {
            return this.timeStep;
          }

          return this.clamp(deltaTime, this.minStepDeltaTime, this.maxStepDeltaTime);
        }

        buildGrid() {
          for (var i = 0; i < this.activeGridCells.length; i++) {
            this.activeGridCells[i].length = 0;
          }

          this.activeGridCells.length = 0;

          for (var _i = 0; _i < this.agents.length; _i++) {
            var a = this.agents[_i];
            var gx = Math.floor(a.pos.x / this.cellSize);
            var gz = Math.floor(a.pos.z / this.cellSize);
            a.gridX = gx;
            a.gridZ = gz;
            var key = this.getGridKey(gx, gz);
            var cell = this.grid.get(key);

            if (!cell) {
              cell = [];
              this.grid.set(key, cell);
            }

            if (cell.length <= 0) {
              this.activeGridCells.push(cell);
            }

            cell.push(a);
          }
        }

        getGridKey(gx, gz) {
          var row = this.gridKeyRows.get(gx);

          if (!row) {
            row = new Map();
            this.gridKeyRows.set(gx, row);
          }

          var key = row.get(gz);

          if (!key) {
            key = gx + "_" + gz;
            row.set(gz, key);
          }

          return key;
        }

        getNeighbors(a) {
          var result = this.neighborScratch;
          result.length = 0;
          var maxDistSq = a.neighborDist * a.neighborDist;
          var maxNeighbors = Math.max(0, Math.floor(a.maxNeighbors));

          if (maxNeighbors <= 0) {
            return result;
          }

          for (var x = -1; x <= 1; x++) {
            for (var z = -1; z <= 1; z++) {
              var key = this.getGridKey(a.gridX + x, a.gridZ + z);
              var cell = this.grid.get(key);
              if (!cell) continue;

              for (var i = 0; i < cell.length; i++) {
                var other = cell[i];
                if (other === a) continue;
                if (this.shouldIgnoreHeroAllyForwardPair(a, other)) continue;
                var dx = other.pos.x - a.pos.x;
                var dz = other.pos.z - a.pos.z;
                var distSq = dx * dx + dz * dz;
                if (distSq > maxDistSq) continue;
                this.insertNearestNeighbor(a, other, distSq, maxNeighbors, result);
              }
            }
          }

          return result;
        }

        shouldIgnoreHeroAllyForwardPair(a, b) {
          if (a.team < 0 || a.team !== b.team) return false;

          if (a.waveRuntimeId >= 0 && a.waveRuntimeId === b.waveRuntimeId) {
            return false;
          }

          if (a.isHero === 1 || b.isHero === 1) {
            return a.onForward === 1 || b.onForward === 1;
          }

          if (a.canBePassedThroughByForwardAlly === 1 && b.onForward === 1) {
            return true;
          }

          return b.canBePassedThroughByForwardAlly === 1 && a.onForward === 1;
        }

        insertNearestNeighbor(origin, candidate, candidateDistSq, maxNeighbors, result) {
          var insertAt = result.length;

          for (var i = 0; i < result.length; i++) {
            var other = result[i];
            var dx = other.pos.x - origin.pos.x;
            var dz = other.pos.z - origin.pos.z;
            var distSq = dx * dx + dz * dz;

            if (candidateDistSq < distSq) {
              insertAt = i;
              break;
            }
          }

          if (insertAt >= maxNeighbors) {
            return;
          }

          var end = Math.min(result.length, maxNeighbors - 1);
          result.length = Math.min(result.length + 1, maxNeighbors);

          for (var _i2 = end; _i2 > insertAt; _i2--) {
            result[_i2] = result[_i2 - 1];
          }

          result[insertAt] = candidate;
        }

        applyAllyOvertake(a, neighbors) {
          if (!a.enableAllyOvertake) return;
          if (a.locked) return;
          if (a.onForward !== 1) return;
          var best = null;
          var bestForwardDist = Infinity;
          var bestSideDist = 0;
          var lookAhead = Math.max(0, a.overtakeLookAhead);
          var sideRange = Math.max(0, a.overtakeSideRange);

          if (lookAhead <= 0 || sideRange <= 0) {
            return;
          }

          for (var i = 0; i < neighbors.length; i++) {
            var b = neighbors[i];
            if (b === a) continue;
            if (b.team !== a.team) continue;

            if (a.maxSpeed + a.overtakeSpeedDiff < b.maxSpeed) {
              continue;
            }

            var fasterThanBlocker = a.waveRuntimeId !== b.waveRuntimeId && a.maxSpeed > b.maxSpeed + a.overtakeSpeedDiff;

            if (!fasterThanBlocker && !this.isAllyOvertakeBlocker(b)) {
              continue;
            }

            var dx = b.pos.x - a.pos.x;
            var dz = b.pos.z - a.pos.z;
            var forwardDist = dx * a.forwardX + dz * a.forwardZ;
            if (forwardDist <= a.radius * 0.25) continue;
            if (forwardDist > lookAhead) continue;
            var sideDist = dx * a.forwardZ - dz * a.forwardX;

            if (Math.abs(sideDist) > sideRange + a.radius + b.radius) {
              continue;
            }

            if (forwardDist < bestForwardDist) {
              bestForwardDist = forwardDist;
              bestSideDist = sideDist;
              best = b;
            }
          }

          if (!best) {
            if (a.overtakeHoldFrames > 0) {
              a.overtakeHoldFrames--;
            } else {
              a.overtakeSideLock = 0;
            }

            return;
          }

          var side = a.overtakeSideLock;

          if (side === 0 || a.overtakeHoldFrames <= 0) {
            side = this.chooseOvertakeSide(a, neighbors, bestSideDist);
            a.overtakeSideLock = side;
          }

          a.overtakeHoldFrames = 12;
          var closeFactor = 1 - Math.min(1, bestForwardDist / Math.max(0.001, lookAhead));
          var strength = a.maxSpeed * a.overtakeSideStrength * (0.35 + closeFactor * 0.65);
          a.vel.x += a.forwardZ * side * strength;
          a.vel.z += -a.forwardX * side * strength;
          var speed = Math.sqrt(a.vel.x * a.vel.x + a.vel.z * a.vel.z);

          if (speed > a.maxSpeed) {
            a.vel.x = a.vel.x / speed * a.maxSpeed;
            a.vel.z = a.vel.z / speed * a.maxSpeed;
          }
        }

        updateForwardSlowFrames(a) {
          if (a.locked || a.onForward !== 1) {
            a.forwardSlowFrames = 0;
            return;
          }

          var prefForward = a.prefVel.x * a.forwardX + a.prefVel.z * a.forwardZ;

          if (prefForward <= a.maxSpeed * 0.25) {
            a.forwardSlowFrames = 0;
            return;
          }

          var currentForward = a.vel.x * a.forwardX + a.vel.z * a.forwardZ;

          if (currentForward < prefForward * 0.35) {
            a.forwardSlowFrames++;
          } else {
            a.forwardSlowFrames = 0;
          }
        }

        isAllyOvertakeBlocker(b) {
          if (b.locked) return true;
          if (b.onForward !== 1) return true;
          return b.forwardSlowFrames >= this.overtakeSlowFrameThreshold;
        }

        chooseOvertakeSide(a, neighbors, blockerSideDist) {
          var rightScore = this.getOvertakeSideClearanceScore(a, neighbors, 1);
          var leftScore = this.getOvertakeSideClearanceScore(a, neighbors, -1);

          if (Math.abs(rightScore - leftScore) > 0.001) {
            return rightScore > leftScore ? 1 : -1;
          }

          if (Math.abs(blockerSideDist) > 0.05) {
            return blockerSideDist > 0 ? -1 : 1;
          }

          return a.overtakeSeed >= 0 ? 1 : -1;
        }

        getOvertakeSideClearanceScore(a, neighbors, side) {
          var sideX = a.forwardZ * side;
          var sideZ = -a.forwardX * side;
          var lookAhead = Math.max(0.001, a.overtakeLookAhead);
          var sideRange = Math.max(0.001, a.overtakeSideRange);
          var score = 0;

          for (var i = 0; i < neighbors.length; i++) {
            var b = neighbors[i];
            if (b === a) continue;
            var dx = b.pos.x - a.pos.x;
            var dz = b.pos.z - a.pos.z;
            var forwardDist = dx * a.forwardX + dz * a.forwardZ;
            if (forwardDist < -a.radius) continue;
            if (forwardDist > lookAhead + b.radius) continue;
            var sideDist = dx * sideX + dz * sideZ;
            if (sideDist <= 0) continue;
            if (sideDist > sideRange + b.radius) continue;
            var forwardWeight = 1 - Math.min(1, Math.abs(forwardDist) / lookAhead);
            var sideWeight = 1 - Math.min(1, sideDist / (sideRange + b.radius));
            score -= (forwardWeight * 1.5 + sideWeight) * (b.radius + a.radius);
          }

          return score;
        } // =========================================================
        // HARD COLLISION: CIRCLE OBSTACLE
        // =========================================================


        pushAgentOutOfCircle(a, ob) {
          var dx = a.pos.x - ob.x;
          var dz = a.pos.z - ob.z;
          var distSq = dx * dx + dz * dz;
          var minDist = a.radius + ob.r;
          if (distSq >= minDist * minDist) return; // Nếu nằm đúng tâm obstacle thì đẩy đại sang +X

          if (distSq < 1e-8) {
            a.pos.x = ob.x + minDist + 0.001;
            a.pos.z = ob.z;
            return;
          }

          var dist = Math.sqrt(distSq);
          var nx = dx / dist;
          var nz = dz / dist;
          var push = minDist - dist + 0.001;
          a.pos.x += nx * push;
          a.pos.z += nz * push;
        } // =========================================================
        // HARD COLLISION: RECT OBSTACLE
        // Hỗ trợ cả trường hợp agent ở ngoài rect lẫn đã lọt vào trong rect.
        // =========================================================


        pushAgentOutOfRect(a, ob) {
          var dx = a.pos.x - ob.x;
          var dz = a.pos.z - ob.z; // World -> local rect space

          var lx = dx * ob.cos + dz * ob.sin;
          var lz = -dx * ob.sin + dz * ob.cos;
          var px = this.clamp(lx, -ob.hx, ob.hx);
          var pz = this.clamp(lz, -ob.hz, ob.hz);
          var ox = lx - px;
          var oz = lz - pz;
          var distSq = ox * ox + oz * oz;
          var nxL = 0;
          var nzL = 0;
          var push = 0; // Case 1: agent center ở ngoài rect

          if (distSq > 1e-8) {
            var dist = Math.sqrt(distSq);
            if (dist >= a.radius) return;
            nxL = ox / dist;
            nzL = oz / dist;
            push = a.radius - dist + 0.001;
          } // Case 2: agent center đã nằm bên trong rect
          else {
            var dLeft = lx + ob.hx;
            var dRight = ob.hx - lx;
            var dBottom = lz + ob.hz;
            var dTop = ob.hz - lz;
            var minD = dLeft;
            nxL = -1;
            nzL = 0;

            if (dRight < minD) {
              minD = dRight;
              nxL = 1;
              nzL = 0;
            }

            if (dBottom < minD) {
              minD = dBottom;
              nxL = 0;
              nzL = -1;
            }

            if (dTop < minD) {
              minD = dTop;
              nxL = 0;
              nzL = 1;
            } // Đẩy từ vị trí hiện tại ra khỏi cạnh gần nhất + bán kính agent


            push = minD + a.radius + 0.001;
          } // Local normal -> world normal


          var nx = nxL * ob.cos - nzL * ob.sin;
          var nz = nxL * ob.sin + nzL * ob.cos;
          a.pos.x += nx * push;
          a.pos.z += nz * push;
        }

        pushAgentOutOfObstacles(a) {
          for (var i = 0; i < this.circleObs.length; i++) {
            this.pushAgentOutOfCircle(a, this.circleObs[i]);
          }

          for (var _i3 = 0; _i3 < this.rectObs.length; _i3++) {
            this.pushAgentOutOfRect(a, this.rectObs[_i3]);
          }
        }

        clampToBattlefield(a) {
          if (!this.useBounds) return;
          a.pos.x = Math.max(this.minX + a.radius, Math.min(this.maxX - a.radius, a.pos.x));
          a.pos.z = Math.max(this.minZ + a.radius, Math.min(this.maxZ - a.radius, a.pos.z));
        }

        canMoveInHardSeparation(a) {
          return !a.locked || a.canBePush === 1;
        }

        step(deltaTime, maxSubStepDeltaTime) {
          var totalDt = this.getSafeTotalDeltaTime(deltaTime);
          var maxStep = this.getSafeMaxSubStepDeltaTime(maxSubStepDeltaTime);
          var remaining = totalDt;
          var guard = 0;

          while (remaining > 0.000001 && guard < 32) {
            var dt = Math.min(remaining, maxStep);
            this.stepOnce(dt);
            remaining -= dt;
            guard++;
          }

          return true;
        }

        getSafeTotalDeltaTime(deltaTime) {
          if (typeof deltaTime !== 'number' || !isFinite(deltaTime) || deltaTime <= 0) {
            return this.timeStep;
          }

          return Math.max(this.minStepDeltaTime, deltaTime);
        }

        getSafeMaxSubStepDeltaTime(maxSubStepDeltaTime) {
          if (typeof maxSubStepDeltaTime !== 'number' || !isFinite(maxSubStepDeltaTime) || maxSubStepDeltaTime <= 0) {
            return this.maxStepDeltaTime;
          }

          return this.clamp(maxSubStepDeltaTime, this.minStepDeltaTime, this.maxStepDeltaTime);
        }

        stepOnce(deltaTime) {
          var dt = this.getSafeDeltaTime(deltaTime);
          this.buildGrid(); // ===== VELOCITY =====

          for (var i = 0; i < this.agents.length; i++) {
            var a = this.agents[i];
            this.updateForwardSlowFrames(a);
            if (a.locked) continue;
            var vx = a.prefVel.x;
            var vz = a.prefVel.z;
            var neighbors = this.getNeighbors(a); // ===== agent-agent avoidance =====

            for (var j = 0; j < neighbors.length; j++) {
              var b = neighbors[j];
              var dx = a.pos.x - b.pos.x;
              var dz = a.pos.z - b.pos.z;
              var distSq = dx * dx + dz * dz;
              var minDist = a.radius + b.radius;
              if (distSq < 0.0001) continue;

              if (distSq < minDist * minDist) {
                var dist = Math.sqrt(distSq);
                var nx = dx / dist;
                var nz = dz / dist;
                var push = minDist - dist;
                vx += nx * push * 2;
                vz += nz * push * 2;
                var dot = vx * nx + vz * nz;

                if (dot < 0) {
                  vx -= nx * dot;
                  vz -= nz * dot;
                }
              }
            } // ===== circle obstacle velocity avoidance =====


            for (var _j = 0; _j < this.circleObs.length; _j++) {
              var ob = this.circleObs[_j];

              var _dx = a.pos.x - ob.x;

              var _dz = a.pos.z - ob.z;

              var _dist = Math.sqrt(_dx * _dx + _dz * _dz);

              var _minDist = a.radius + ob.r;

              if (_dist < _minDist && _dist > 0.0001) {
                var _nx = _dx / _dist;

                var _nz = _dz / _dist;

                vx += _nx * (_minDist - _dist) * 2;
                vz += _nz * (_minDist - _dist) * 2;

                var _dot = vx * _nx + vz * _nz;

                if (_dot < 0) {
                  vx -= _nx * _dot;
                  vz -= _nz * _dot;
                }
              }
            } // ===== rect obstacle velocity avoidance =====


            for (var _j2 = 0; _j2 < this.rectObs.length; _j2++) {
              var _ob = this.rectObs[_j2];

              var _dx2 = a.pos.x - _ob.x;

              var _dz2 = a.pos.z - _ob.z;

              var lx = _dx2 * _ob.cos + _dz2 * _ob.sin;
              var lz = -_dx2 * _ob.sin + _dz2 * _ob.cos;
              var px = this.clamp(lx, -_ob.hx, _ob.hx);
              var pz = this.clamp(lz, -_ob.hz, _ob.hz);
              var ox = lx - px;
              var oz = lz - pz;

              var _distSq = ox * ox + oz * oz; // Agent center ở ngoài rect


              if (_distSq > 1e-8) {
                if (_distSq < a.radius * a.radius) {
                  var _dist2 = Math.sqrt(_distSq);

                  var nxL = ox / _dist2;
                  var nzL = oz / _dist2;

                  var _nx2 = nxL * _ob.cos - nzL * _ob.sin;

                  var _nz2 = nxL * _ob.sin + nzL * _ob.cos;

                  vx += _nx2 * (a.radius - _dist2) * 2;
                  vz += _nz2 * (a.radius - _dist2) * 2;

                  var _dot2 = vx * _nx2 + vz * _nz2;

                  if (_dot2 < 0) {
                    vx -= _nx2 * _dot2;
                    vz -= _nz2 * _dot2;
                  }
                }
              } // Agent center đã ở trong rect
              else {
                var dLeft = lx + _ob.hx;
                var dRight = _ob.hx - lx;
                var dBottom = lz + _ob.hz;
                var dTop = _ob.hz - lz;

                var _nxL = -1;

                var _nzL = 0;
                var minD = dLeft;

                if (dRight < minD) {
                  minD = dRight;
                  _nxL = 1;
                  _nzL = 0;
                }

                if (dBottom < minD) {
                  minD = dBottom;
                  _nxL = 0;
                  _nzL = -1;
                }

                if (dTop < minD) {
                  minD = dTop;
                  _nxL = 0;
                  _nzL = 1;
                }

                var _nx3 = _nxL * _ob.cos - _nzL * _ob.sin;

                var _nz3 = _nxL * _ob.sin + _nzL * _ob.cos;

                vx += _nx3 * (a.radius + minD) * 2;
                vz += _nz3 * (a.radius + minD) * 2;

                var _dot3 = vx * _nx3 + vz * _nz3;

                if (_dot3 < 0) {
                  vx -= _nx3 * _dot3;
                  vz -= _nz3 * _dot3;
                }
              }
            }

            a.vel.x = vx;
            a.vel.z = vz;
            this.applyAllyOvertake(a, neighbors);
            vx = a.vel.x;
            vz = a.vel.z;
            var speed = Math.sqrt(vx * vx + vz * vz);

            if (speed > a.maxSpeed) {
              vx = vx / speed * a.maxSpeed;
              vz = vz / speed * a.maxSpeed;
            }

            a.vel.x = vx;
            a.vel.z = vz;
          } // ===== MOVE =====


          for (var _i4 = 0; _i4 < this.agents.length; _i4++) {
            var _a = this.agents[_i4];

            if (!_a.locked) {
              _a.pos.x += _a.vel.x * dt;
              _a.pos.z += _a.vel.z * dt; // Chống xuyên obstacle sau khi di chuyển.

              for (var _i5 = 0; _i5 < this.obstacleSolveIterations; _i5++) {
                this.pushAgentOutOfObstacles(_a);
              }
            }

            this.clampToBattlefield(_a);
          }

          this.buildGrid(); // ===== HARD SEPARATION: AGENT-AGENT =====

          for (var _i6 = 0; _i6 < this.agents.length; _i6++) {
            var _a2 = this.agents[_i6];

            var _neighbors = this.getNeighbors(_a2);

            for (var _j3 = 0; _j3 < _neighbors.length; _j3++) {
              var _b = _neighbors[_j3];

              var _dx3 = _b.pos.x - _a2.pos.x;

              var _dz3 = _b.pos.z - _a2.pos.z;

              var _distSq2 = _dx3 * _dx3 + _dz3 * _dz3;

              var _minDist2 = _a2.radius + _b.radius;

              if (_distSq2 < 0.0001) continue;

              if (_distSq2 < _minDist2 * _minDist2) {
                var _dist3 = Math.sqrt(_distSq2);

                var overlap = _minDist2 - _dist3;

                var _nx4 = _dx3 / _dist3;

                var _nz4 = _dz3 / _dist3;

                var aMovable = this.canMoveInHardSeparation(_a2);
                var bMovable = this.canMoveInHardSeparation(_b);

                if (aMovable && bMovable) {
                  var half = overlap * 0.5;
                  _a2.pos.x -= _nx4 * half;
                  _a2.pos.z -= _nz4 * half;
                  _b.pos.x += _nx4 * half;
                  _b.pos.z += _nz4 * half;
                } else if (aMovable && !bMovable) {
                  _a2.pos.x -= _nx4 * overlap;
                  _a2.pos.z -= _nz4 * overlap;
                } else if (!aMovable && bMovable) {
                  _b.pos.x += _nx4 * overlap;
                  _b.pos.z += _nz4 * overlap;
                }
              }
            }
          } // ===== HARD SEPARATION: OBSTACLE AGAIN =====
          // Sau agent-agent separation, agent có thể bị đẩy lấn vào obstacle,
          // nên cần solve obstacle thêm lần nữa.


          for (var _i7 = 0; _i7 < this.agents.length; _i7++) {
            var _a3 = this.agents[_i7];
            if (_a3.locked && _a3.canBePush !== 1) continue;

            for (var _i8 = 0; _i8 < this.obstacleSolveIterations; _i8++) {
              this.pushAgentOutOfObstacles(_a3);
            }

            this.clampToBattlefield(_a3);
          }

          this.buildGrid();
          return true;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8caf8513575212e5e25e9cb316f234d28dd51b24.js.map
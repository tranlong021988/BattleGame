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
          const a = new RVOAgent(x, z);
          this.agents.push(a);
          return a;
        }

        removeAgent(a) {
          const idx = this.agents.indexOf(a);

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
          for (let i = 0; i < this.activeGridCells.length; i++) {
            this.activeGridCells[i].length = 0;
          }

          this.activeGridCells.length = 0;

          for (let i = 0; i < this.agents.length; i++) {
            const a = this.agents[i];
            const gx = Math.floor(a.pos.x / this.cellSize);
            const gz = Math.floor(a.pos.z / this.cellSize);
            a.gridX = gx;
            a.gridZ = gz;
            const key = this.getGridKey(gx, gz);
            let cell = this.grid.get(key);

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
          let row = this.gridKeyRows.get(gx);

          if (!row) {
            row = new Map();
            this.gridKeyRows.set(gx, row);
          }

          let key = row.get(gz);

          if (!key) {
            key = gx + "_" + gz;
            row.set(gz, key);
          }

          return key;
        }

        getNeighbors(a) {
          const result = this.neighborScratch;
          result.length = 0;
          const maxDistSq = a.neighborDist * a.neighborDist;
          const maxNeighbors = Math.max(0, Math.floor(a.maxNeighbors));

          if (maxNeighbors <= 0) {
            return result;
          }

          for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
              const key = this.getGridKey(a.gridX + x, a.gridZ + z);
              const cell = this.grid.get(key);
              if (!cell) continue;

              for (let i = 0; i < cell.length; i++) {
                const other = cell[i];
                if (other === a) continue;
                if (this.shouldIgnoreHeroAllyForwardPair(a, other)) continue;
                const dx = other.pos.x - a.pos.x;
                const dz = other.pos.z - a.pos.z;
                const distSq = dx * dx + dz * dz;
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
          let insertAt = result.length;

          for (let i = 0; i < result.length; i++) {
            const other = result[i];
            const dx = other.pos.x - origin.pos.x;
            const dz = other.pos.z - origin.pos.z;
            const distSq = dx * dx + dz * dz;

            if (candidateDistSq < distSq) {
              insertAt = i;
              break;
            }
          }

          if (insertAt >= maxNeighbors) {
            return;
          }

          const end = Math.min(result.length, maxNeighbors - 1);
          result.length = Math.min(result.length + 1, maxNeighbors);

          for (let i = end; i > insertAt; i--) {
            result[i] = result[i - 1];
          }

          result[insertAt] = candidate;
        }

        applyAllyOvertake(a, neighbors) {
          if (!a.enableAllyOvertake) return;
          if (a.locked) return;
          if (a.onForward !== 1) return;
          let best = null;
          let bestForwardDist = Infinity;
          let bestSideDist = 0;
          const lookAhead = Math.max(0, a.overtakeLookAhead);
          const sideRange = Math.max(0, a.overtakeSideRange);

          if (lookAhead <= 0 || sideRange <= 0) {
            return;
          }

          for (let i = 0; i < neighbors.length; i++) {
            const b = neighbors[i];
            if (b === a) continue;
            if (b.team !== a.team) continue;

            if (a.maxSpeed + a.overtakeSpeedDiff < b.maxSpeed) {
              continue;
            }

            if (!this.isAllyOvertakeBlocker(b)) continue;
            const dx = b.pos.x - a.pos.x;
            const dz = b.pos.z - a.pos.z;
            const forwardDist = dx * a.forwardX + dz * a.forwardZ;
            if (forwardDist <= a.radius * 0.25) continue;
            if (forwardDist > lookAhead) continue;
            const sideDist = dx * a.forwardZ - dz * a.forwardX;

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

          let side = a.overtakeSideLock;

          if (side === 0 || a.overtakeHoldFrames <= 0) {
            side = this.chooseOvertakeSide(a, neighbors, bestSideDist);
            a.overtakeSideLock = side;
          }

          a.overtakeHoldFrames = 12;
          const closeFactor = 1 - Math.min(1, bestForwardDist / Math.max(0.001, lookAhead));
          const strength = a.maxSpeed * a.overtakeSideStrength * (0.35 + closeFactor * 0.65);
          a.vel.x += a.forwardZ * side * strength;
          a.vel.z += -a.forwardX * side * strength;
          const speed = Math.sqrt(a.vel.x * a.vel.x + a.vel.z * a.vel.z);

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

          const prefForward = a.prefVel.x * a.forwardX + a.prefVel.z * a.forwardZ;

          if (prefForward <= a.maxSpeed * 0.25) {
            a.forwardSlowFrames = 0;
            return;
          }

          const currentForward = a.vel.x * a.forwardX + a.vel.z * a.forwardZ;

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
          const rightScore = this.getOvertakeSideClearanceScore(a, neighbors, 1);
          const leftScore = this.getOvertakeSideClearanceScore(a, neighbors, -1);

          if (Math.abs(rightScore - leftScore) > 0.001) {
            return rightScore > leftScore ? 1 : -1;
          }

          if (Math.abs(blockerSideDist) > 0.05) {
            return blockerSideDist > 0 ? -1 : 1;
          }

          return a.overtakeSeed >= 0 ? 1 : -1;
        }

        getOvertakeSideClearanceScore(a, neighbors, side) {
          const sideX = a.forwardZ * side;
          const sideZ = -a.forwardX * side;
          const lookAhead = Math.max(0.001, a.overtakeLookAhead);
          const sideRange = Math.max(0.001, a.overtakeSideRange);
          let score = 0;

          for (let i = 0; i < neighbors.length; i++) {
            const b = neighbors[i];
            if (b === a) continue;
            const dx = b.pos.x - a.pos.x;
            const dz = b.pos.z - a.pos.z;
            const forwardDist = dx * a.forwardX + dz * a.forwardZ;
            if (forwardDist < -a.radius) continue;
            if (forwardDist > lookAhead + b.radius) continue;
            const sideDist = dx * sideX + dz * sideZ;
            if (sideDist <= 0) continue;
            if (sideDist > sideRange + b.radius) continue;
            const forwardWeight = 1 - Math.min(1, Math.abs(forwardDist) / lookAhead);
            const sideWeight = 1 - Math.min(1, sideDist / (sideRange + b.radius));
            score -= (forwardWeight * 1.5 + sideWeight) * (b.radius + a.radius);
          }

          return score;
        } // =========================================================
        // HARD COLLISION: CIRCLE OBSTACLE
        // =========================================================


        pushAgentOutOfCircle(a, ob) {
          const dx = a.pos.x - ob.x;
          const dz = a.pos.z - ob.z;
          const distSq = dx * dx + dz * dz;
          const minDist = a.radius + ob.r;
          if (distSq >= minDist * minDist) return; // Nếu nằm đúng tâm obstacle thì đẩy đại sang +X

          if (distSq < 1e-8) {
            a.pos.x = ob.x + minDist + 0.001;
            a.pos.z = ob.z;
            return;
          }

          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const nz = dz / dist;
          const push = minDist - dist + 0.001;
          a.pos.x += nx * push;
          a.pos.z += nz * push;
        } // =========================================================
        // HARD COLLISION: RECT OBSTACLE
        // Hỗ trợ cả trường hợp agent ở ngoài rect lẫn đã lọt vào trong rect.
        // =========================================================


        pushAgentOutOfRect(a, ob) {
          const dx = a.pos.x - ob.x;
          const dz = a.pos.z - ob.z; // World -> local rect space

          const lx = dx * ob.cos + dz * ob.sin;
          const lz = -dx * ob.sin + dz * ob.cos;
          const px = this.clamp(lx, -ob.hx, ob.hx);
          const pz = this.clamp(lz, -ob.hz, ob.hz);
          const ox = lx - px;
          const oz = lz - pz;
          const distSq = ox * ox + oz * oz;
          let nxL = 0;
          let nzL = 0;
          let push = 0; // Case 1: agent center ở ngoài rect

          if (distSq > 1e-8) {
            const dist = Math.sqrt(distSq);
            if (dist >= a.radius) return;
            nxL = ox / dist;
            nzL = oz / dist;
            push = a.radius - dist + 0.001;
          } // Case 2: agent center đã nằm bên trong rect
          else {
            const dLeft = lx + ob.hx;
            const dRight = ob.hx - lx;
            const dBottom = lz + ob.hz;
            const dTop = ob.hz - lz;
            let minD = dLeft;
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


          const nx = nxL * ob.cos - nzL * ob.sin;
          const nz = nxL * ob.sin + nzL * ob.cos;
          a.pos.x += nx * push;
          a.pos.z += nz * push;
        }

        pushAgentOutOfObstacles(a) {
          for (let i = 0; i < this.circleObs.length; i++) {
            this.pushAgentOutOfCircle(a, this.circleObs[i]);
          }

          for (let i = 0; i < this.rectObs.length; i++) {
            this.pushAgentOutOfRect(a, this.rectObs[i]);
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

        step(deltaTime) {
          const dt = this.getSafeDeltaTime(deltaTime);
          this.buildGrid(); // ===== VELOCITY =====

          for (let i = 0; i < this.agents.length; i++) {
            const a = this.agents[i];
            this.updateForwardSlowFrames(a);
            if (a.locked) continue;
            let vx = a.prefVel.x;
            let vz = a.prefVel.z;
            const neighbors = this.getNeighbors(a); // ===== agent-agent avoidance =====

            for (let j = 0; j < neighbors.length; j++) {
              const b = neighbors[j];
              const dx = a.pos.x - b.pos.x;
              const dz = a.pos.z - b.pos.z;
              const distSq = dx * dx + dz * dz;
              const minDist = a.radius + b.radius;
              if (distSq < 0.0001) continue;

              if (distSq < minDist * minDist) {
                const dist = Math.sqrt(distSq);
                const nx = dx / dist;
                const nz = dz / dist;
                const push = minDist - dist;
                vx += nx * push * 2;
                vz += nz * push * 2;
                const dot = vx * nx + vz * nz;

                if (dot < 0) {
                  vx -= nx * dot;
                  vz -= nz * dot;
                }
              }
            } // ===== circle obstacle velocity avoidance =====


            for (let j = 0; j < this.circleObs.length; j++) {
              const ob = this.circleObs[j];
              const dx = a.pos.x - ob.x;
              const dz = a.pos.z - ob.z;
              const dist = Math.sqrt(dx * dx + dz * dz);
              const minDist = a.radius + ob.r;

              if (dist < minDist && dist > 0.0001) {
                const nx = dx / dist;
                const nz = dz / dist;
                vx += nx * (minDist - dist) * 2;
                vz += nz * (minDist - dist) * 2;
                const dot = vx * nx + vz * nz;

                if (dot < 0) {
                  vx -= nx * dot;
                  vz -= nz * dot;
                }
              }
            } // ===== rect obstacle velocity avoidance =====


            for (let j = 0; j < this.rectObs.length; j++) {
              const ob = this.rectObs[j];
              const dx = a.pos.x - ob.x;
              const dz = a.pos.z - ob.z;
              const lx = dx * ob.cos + dz * ob.sin;
              const lz = -dx * ob.sin + dz * ob.cos;
              const px = this.clamp(lx, -ob.hx, ob.hx);
              const pz = this.clamp(lz, -ob.hz, ob.hz);
              const ox = lx - px;
              const oz = lz - pz;
              const distSq = ox * ox + oz * oz; // Agent center ở ngoài rect

              if (distSq > 1e-8) {
                if (distSq < a.radius * a.radius) {
                  const dist = Math.sqrt(distSq);
                  const nxL = ox / dist;
                  const nzL = oz / dist;
                  const nx = nxL * ob.cos - nzL * ob.sin;
                  const nz = nxL * ob.sin + nzL * ob.cos;
                  vx += nx * (a.radius - dist) * 2;
                  vz += nz * (a.radius - dist) * 2;
                  const dot = vx * nx + vz * nz;

                  if (dot < 0) {
                    vx -= nx * dot;
                    vz -= nz * dot;
                  }
                }
              } // Agent center đã ở trong rect
              else {
                const dLeft = lx + ob.hx;
                const dRight = ob.hx - lx;
                const dBottom = lz + ob.hz;
                const dTop = ob.hz - lz;
                let nxL = -1;
                let nzL = 0;
                let minD = dLeft;

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
                }

                const nx = nxL * ob.cos - nzL * ob.sin;
                const nz = nxL * ob.sin + nzL * ob.cos;
                vx += nx * (a.radius + minD) * 2;
                vz += nz * (a.radius + minD) * 2;
                const dot = vx * nx + vz * nz;

                if (dot < 0) {
                  vx -= nx * dot;
                  vz -= nz * dot;
                }
              }
            }

            a.vel.x = vx;
            a.vel.z = vz;
            this.applyAllyOvertake(a, neighbors);
            vx = a.vel.x;
            vz = a.vel.z;
            const speed = Math.sqrt(vx * vx + vz * vz);

            if (speed > a.maxSpeed) {
              vx = vx / speed * a.maxSpeed;
              vz = vz / speed * a.maxSpeed;
            }

            a.vel.x = vx;
            a.vel.z = vz;
          } // ===== MOVE =====


          for (let i = 0; i < this.agents.length; i++) {
            const a = this.agents[i];

            if (!a.locked) {
              a.pos.x += a.vel.x * dt;
              a.pos.z += a.vel.z * dt; // Chống xuyên obstacle sau khi di chuyển.

              for (let i = 0; i < this.obstacleSolveIterations; i++) {
                this.pushAgentOutOfObstacles(a);
              }
            }

            this.clampToBattlefield(a);
          }

          this.buildGrid(); // ===== HARD SEPARATION: AGENT-AGENT =====

          for (let i = 0; i < this.agents.length; i++) {
            const a = this.agents[i];
            const neighbors = this.getNeighbors(a);

            for (let j = 0; j < neighbors.length; j++) {
              const b = neighbors[j];
              const dx = b.pos.x - a.pos.x;
              const dz = b.pos.z - a.pos.z;
              const distSq = dx * dx + dz * dz;
              const minDist = a.radius + b.radius;
              if (distSq < 0.0001) continue;

              if (distSq < minDist * minDist) {
                const dist = Math.sqrt(distSq);
                const overlap = minDist - dist;
                const nx = dx / dist;
                const nz = dz / dist;
                const aMovable = this.canMoveInHardSeparation(a);
                const bMovable = this.canMoveInHardSeparation(b);

                if (aMovable && bMovable) {
                  const half = overlap * 0.5;
                  a.pos.x -= nx * half;
                  a.pos.z -= nz * half;
                  b.pos.x += nx * half;
                  b.pos.z += nz * half;
                } else if (aMovable && !bMovable) {
                  a.pos.x -= nx * overlap;
                  a.pos.z -= nz * overlap;
                } else if (!aMovable && bMovable) {
                  b.pos.x += nx * overlap;
                  b.pos.z += nz * overlap;
                }
              }
            }
          } // ===== HARD SEPARATION: OBSTACLE AGAIN =====
          // Sau agent-agent separation, agent có thể bị đẩy lấn vào obstacle,
          // nên cần solve obstacle thêm lần nữa.


          for (let i = 0; i < this.agents.length; i++) {
            const a = this.agents[i];
            if (a.locked && a.canBePush !== 1) continue;

            for (let i = 0; i < this.obstacleSolveIterations; i++) {
              this.pushAgentOutOfObstacles(a);
            }

            this.clampToBattlefield(a);
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
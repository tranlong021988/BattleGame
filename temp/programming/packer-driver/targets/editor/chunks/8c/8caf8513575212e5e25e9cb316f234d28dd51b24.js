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
          // ===== neighbor tuning =====
          this.neighborDist = 2.4;
          this.maxNeighbors = 8;
          this.locked = false;
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
          this.cellSize = 2.2;
          this.timeStep = 1 / 60;
          this.minStepDeltaTime = 1 / 120;
          this.maxStepDeltaTime = 1 / 20;
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

        addAgent(x, z) {
          const a = new RVOAgent(x, z);
          this.agents.push(a);
          return a;
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
          this.grid.clear();

          for (let a of this.agents) {
            const gx = Math.floor(a.pos.x / this.cellSize);
            const gz = Math.floor(a.pos.z / this.cellSize);
            a.gridX = gx;
            a.gridZ = gz;
            const key = gx + "_" + gz;

            if (!this.grid.has(key)) {
              this.grid.set(key, []);
            }

            this.grid.get(key).push(a);
          }
        }

        getNeighbors(a) {
          const result = [];
          const maxDistSq = a.neighborDist * a.neighborDist;

          for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
              const key = a.gridX + x + "_" + (a.gridZ + z);
              const cell = this.grid.get(key);
              if (!cell) continue;

              for (let other of cell) {
                if (other === a) continue;
                const dx = other.pos.x - a.pos.x;
                const dz = other.pos.z - a.pos.z;
                const distSq = dx * dx + dz * dz;
                if (distSq > maxDistSq) continue;
                result.push({
                  agent: other,
                  distSq
                });
              }
            }
          }

          result.sort((a, b) => a.distSq - b.distSq);
          const out = [];
          const count = Math.min(a.maxNeighbors, result.length);

          for (let i = 0; i < count; i++) {
            out.push(result[i].agent);
          }

          return out;
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
          for (let ob of this.circleObs) {
            this.pushAgentOutOfCircle(a, ob);
          }

          for (let ob of this.rectObs) {
            this.pushAgentOutOfRect(a, ob);
          }
        }

        clampToBattlefield(a) {
          if (!this.useBounds) return;
          a.pos.x = Math.max(this.minX + a.radius, Math.min(this.maxX - a.radius, a.pos.x));
          a.pos.z = Math.max(this.minZ + a.radius, Math.min(this.maxZ - a.radius, a.pos.z));
        }

        step(deltaTime) {
          const dt = this.getSafeDeltaTime(deltaTime);
          this.buildGrid(); // ===== VELOCITY =====

          for (let a of this.agents) {
            if (a.locked) continue;
            let vx = a.prefVel.x;
            let vz = a.prefVel.z;
            const neighbors = this.getNeighbors(a); // ===== agent-agent avoidance =====

            for (let b of neighbors) {
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


            for (let ob of this.circleObs) {
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


            for (let ob of this.rectObs) {
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

            const speed = Math.sqrt(vx * vx + vz * vz);

            if (speed > a.maxSpeed) {
              vx = vx / speed * a.maxSpeed;
              vz = vz / speed * a.maxSpeed;
            }

            a.vel.x = vx;
            a.vel.z = vz;
          } // ===== MOVE =====


          for (let a of this.agents) {
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

          for (let a of this.agents) {
            const neighbors = this.getNeighbors(a);

            for (let b of neighbors) {
              const dx = b.pos.x - a.pos.x;
              const dz = b.pos.z - a.pos.z;
              const distSq = dx * dx + dz * dz;
              const minDist = a.radius + b.radius;
              if (distSq < 0.0001) continue;

              if (distSq < minDist * minDist) {
                const dist = Math.sqrt(distSq);
                const overlap = (minDist - dist) * 0.5;
                const nx = dx / dist;
                const nz = dz / dist;

                if (!a.locked) {
                  a.pos.x -= nx * overlap;
                  a.pos.z -= nz * overlap;
                }

                if (!b.locked) {
                  b.pos.x += nx * overlap;
                  b.pos.z += nz * overlap;
                }
              }
            }
          } // ===== HARD SEPARATION: OBSTACLE AGAIN =====
          // Sau agent-agent separation, agent có thể bị đẩy lấn vào obstacle,
          // nên cần solve obstacle thêm lần nữa.


          for (let a of this.agents) {
            if (a.locked) continue;

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
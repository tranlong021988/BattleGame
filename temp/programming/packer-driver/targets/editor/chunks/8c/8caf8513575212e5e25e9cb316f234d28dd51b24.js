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
          this.cellSize = 1.5;
          this.timeStep = 1 / 60;
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

        buildGrid() {
          this.grid.clear();

          for (let a of this.agents) {
            const gx = Math.floor(a.pos.x / this.cellSize);
            const gz = Math.floor(a.pos.z / this.cellSize);
            a.gridX = gx;
            a.gridZ = gz;
            const key = gx + "_" + gz;
            if (!this.grid.has(key)) this.grid.set(key, []);
            this.grid.get(key).push(a);
          }
        }

        getNeighbors(a) {
          const result = [];

          for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
              const key = a.gridX + x + "_" + (a.gridZ + z);
              const cell = this.grid.get(key);
              if (!cell) continue;

              for (let other of cell) {
                if (other !== a) result.push(other);
              }
            }
          }

          return result;
        }

        step() {
          this.buildGrid(); // ===== VELOCITY =====

          for (let a of this.agents) {
            if (a.locked) continue;
            let vx = a.prefVel.x;
            let vz = a.prefVel.z;
            const neighbors = this.getNeighbors(a); // ===== Agent avoidance =====

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
            } // ===== Circle obstacle (soft) =====


            for (let ob of this.circleObs) {
              const dx = a.pos.x - ob.x;
              const dz = a.pos.z - ob.z;
              const dist = Math.sqrt(dx * dx + dz * dz);
              const minDist = a.radius + ob.r;

              if (dist < minDist && dist > 0.0001) {
                const nx = dx / dist;
                const nz = dz / dist;
                vx += nx * (minDist - dist) * 4;
                vz += nz * (minDist - dist) * 4;
                const dot = vx * nx + vz * nz;

                if (dot < 0) {
                  vx -= nx * dot;
                  vz -= nz * dot;
                }
              }
            } // ===== Rect obstacle (soft) =====


            for (let ob of this.rectObs) {
              const dx = a.pos.x - ob.x;
              const dz = a.pos.z - ob.z;
              const lx = dx * ob.cos + dz * ob.sin;
              const lz = -dx * ob.sin + dz * ob.cos;
              const px = Math.max(-ob.hx, Math.min(lx, ob.hx));
              const pz = Math.max(-ob.hz, Math.min(lz, ob.hz));
              let ox = lx - px;
              let oz = lz - pz;
              const distSq = ox * ox + oz * oz;
              if (distSq < 1e-6) continue;

              if (distSq < a.radius * a.radius) {
                const dist = Math.sqrt(distSq);
                const nxL = ox / dist;
                const nzL = oz / dist;
                const nx = nxL * ob.cos - nzL * ob.sin;
                const nz = nxL * ob.sin + nzL * ob.cos;
                vx += nx * (a.radius - dist) * 4;
                vz += nz * (a.radius - dist) * 4;
                const dot = vx * nx + vz * nz;

                if (dot < 0) {
                  vx -= nx * dot;
                  vz -= nz * dot;
                }
              }
            } // ===== Clamp speed =====


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
              a.pos.x += a.vel.x * this.timeStep;
              a.pos.z += a.vel.z * this.timeStep;
            }
          } // ===== HARD SEPARATION (agent-agent) =====


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
          } // ===== HARD SEPARATION (circle obstacle) =====


          for (let a of this.agents) {
            for (let ob of this.circleObs) {
              const dx = a.pos.x - ob.x;
              const dz = a.pos.z - ob.z;
              const dist = Math.sqrt(dx * dx + dz * dz);
              const minDist = a.radius + ob.r;

              if (dist < minDist && dist > 0.0001) {
                const nx = dx / dist;
                const nz = dz / dist;
                const push = minDist - dist;
                a.pos.x += nx * push;
                a.pos.z += nz * push;
              }
            }
          } // ===== HARD SEPARATION (rect obstacle) 🔥 FIX CHÍNH =====


          for (let a of this.agents) {
            for (let ob of this.rectObs) {
              const dx = a.pos.x - ob.x;
              const dz = a.pos.z - ob.z;
              const lx = dx * ob.cos + dz * ob.sin;
              const lz = -dx * ob.sin + dz * ob.cos;
              const px = Math.max(-ob.hx, Math.min(lx, ob.hx));
              const pz = Math.max(-ob.hz, Math.min(lz, ob.hz));
              let ox = lx - px;
              let oz = lz - pz;
              const distSq = ox * ox + oz * oz;
              if (distSq < 1e-6) continue;

              if (distSq < a.radius * a.radius) {
                const dist = Math.sqrt(distSq);
                const nxL = ox / dist;
                const nzL = oz / dist;
                const nx = nxL * ob.cos - nzL * ob.sin;
                const nz = nxL * ob.sin + nzL * ob.cos;
                const push = a.radius - dist;
                a.pos.x += nx * push;
                a.pos.z += nz * push;
              }
            }
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8caf8513575212e5e25e9cb316f234d28dd51b24.js.map
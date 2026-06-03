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
          var a = new RVOAgent(x, z);
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

          for (var a of this.agents) {
            var gx = Math.floor(a.pos.x / this.cellSize);
            var gz = Math.floor(a.pos.z / this.cellSize);
            a.gridX = gx;
            a.gridZ = gz;
            var key = gx + "_" + gz;

            if (!this.grid.has(key)) {
              this.grid.set(key, []);
            }

            this.grid.get(key).push(a);
          }
        }

        getNeighbors(a) {
          var result = [];
          var maxDistSq = a.neighborDist * a.neighborDist;

          for (var x = -1; x <= 1; x++) {
            for (var z = -1; z <= 1; z++) {
              var key = a.gridX + x + "_" + (a.gridZ + z);
              var cell = this.grid.get(key);
              if (!cell) continue;

              for (var other of cell) {
                if (other === a) continue;
                var dx = other.pos.x - a.pos.x;
                var dz = other.pos.z - a.pos.z;
                var distSq = dx * dx + dz * dz;
                if (distSq > maxDistSq) continue;
                result.push({
                  agent: other,
                  distSq
                });
              }
            }
          }

          result.sort((a, b) => a.distSq - b.distSq);
          var out = [];
          var count = Math.min(a.maxNeighbors, result.length);

          for (var i = 0; i < count; i++) {
            out.push(result[i].agent);
          }

          return out;
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
          for (var ob of this.circleObs) {
            this.pushAgentOutOfCircle(a, ob);
          }

          for (var _ob of this.rectObs) {
            this.pushAgentOutOfRect(a, _ob);
          }
        }

        clampToBattlefield(a) {
          if (!this.useBounds) return;
          a.pos.x = Math.max(this.minX + a.radius, Math.min(this.maxX - a.radius, a.pos.x));
          a.pos.z = Math.max(this.minZ + a.radius, Math.min(this.maxZ - a.radius, a.pos.z));
        }

        step(deltaTime) {
          var dt = this.getSafeDeltaTime(deltaTime);
          this.buildGrid(); // ===== VELOCITY =====

          for (var a of this.agents) {
            if (a.locked) continue;
            var vx = a.prefVel.x;
            var vz = a.prefVel.z;
            var neighbors = this.getNeighbors(a); // ===== agent-agent avoidance =====

            for (var b of neighbors) {
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


            for (var ob of this.circleObs) {
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


            for (var _ob2 of this.rectObs) {
              var _dx2 = a.pos.x - _ob2.x;

              var _dz2 = a.pos.z - _ob2.z;

              var lx = _dx2 * _ob2.cos + _dz2 * _ob2.sin;
              var lz = -_dx2 * _ob2.sin + _dz2 * _ob2.cos;
              var px = this.clamp(lx, -_ob2.hx, _ob2.hx);
              var pz = this.clamp(lz, -_ob2.hz, _ob2.hz);
              var ox = lx - px;
              var oz = lz - pz;

              var _distSq = ox * ox + oz * oz; // Agent center ở ngoài rect


              if (_distSq > 1e-8) {
                if (_distSq < a.radius * a.radius) {
                  var _dist2 = Math.sqrt(_distSq);

                  var nxL = ox / _dist2;
                  var nzL = oz / _dist2;

                  var _nx2 = nxL * _ob2.cos - nzL * _ob2.sin;

                  var _nz2 = nxL * _ob2.sin + nzL * _ob2.cos;

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
                var dLeft = lx + _ob2.hx;
                var dRight = _ob2.hx - lx;
                var dBottom = lz + _ob2.hz;
                var dTop = _ob2.hz - lz;

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

                var _nx3 = _nxL * _ob2.cos - _nzL * _ob2.sin;

                var _nz3 = _nxL * _ob2.sin + _nzL * _ob2.cos;

                vx += _nx3 * (a.radius + minD) * 2;
                vz += _nz3 * (a.radius + minD) * 2;

                var _dot3 = vx * _nx3 + vz * _nz3;

                if (_dot3 < 0) {
                  vx -= _nx3 * _dot3;
                  vz -= _nz3 * _dot3;
                }
              }
            }

            var speed = Math.sqrt(vx * vx + vz * vz);

            if (speed > a.maxSpeed) {
              vx = vx / speed * a.maxSpeed;
              vz = vz / speed * a.maxSpeed;
            }

            a.vel.x = vx;
            a.vel.z = vz;
          } // ===== MOVE =====


          for (var _a of this.agents) {
            if (!_a.locked) {
              _a.pos.x += _a.vel.x * dt;
              _a.pos.z += _a.vel.z * dt; // Chống xuyên obstacle sau khi di chuyển.

              for (var i = 0; i < this.obstacleSolveIterations; i++) {
                this.pushAgentOutOfObstacles(_a);
              }
            }

            this.clampToBattlefield(_a);
          }

          this.buildGrid(); // ===== HARD SEPARATION: AGENT-AGENT =====

          for (var _a2 of this.agents) {
            var _neighbors = this.getNeighbors(_a2);

            for (var _b of _neighbors) {
              var _dx3 = _b.pos.x - _a2.pos.x;

              var _dz3 = _b.pos.z - _a2.pos.z;

              var _distSq2 = _dx3 * _dx3 + _dz3 * _dz3;

              var _minDist2 = _a2.radius + _b.radius;

              if (_distSq2 < 0.0001) continue;

              if (_distSq2 < _minDist2 * _minDist2) {
                var _dist3 = Math.sqrt(_distSq2);

                var overlap = (_minDist2 - _dist3) * 0.5;

                var _nx4 = _dx3 / _dist3;

                var _nz4 = _dz3 / _dist3;

                if (!_a2.locked) {
                  _a2.pos.x -= _nx4 * overlap;
                  _a2.pos.z -= _nz4 * overlap;
                }

                if (!_b.locked) {
                  _b.pos.x += _nx4 * overlap;
                  _b.pos.z += _nz4 * overlap;
                }
              }
            }
          } // ===== HARD SEPARATION: OBSTACLE AGAIN =====
          // Sau agent-agent separation, agent có thể bị đẩy lấn vào obstacle,
          // nên cần solve obstacle thêm lần nữa.


          for (var _a3 of this.agents) {
            if (_a3.locked) continue;

            for (var _i = 0; _i < this.obstacleSolveIterations; _i++) {
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
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

        buildGrid() {
          this.grid.clear();

          for (var a of this.agents) {
            var gx = Math.floor(a.pos.x / this.cellSize);
            var gz = Math.floor(a.pos.z / this.cellSize);
            a.gridX = gx;
            a.gridZ = gz;
            var key = gx + "_" + gz;
            if (!this.grid.has(key)) this.grid.set(key, []);
            this.grid.get(key).push(a);
          }
        }

        getNeighbors(a) {
          var result = [];

          for (var x = -1; x <= 1; x++) {
            for (var z = -1; z <= 1; z++) {
              var key = a.gridX + x + "_" + (a.gridZ + z);
              var cell = this.grid.get(key);
              if (!cell) continue;

              for (var other of cell) {
                if (other !== a) result.push(other);
              }
            }
          }

          return result;
        }

        step() {
          this.buildGrid(); // ===== VELOCITY =====

          for (var a of this.agents) {
            if (a.locked) continue;
            var vx = a.prefVel.x;
            var vz = a.prefVel.z;
            var neighbors = this.getNeighbors(a); // ===== Agent avoidance =====

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
            } // ===== Circle obstacle (soft) =====


            for (var ob of this.circleObs) {
              var _dx = a.pos.x - ob.x;

              var _dz = a.pos.z - ob.z;

              var _dist = Math.sqrt(_dx * _dx + _dz * _dz);

              var _minDist = a.radius + ob.r;

              if (_dist < _minDist && _dist > 0.0001) {
                var _nx = _dx / _dist;

                var _nz = _dz / _dist;

                vx += _nx * (_minDist - _dist) * 4;
                vz += _nz * (_minDist - _dist) * 4;

                var _dot = vx * _nx + vz * _nz;

                if (_dot < 0) {
                  vx -= _nx * _dot;
                  vz -= _nz * _dot;
                }
              }
            } // ===== Rect obstacle (soft) =====


            for (var _ob of this.rectObs) {
              var _dx2 = a.pos.x - _ob.x;

              var _dz2 = a.pos.z - _ob.z;

              var lx = _dx2 * _ob.cos + _dz2 * _ob.sin;
              var lz = -_dx2 * _ob.sin + _dz2 * _ob.cos;
              var px = Math.max(-_ob.hx, Math.min(lx, _ob.hx));
              var pz = Math.max(-_ob.hz, Math.min(lz, _ob.hz));
              var ox = lx - px;
              var oz = lz - pz;

              var _distSq = ox * ox + oz * oz;

              if (_distSq < 1e-6) continue;

              if (_distSq < a.radius * a.radius) {
                var _dist2 = Math.sqrt(_distSq);

                var nxL = ox / _dist2;
                var nzL = oz / _dist2;

                var _nx2 = nxL * _ob.cos - nzL * _ob.sin;

                var _nz2 = nxL * _ob.sin + nzL * _ob.cos;

                vx += _nx2 * (a.radius - _dist2) * 4;
                vz += _nz2 * (a.radius - _dist2) * 4;

                var _dot2 = vx * _nx2 + vz * _nz2;

                if (_dot2 < 0) {
                  vx -= _nx2 * _dot2;
                  vz -= _nz2 * _dot2;
                }
              }
            } // ===== Clamp speed =====


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
              _a.pos.x += _a.vel.x * this.timeStep;
              _a.pos.z += _a.vel.z * this.timeStep;
            }
          } // ===== HARD SEPARATION (agent-agent) =====


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

                var _nx3 = _dx3 / _dist3;

                var _nz3 = _dz3 / _dist3;

                if (!_a2.locked) {
                  _a2.pos.x -= _nx3 * overlap;
                  _a2.pos.z -= _nz3 * overlap;
                }

                if (!_b.locked) {
                  _b.pos.x += _nx3 * overlap;
                  _b.pos.z += _nz3 * overlap;
                }
              }
            }
          } // ===== HARD SEPARATION (circle obstacle) =====


          for (var _a3 of this.agents) {
            for (var _ob2 of this.circleObs) {
              var _dx4 = _a3.pos.x - _ob2.x;

              var _dz4 = _a3.pos.z - _ob2.z;

              var _dist4 = Math.sqrt(_dx4 * _dx4 + _dz4 * _dz4);

              var _minDist3 = _a3.radius + _ob2.r;

              if (_dist4 < _minDist3 && _dist4 > 0.0001) {
                var _nx4 = _dx4 / _dist4;

                var _nz4 = _dz4 / _dist4;

                var _push = _minDist3 - _dist4;

                _a3.pos.x += _nx4 * _push;
                _a3.pos.z += _nz4 * _push;
              }
            }
          } // ===== HARD SEPARATION (rect obstacle) 🔥 FIX CHÍNH =====


          for (var _a4 of this.agents) {
            for (var _ob3 of this.rectObs) {
              var _dx5 = _a4.pos.x - _ob3.x;

              var _dz5 = _a4.pos.z - _ob3.z;

              var _lx = _dx5 * _ob3.cos + _dz5 * _ob3.sin;

              var _lz = -_dx5 * _ob3.sin + _dz5 * _ob3.cos;

              var _px = Math.max(-_ob3.hx, Math.min(_lx, _ob3.hx));

              var _pz = Math.max(-_ob3.hz, Math.min(_lz, _ob3.hz));

              var _ox = _lx - _px;

              var _oz = _lz - _pz;

              var _distSq3 = _ox * _ox + _oz * _oz;

              if (_distSq3 < 1e-6) continue;

              if (_distSq3 < _a4.radius * _a4.radius) {
                var _dist5 = Math.sqrt(_distSq3);

                var _nxL = _ox / _dist5;

                var _nzL = _oz / _dist5;

                var _nx5 = _nxL * _ob3.cos - _nzL * _ob3.sin;

                var _nz5 = _nxL * _ob3.sin + _nzL * _ob3.cos;

                var _push2 = _a4.radius - _dist5;

                _a4.pos.x += _nx5 * _push2;
                _a4.pos.z += _nz5 * _push2;
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
System.register(["__unresolved_0", "cc", "stats.js"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, Director, Stats, _dec, _class, _crd, ccclass, DebugStats;

  function _reportPossibleCrUseOfStats(extras) {
    _reporterNs.report("Stats", "stats.js", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      director = _cc.director;
      Director = _cc.Director;
    }, function (_statsJs) {
      Stats = _statsJs.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ddf62uQTgxLcayvKGxHznGe", "DebugStats", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director', 'Director']);

      ({
        ccclass
      } = _decorator);

      _export("DebugStats", DebugStats = (_dec = ccclass('DebugStats'), _dec(_class = class DebugStats extends Component {
        constructor(...args) {
          super(...args);
          this.stats = null;
        }

        start() {
          // Chỉ chạy trên browser

          /* if (typeof document === 'undefined') {
               return;
           }*/
          this.stats = new (_crd && Stats === void 0 ? (_reportPossibleCrUseOfStats({
            error: Error()
          }), Stats) : Stats)(); // 0 = FPS
          // 1 = MS
          // 2 = MB (memory, Chrome only)

          this.stats.showPanel(2);
          document.body.appendChild(this.stats.dom);
          director.on(Director.EVENT_BEGIN_FRAME, this.onBeginFrame, this);
          director.on(Director.EVENT_AFTER_DRAW, this.onEndFrame, this);
        }

        onDestroy() {
          director.off(Director.EVENT_BEGIN_FRAME, this.onBeginFrame, this);
          director.off(Director.EVENT_AFTER_DRAW, this.onEndFrame, this);

          if (this.stats && this.stats.dom.parentNode) {
            this.stats.dom.parentNode.removeChild(this.stats.dom);
          }
        }

        onBeginFrame() {
          var _this$stats;

          (_this$stats = this.stats) == null || _this$stats.begin();
        }

        onEndFrame() {
          var _this$stats2;

          (_this$stats2 = this.stats) == null || _this$stats2.end();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d2da6150c21b0b99c973b2a8e6f3d102d3207169.js.map
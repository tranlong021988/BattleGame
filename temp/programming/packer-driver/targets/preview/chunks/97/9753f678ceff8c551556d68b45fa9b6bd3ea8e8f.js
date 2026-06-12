System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, SkeletalAnimation, math, _dec, _class, _crd, ccclass, property, RandomAnimOffset;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      SkeletalAnimation = _cc.SkeletalAnimation;
      math = _cc.math;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e4db8/oeKxCMaF8oR/xwXkU", "RandomAnimcationOffset", undefined);

      __checkObsolete__(['_decorator', 'Component', 'SkeletalAnimation', 'math']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("RandomAnimOffset", RandomAnimOffset = (_dec = ccclass('RandomAnimOffset'), _dec(_class = class RandomAnimOffset extends Component {
        start() {
          var anim = this.getComponent(SkeletalAnimation);

          if (anim) {
            // Lấy animation đang chạy (ví dụ clip "Idle" hoặc clip đầu tiên)
            var states = anim.getState(anim.defaultClip.name);

            if (states) {
              states.play(); // Offset ngẫu nhiên từ 0 đến tổng chiều dài clip

              states.setTime(math.randomRange(0, states.duration)); // Cập nhật ngay lập tức để tránh bị giật frame đầu
              // states.sample(); 
            }
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9753f678ceff8c551556d68b45fa9b6bd3ea8e8f.js.map
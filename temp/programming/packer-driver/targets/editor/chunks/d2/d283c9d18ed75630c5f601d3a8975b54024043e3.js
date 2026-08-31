System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _crd, ccclass, property, EventTest;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e20b7LgiT5FeZ52v4uNv0Vn", "EventTest", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("EventTest", EventTest = (_dec = ccclass('EventTest'), _dec(_class = class EventTest extends Component {
        start() {
          this.node.on('JabEndFrame', (animationName, frame, player) => {
            console.log(animationName, frame);
          });
        }

        JabEndCall(eventName, animationName, frame, customEventData) {// console.log('VAT event', eventName, animationName, frame, customEventData);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d283c9d18ed75630c5f601d3a8975b54024043e3.js.map
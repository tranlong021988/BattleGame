System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Enum, _crd, UnitFamily;

  function unitFamilyToName(family) {
    switch (family) {
      case UnitFamily.Spear:
        return 'Spear';

      case UnitFamily.Sword:
        return 'Sword';

      case UnitFamily.Archer:
        return 'Archer';

      case UnitFamily.Skirmisher:
        return 'Skirmisher';

      case UnitFamily.Cavalry:
        return 'Cavalry';

      case UnitFamily.Axeman:
        return 'Axeman';

      case UnitFamily.Monk:
        return 'Monk';
    }

    return 'Unknown';
  }

  _export("unitFamilyToName", unitFamilyToName);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Enum = _cc.Enum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fe45aOiANRB87+8NcDH9YAq", "BattleTypes", undefined);

      __checkObsolete__(['Enum']);

      _export("UnitFamily", UnitFamily = /*#__PURE__*/function (UnitFamily) {
        UnitFamily[UnitFamily["Spear"] = 0] = "Spear";
        UnitFamily[UnitFamily["Sword"] = 1] = "Sword";
        UnitFamily[UnitFamily["Archer"] = 2] = "Archer";
        UnitFamily[UnitFamily["Skirmisher"] = 3] = "Skirmisher";
        UnitFamily[UnitFamily["Cavalry"] = 4] = "Cavalry";
        UnitFamily[UnitFamily["Axeman"] = 5] = "Axeman";
        UnitFamily[UnitFamily["Monk"] = 6] = "Monk";
        return UnitFamily;
      }({}));

      Enum(UnitFamily);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e79c0973b8cd5bffd474508edd78f4cf42ec0c95.js.map
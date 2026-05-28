System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Enum, _crd, UnitType;

  function unitTypeToName(type) {
    switch (type) {
      case UnitType.LightSword:
        return 'Light Sword';

      case UnitType.HeavySword:
        return 'Heavy Sword';

      case UnitType.LightSpear:
        return 'Light Spear';

      case UnitType.HeavySpear:
        return 'Heavy Spear';

      case UnitType.LightMace:
        return 'Light Mace';

      case UnitType.HeavyMace:
        return 'Heavy Mace';

      case UnitType.LightArcher:
        return 'Light Archer';

      case UnitType.HeavyArcher:
        return 'Heavy Archer';

      case UnitType.LightCavalry:
        return 'Light Cavalry';

      case UnitType.HeavyCavalry:
        return 'Heavy Cavalry';

      case UnitType.LightMagic:
        return 'Light Magic';

      case UnitType.HeavyMagic:
        return 'Heavy Magic';
    }

    return 'Unknown';
  }

  _export("unitTypeToName", unitTypeToName);

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

      _export("UnitType", UnitType = /*#__PURE__*/function (UnitType) {
        UnitType[UnitType["LightSword"] = 0] = "LightSword";
        UnitType[UnitType["HeavySword"] = 1] = "HeavySword";
        UnitType[UnitType["LightSpear"] = 2] = "LightSpear";
        UnitType[UnitType["HeavySpear"] = 3] = "HeavySpear";
        UnitType[UnitType["LightMace"] = 4] = "LightMace";
        UnitType[UnitType["HeavyMace"] = 5] = "HeavyMace";
        UnitType[UnitType["LightArcher"] = 6] = "LightArcher";
        UnitType[UnitType["HeavyArcher"] = 7] = "HeavyArcher";
        UnitType[UnitType["LightCavalry"] = 8] = "LightCavalry";
        UnitType[UnitType["HeavyCavalry"] = 9] = "HeavyCavalry";
        UnitType[UnitType["LightMagic"] = 10] = "LightMagic";
        UnitType[UnitType["HeavyMagic"] = 11] = "HeavyMagic";
        return UnitType;
      }({}));

      Enum(UnitType);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e79c0973b8cd5bffd474508edd78f4cf42ec0c95.js.map
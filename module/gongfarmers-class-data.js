/* global foundry */
/**
 * Gongfarmer's Almanac Classes — registration data for the DCC
 * extension API.
 *
 * Each class is described once here and registered through the four
 * stable `game.dcc.*` registries the DCC system exposes (see the DCC
 * repo's `docs/dev/EXTENSION_API.md` + `CLASS_DECOMPOSITION.md`):
 *
 *   - `registerClassMixin(classId, mixinFn)` — the class's own schema
 *     fields (class-specific dice). Fields a class shares with a DCC
 *     built-in (the thief skill block, `class.corruption`) are NOT
 *     redeclared — the DCC `thief` mixin already contributes them to
 *     the shared Player schema, so they are present on every Player.
 *   - `registerClassDefaults(classId, defaults)` — class identity +
 *     mechanical defaults written on a sheet's first open.
 *   - `registerSheetPart(classId, { parts, tabs })` — the class's sheet
 *     parts + tab labels. The class sheets are 5-line stubs extending
 *     the DCC `DCCSheet` base (see `actor-sheets-*.js`).
 *   - `registerHomebrewClassForProgressionLoad(classId, itemPrefix)` —
 *     teaches the DCC level-data-pack loader to assemble a lib
 *     `ClassProgression` from the `{itemPrefix}-{level}` items in the
 *     pack registered via `dcc.registerLevelDataPack`.
 *
 * `classId` is the lowercase canonical identifier (`actor.classId`
 * resolves `system.details.sheetClass.toLowerCase()`), matching the
 * `static CLASS_ID` pinned on each sheet stub and the
 * `{classId}-{level}` item naming in the level-data pack.
 *
 * Source: The Gongfarmer's Almanac 2015 Collection, Volume 1
 * (Men & Magic). Assassin by Julian Bernick; Dervish by Edgar Johnson;
 * Luchador by Reid "Reidzilla" San Filippo; Sword Monger by David Baity.
 */

const MODULE_ID = 'dcc-gongfarmers-classes'

/** Template path for a class partial. */
function classPartial (name) {
  return `modules/${MODULE_ID}/templates/actor-partial-${name}.html`
}

/** PC-flavored common parts every sheet overrides onto the base. */
function commonParts () {
  return {
    character: { id: 'character', template: 'systems/dcc/templates/actor-partial-pc-common.html' },
    equipment: { id: 'equipment', template: 'systems/dcc/templates/actor-partial-pc-equipment.html' }
  }
}

/**
 * Per-class registration descriptors.
 *
 * `mixin` builds fresh field instances each call (Foundry may re-invoke
 * `defineSchema()`; field objects are not shareable across schemas).
 */
export const GONGFARMERS_CLASSES = {
  assassin: {
    label: 'Assassin.ActorSheetAssassin',
    sheetHeight: 635,
    mixin (schema) {
      const f = foundry.data.fields
      // The assassin's attack die. Added manually to attack/damage; on a
      // result of 3+ the target must save or suffer a poison effect.
      schema.skills.fields.poisonDie = new f.SchemaField({
        label: new f.StringField({ initial: 'Assassin.PoisonDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
      // Backstab + the thief skill block (sneakSilently, hideInShadows,
      // disguiseSelf, handlePoison …) are inherited from the DCC `thief`
      // mixin on the shared Player schema.
    },
    defaults: {
      sheetClass: 'Assassin',
      localize: { 'class.className': 'Assassin.Assassin' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.showBackstab': true,
        'config.attackBonusMode': 'manual'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), assassin: { id: 'assassin', template: classPartial('assassin') } },
      tabs: { sheet: { tabs: [{ id: 'assassin', group: 'sheet', label: 'Assassin.Assassin' }] } }
    }
  },

  dervish: {
    label: 'Dervish.ActorSheetDervish',
    sheetHeight: 635,
    mixin (schema) {
      const f = foundry.data.fields
      schema.skills.fields.deedDie = new f.SchemaField({
        label: new f.StringField({ initial: 'Dervish.DeedDie' }),
        die: new f.StringField({ initial: '1d2' })
      })
    },
    defaults: {
      sheetClass: 'Dervish',
      localize: { 'class.className': 'Dervish.Dervish' },
      enrichHtml: { 'class.mightyDeedsLink': 'DCC.MightyDeedsLink' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'manual',
        // deedDie is shared with Sword Monger; pin this class's label.
        'skills.deedDie.label': 'Dervish.DeedDie'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), dervish: { id: 'dervish', template: classPartial('dervish') } },
      tabs: { sheet: { tabs: [{ id: 'dervish', group: 'sheet', label: 'Dervish.Dervish' }] } }
    }
  },

  luchador: {
    label: 'Luchador.ActorSheetLuchador',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      schema.skills.fields.luchaDie = new f.SchemaField({
        label: new f.StringField({ initial: 'Luchador.LuchaDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
      schema.skills.fields.unarmedDamage = new f.SchemaField({
        label: new f.StringField({ initial: 'Luchador.UnarmedDamage' }),
        die: new f.StringField({ initial: '1d6' })
      })
    },
    defaults: {
      sheetClass: 'Luchador',
      localize: { 'class.className': 'Luchador.Luchador' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), luchador: { id: 'luchador', template: classPartial('luchador') } },
      tabs: { sheet: { tabs: [{ id: 'luchador', group: 'sheet', label: 'Luchador.Luchador' }] } }
    }
  },

  'sword-monger': {
    label: 'SwordMonger.ActorSheetSwordMonger',
    sheetHeight: 635,
    mixin (schema) {
      const f = foundry.data.fields
      schema.skills.fields.deedDie = new f.SchemaField({
        label: new f.StringField({ initial: 'SwordMonger.DeedDie' }),
        die: new f.StringField({ initial: '1d4' })
      })
    },
    defaults: {
      sheetClass: 'Sword-Monger',
      localize: { 'class.className': 'SwordMonger.SwordMonger' },
      enrichHtml: { 'class.mightyDeedsLink': 'DCC.MightyDeedsLink' },
      literal: {
        // Sword Mongers crit on 19-20 at 1st level (widening to 17-20).
        'details.critRange': 19,
        'config.showSkills': true,
        'config.attackBonusMode': 'manual',
        'config.addClassLevelToInitiative': true,
        // deedDie is shared with Dervish; pin this class's label.
        'skills.deedDie.label': 'SwordMonger.DeedDie'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), 'sword-monger': { id: 'sword-monger', template: classPartial('sword-monger') } },
      tabs: { sheet: { tabs: [{ id: 'sword-monger', group: 'sheet', label: 'SwordMonger.SwordMonger' }] } }
    }
  },

  'martial-grandmaster': {
    label: 'MartialGrandmaster.ActorSheetMartialGrandmaster',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Unarmed strikes deal 1d5 + level. Shared field name with Luchador;
      // the label is pinned per-class in defaults.
      schema.skills.fields.unarmedDamage = new f.SchemaField({
        label: new f.StringField({ initial: 'MartialGrandmaster.UnarmedDamage' }),
        die: new f.StringField({ initial: '1d5' })
      })
      // Combat Luck: rolled 1d6 + level at the start of each combat; spent
      // to boost attacks, damage, and saves during that fight.
      schema.skills.fields.combatLuckDie = new f.SchemaField({
        label: new f.StringField({ initial: 'MartialGrandmaster.CombatLuckDie' }),
        die: new f.StringField({ initial: '1d6' })
      })
    },
    defaults: {
      sheetClass: 'Martial-Grandmaster',
      localize: { 'class.className': 'MartialGrandmaster.MartialGrandmaster' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat',
        'config.addClassLevelToInitiative': true,
        // unarmedDamage is shared with Luchador; pin this class's label.
        'skills.unarmedDamage.label': 'MartialGrandmaster.UnarmedDamage'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), 'martial-grandmaster': { id: 'martial-grandmaster', template: classPartial('martial-grandmaster') } },
      tabs: { sheet: { tabs: [{ id: 'martial-grandmaster', group: 'sheet', label: 'MartialGrandmaster.MartialGrandmaster' }] } }
    }
  },

  peasant: {
    label: 'Peasant.ActorSheetPeasant',
    sheetHeight: 635,
    mixin (schema) {
      const f = foundry.data.fields
      // Hobby Die: used for skill checks in a secondary "hobby" occupation
      // in place of the normal untrained d10. Gained from 2nd level.
      schema.skills.fields.hobbyDie = new f.SchemaField({
        label: new f.StringField({ initial: 'Peasant.HobbyDie' }),
        die: new f.StringField({ initial: '' })
      })
    },
    defaults: {
      sheetClass: 'Peasant',
      localize: { 'class.className': 'Peasant.Peasant' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), peasant: { id: 'peasant', template: classPartial('peasant') } },
      tabs: { sheet: { tabs: [{ id: 'peasant', group: 'sheet', label: 'Peasant.Peasant' }] } }
    }
  },

  barbearian: {
    label: 'Barbearian.ActorSheetBarbearian',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Rages per Day: a per-day usage counter (1 → 4), not a rollable die.
      schema.skills.fields.ragesPerDay = new f.SchemaField({
        label: new f.StringField({ initial: 'Barbearian.RagesPerDay' }),
        value: new f.StringField({ initial: '' })
      })
    },
    defaults: {
      sheetClass: 'Barbearian',
      localize: { 'class.className': 'Barbearian.Barbearian' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), barbearian: { id: 'barbearian', template: classPartial('barbearian') } },
      tabs: { sheet: { tabs: [{ id: 'barbearian', group: 'sheet', label: 'Barbearian.Barbearian' }] } }
    }
  },

  'heavenly-hitman': {
    label: 'HeavenlyHitman.ActorSheetHeavenlyHitman',
    sheetHeight: 640,
    mixin () {
      // Casts as a cleric and uses the thief skill block — both already
      // contributed to the shared Player schema by the DCC cleric/thief
      // mixins, so no class-specific fields are added here.
    },
    defaults: {
      sheetClass: 'Heavenly-Hitman',
      localize: { 'class.className': 'HeavenlyHitman.HeavenlyHitman' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.showBackstab': true,
        'config.showSpells': true,
        'class.spellCheckAbility': 'per',
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: {
        ...commonParts(),
        'heavenly-hitman': { id: 'heavenly-hitman', template: classPartial('heavenly-hitman') },
        clericSpells: { id: 'clericSpells', template: 'systems/dcc/templates/actor-partial-cleric-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'heavenly-hitman', group: 'sheet', label: 'HeavenlyHitman.HeavenlyHitman' },
            { id: 'clericSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  human: {
    label: 'Human.ActorSheetHuman',
    sheetHeight: 635,
    mixin () {},
    defaults: {
      sheetClass: 'Human',
      localize: { 'class.className': 'Human.Human' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), human: { id: 'human', template: classPartial('human') } },
      tabs: { sheet: { tabs: [{ id: 'human', group: 'sheet', label: 'Human.Human' }] } }
    }
  },

  'fowl-summoner': {
    label: 'FowlSummoner.ActorSheetFowlSummoner',
    sheetHeight: 640,
    mixin () {},
    defaults: {
      sheetClass: 'Fowl-Summoner',
      localize: { 'class.className': 'FowlSummoner.FowlSummoner' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.showSpells': true,
        'class.spellCheckAbility': 'per',
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: {
        ...commonParts(),
        'fowl-summoner': { id: 'fowl-summoner', template: classPartial('fowl-summoner') },
        wizardSpells: { id: 'wizardSpells', template: 'systems/dcc/templates/actor-partial-wizard-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'fowl-summoner', group: 'sheet', label: 'FowlSummoner.FowlSummoner' },
            { id: 'wizardSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  'tarantion-elf': {
    label: 'TarantionElf.ActorSheetTarantionElf',
    sheetHeight: 640,
    mixin () {},
    defaults: {
      sheetClass: 'Tarantion-Elf',
      localize: { 'class.className': 'TarantionElf.TarantionElf' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.showSpells': true,
        'class.spellCheckAbility': 'int',
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: {
        ...commonParts(),
        'tarantion-elf': { id: 'tarantion-elf', template: classPartial('tarantion-elf') },
        wizardSpells: { id: 'wizardSpells', template: 'systems/dcc/templates/actor-partial-wizard-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'tarantion-elf', group: 'sheet', label: 'TarantionElf.TarantionElf' },
            { id: 'wizardSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  'priest-of-the-old-father': {
    label: 'PriestOldFather.ActorSheetPriestOldFather',
    sheetHeight: 640,
    mixin () {},
    defaults: {
      sheetClass: 'Priest-Of-The-Old-Father',
      localize: { 'class.className': 'PriestOldFather.PriestOldFather' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.showSpells': true,
        'class.spellCheckAbility': 'per',
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: {
        ...commonParts(),
        'priest-of-the-old-father': { id: 'priest-of-the-old-father', template: classPartial('priest-of-the-old-father') },
        clericSpells: { id: 'clericSpells', template: 'systems/dcc/templates/actor-partial-cleric-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'priest-of-the-old-father', group: 'sheet', label: 'PriestOldFather.PriestOldFather' },
            { id: 'clericSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  'arcane-warrior': {
    label: 'ArcaneWarrior.ActorSheetArcaneWarrior',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // The "magic die" — a deed die used for attack, damage, spell checks,
      // and Mighty Deeds. Shared deedDie field; label pinned in defaults.
      schema.skills.fields.deedDie = new f.SchemaField({
        label: new f.StringField({ initial: 'ArcaneWarrior.MagicDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
    },
    defaults: {
      sheetClass: 'Arcane-Warrior',
      localize: { 'class.className': 'ArcaneWarrior.ArcaneWarrior' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.showSpells': true,
        'class.spellCheckAbility': 'int',
        'config.attackBonusMode': 'manual',
        'skills.deedDie.label': 'ArcaneWarrior.MagicDie'
      }
    },
    sheetPart: {
      parts: {
        ...commonParts(),
        'arcane-warrior': { id: 'arcane-warrior', template: classPartial('arcane-warrior') },
        wizardSpells: { id: 'wizardSpells', template: 'systems/dcc/templates/actor-partial-wizard-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'arcane-warrior', group: 'sheet', label: 'ArcaneWarrior.ArcaneWarrior' },
            { id: 'wizardSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  'mystic-arcanist': {
    label: 'MysticArcanist.ActorSheetMysticArcanist',
    sheetHeight: 640,
    mixin () {},
    defaults: {
      sheetClass: 'Mystic-Arcanist',
      localize: { 'class.className': 'MysticArcanist.MysticArcanist' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.showSpells': true,
        'class.spellCheckAbility': 'int',
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: {
        ...commonParts(),
        'mystic-arcanist': { id: 'mystic-arcanist', template: classPartial('mystic-arcanist') },
        wizardSpells: { id: 'wizardSpells', template: 'systems/dcc/templates/actor-partial-wizard-spells.html' },
        clericSpells: { id: 'clericSpells', template: 'systems/dcc/templates/actor-partial-cleric-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'mystic-arcanist', group: 'sheet', label: 'MysticArcanist.MysticArcanist' },
            { id: 'wizardSpells', group: 'sheet', label: 'DCC.WizardSpells' },
            { id: 'clericSpells', group: 'sheet', label: 'DCC.ClericSpells' }
          ]
        }
      }
    }
  }
}

/**
 * Register every Gongfarmer's Almanac class through the DCC extension
 * API. Called from the module `init` hook once `game.dcc` is available.
 * The mixins must register before the Player schema is first constructed.
 *
 * @param {object} api - the `game.dcc` namespace.
 */
export function registerGongfarmersClasses (api) {
  for (const [classId, def] of Object.entries(GONGFARMERS_CLASSES)) {
    api.registerClassMixin(classId, def.mixin)
    api.registerClassDefaults(classId, def.defaults)
    api.registerSheetPart(classId, def.sheetPart)
    api.registerHomebrewClassForProgressionLoad(classId, classId)
  }
}

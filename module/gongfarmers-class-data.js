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

  'tarantino-elf': {
    label: 'TarantinoElf.ActorSheetTarantinoElf',
    sheetHeight: 640,
    mixin () {},
    defaults: {
      sheetClass: 'Tarantino-Elf',
      localize: { 'class.className': 'TarantinoElf.TarantinoElf' },
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
        'tarantino-elf': { id: 'tarantino-elf', template: classPartial('tarantino-elf') },
        wizardSpells: { id: 'wizardSpells', template: 'systems/dcc/templates/actor-partial-wizard-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'tarantino-elf', group: 'sheet', label: 'TarantinoElf.TarantinoElf' },
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

  'spell-thief': {
    label: 'SpellThief.ActorSheetSpellThief',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // The "magic die" — a deed die added to attack and damage and to the
      // spell check (1d20 + Int + magic die). Shared deedDie field; the label
      // is pinned per-class in defaults.
      schema.skills.fields.deedDie = new f.SchemaField({
        label: new f.StringField({ initial: 'SpellThief.MagicDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
      // Casts as a wizard and uses the thief skill block + backstab — both
      // already contributed to the shared Player schema by the DCC
      // wizard/thief mixins, so no further fields are added here.
    },
    defaults: {
      sheetClass: 'Spell-Thief',
      localize: { 'class.className': 'SpellThief.SpellThief' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.showBackstab': true,
        'config.showSpells': true,
        'class.spellCheckAbility': 'int',
        'config.attackBonusMode': 'manual',
        // deedDie is shared with the deed-die classes; pin this class's label.
        'skills.deedDie.label': 'SpellThief.MagicDie'
      }
    },
    sheetPart: {
      parts: {
        ...commonParts(),
        'spell-thief': { id: 'spell-thief', template: classPartial('spell-thief') },
        wizardSpells: { id: 'wizardSpells', template: 'systems/dcc/templates/actor-partial-wizard-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'spell-thief', group: 'sheet', label: 'SpellThief.SpellThief' },
            { id: 'wizardSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  'rune-sage': {
    label: 'RuneSage.ActorSheetRuneSage',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // The "magic die" — a deed die added to attack and to the wizard
      // spell check (1d20 + Int + magic die). Shared deedDie field; the
      // label is pinned per-class in defaults.
      schema.skills.fields.deedDie = new f.SchemaField({
        label: new f.StringField({ initial: 'RuneSage.MagicDie' }),
        die: new f.StringField({ initial: '1d2' })
      })
      // Casts as a wizard (spells are carved into runes); the wizard mixin
      // already contributes the spell fields to the shared Player schema.
    },
    defaults: {
      sheetClass: 'Rune-Sage',
      localize: { 'class.className': 'RuneSage.RuneSage' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.showSpells': true,
        'class.spellCheckAbility': 'int',
        'config.attackBonusMode': 'manual',
        // deedDie is shared with the deed-die classes; pin this class's label.
        'skills.deedDie.label': 'RuneSage.MagicDie'
      }
    },
    sheetPart: {
      parts: {
        ...commonParts(),
        'rune-sage': { id: 'rune-sage', template: classPartial('rune-sage') },
        wizardSpells: { id: 'wizardSpells', template: 'systems/dcc/templates/actor-partial-wizard-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'rune-sage', group: 'sheet', label: 'RuneSage.RuneSage' },
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
  },

  // ---- 2016 Collection ----

  'hot-dog-suit': {
    label: 'HotDogSuit.ActorSheetHotDogSuit',
    sheetHeight: 635,
    mixin () {
      // A four-level joke class with no class-specific rollable die; its
      // abilities (Baffle, Pink Paper Flyers, the Bastich Luck tricks) are
      // descriptive notes on the class tab.
    },
    defaults: {
      sheetClass: 'Hot-Dog-Suit',
      localize: { 'class.className': 'HotDogSuit.HotDogSuit' },
      literal: {
        'details.critRange': 20,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), 'hot-dog-suit': { id: 'hot-dog-suit', template: classPartial('hot-dog-suit') } },
      tabs: { sheet: { tabs: [{ id: 'hot-dog-suit', group: 'sheet', label: 'HotDogSuit.HotDogSuit' }] } }
    }
  },

  barbarian: {
    label: 'Barbarian.ActorSheetBarbarian',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Warrior-style attack/deed die; rolled anew each attack and added to
      // both attack and damage. Shared deedDie field; label pinned in defaults.
      schema.skills.fields.deedDie = new f.SchemaField({
        label: new f.StringField({ initial: 'Barbarian.DeedDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
      // Savage Skills: a per-level modifier added to animal-grace tasks.
      schema.skills.fields.savageSkills = new f.SchemaField({
        label: new f.StringField({ initial: 'Barbarian.SavageSkills' }),
        value: new f.StringField({ initial: '' })
      })
      // Smell Sorcery: a per-level detect-magic die (rolled + level + Luck).
      schema.skills.fields.smellSorcery = new f.SchemaField({
        label: new f.StringField({ initial: 'Barbarian.SmellSorcery' }),
        die: new f.StringField({ initial: '1d14' })
      })
    },
    defaults: {
      sheetClass: 'Barbarian',
      localize: { 'class.className': 'Barbarian.Barbarian' },
      enrichHtml: { 'class.mightyDeedsLink': 'DCC.MightyDeedsLink' },
      literal: {
        // Improved critical threat range, widening to 17-20 (set per level).
        'details.critRange': 19,
        'config.showSkills': true,
        'config.attackBonusMode': 'manual',
        'config.addClassLevelToInitiative': true,
        // deedDie is shared with the deed-die classes; pin this class's label.
        'skills.deedDie.label': 'Barbarian.DeedDie'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), barbarian: { id: 'barbarian', template: classPartial('barbarian') } },
      tabs: { sheet: { tabs: [{ id: 'barbarian', group: 'sheet', label: 'Barbarian.Barbarian' }] } }
    }
  },

  'halfling-hucker': {
    label: 'HalflingHucker.ActorSheetHalflingHucker',
    sheetHeight: 640,
    mixin () {
      // Luck Die (spent with a Luck point to add to thrown-weapon attack and
      // damage) is the DCC built-in `class.luckDie`; Sneak & Hide comes from
      // the DCC halfling mixin on the shared Player schema (this class uses
      // the halfling table). No class-specific schema fields are added here.
    },
    defaults: {
      sheetClass: 'Halfling-Hucker',
      localize: { 'class.className': 'HalflingHucker.HalflingHucker' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), 'halfling-hucker': { id: 'halfling-hucker', template: classPartial('halfling-hucker') } },
      tabs: { sheet: { tabs: [{ id: 'halfling-hucker', group: 'sheet', label: 'HalflingHucker.HalflingHucker' }] } }
    }
  },

  'techno-necromancer': {
    label: 'TechnoNecromancer.ActorSheetTechnoNecromancer',
    sheetHeight: 640,
    mixin () {
      // Innate spellcaster from a bespoke necromancy list (no spellbook).
      // Modeled on the wizard spell tab; no class-specific schema fields.
    },
    defaults: {
      sheetClass: 'Techno-Necromancer',
      localize: { 'class.className': 'TechnoNecromancer.TechnoNecromancer' },
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
        'techno-necromancer': { id: 'techno-necromancer', template: classPartial('techno-necromancer') },
        wizardSpells: { id: 'wizardSpells', template: 'systems/dcc/templates/actor-partial-wizard-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'techno-necromancer', group: 'sheet', label: 'TechnoNecromancer.TechnoNecromancer' },
            { id: 'wizardSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  // ---- 2017 Collection ----

  'dwarf-sapper': {
    label: 'DwarfSapper.ActorSheetDwarfSapper',
    sheetHeight: 640,
    mixin () {
      // A dwarf skirmisher with backstab + a thief skill set + a luck die,
      // all DCC built-ins (`class.backstab`, `class.luckDie`, the thief skill
      // block) on the shared Player schema — driven per-level by the chart.
    },
    defaults: {
      sheetClass: 'Dwarf-Sapper',
      localize: { 'class.className': 'DwarfSapper.DwarfSapper' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.showBackstab': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), 'dwarf-sapper': { id: 'dwarf-sapper', template: classPartial('dwarf-sapper') } },
      tabs: { sheet: { tabs: [{ id: 'dwarf-sapper', group: 'sheet', label: 'DwarfSapper.DwarfSapper' }] } }
    }
  },

  'invincible-chicken': {
    label: 'InvincibleChicken.ActorSheetInvincibleChicken',
    sheetHeight: 635,
    mixin () {
      // Sneak & Hide comes from the DCC halfling mixin on the shared Player
      // schema; the chicken's other quirks are descriptive notes.
    },
    defaults: {
      sheetClass: 'Invincible-Chicken',
      localize: { 'class.className': 'InvincibleChicken.InvincibleChicken' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), 'invincible-chicken': { id: 'invincible-chicken', template: classPartial('invincible-chicken') } },
      tabs: { sheet: { tabs: [{ id: 'invincible-chicken', group: 'sheet', label: 'InvincibleChicken.InvincibleChicken' }] } }
    }
  },

  'orc-gfa': {
    label: 'Orc.ActorSheetOrc',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Rage die: rolled with each attack in place of a fixed attack bonus and
      // applied to attack and damage. Shared deedDie field; label pinned below.
      schema.skills.fields.deedDie = new f.SchemaField({
        label: new f.StringField({ initial: 'Orc.RageDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
    },
    defaults: {
      sheetClass: 'Orc-Gfa',
      localize: { 'class.className': 'Orc.Orc' },
      literal: {
        'details.critRange': 20,
        'config.attackBonusMode': 'manual',
        'skills.deedDie.label': 'Orc.RageDie'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), 'orc-gfa': { id: 'orc-gfa', template: classPartial('orc-gfa') } },
      tabs: { sheet: { tabs: [{ id: 'orc-gfa', group: 'sheet', label: 'Orc.Orc' }] } }
    }
  },

  'half-orc': {
    label: 'HalfOrc.ActorSheetHalfOrc',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Rage die, as the orc. Shared deedDie field; label pinned below.
      schema.skills.fields.deedDie = new f.SchemaField({
        label: new f.StringField({ initial: 'HalfOrc.RageDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
    },
    defaults: {
      sheetClass: 'Half-Orc',
      localize: { 'class.className': 'HalfOrc.HalfOrc' },
      literal: {
        'details.critRange': 20,
        'config.attackBonusMode': 'manual',
        'skills.deedDie.label': 'HalfOrc.RageDie'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), 'half-orc': { id: 'half-orc', template: classPartial('half-orc') } },
      tabs: { sheet: { tabs: [{ id: 'half-orc', group: 'sheet', label: 'HalfOrc.HalfOrc' }] } }
    }
  },

  'paladin-of-gambrinus': {
    label: 'PaladinGambrinus.ActorSheetPaladinGambrinus',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Smite die: added to attack and damage against the unholy (in place of
      // the normal attack bonus). A class-specific deed-style die.
      schema.skills.fields.smiteDie = new f.SchemaField({
        label: new f.StringField({ initial: 'PaladinGambrinus.SmiteDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
      // Casts as a cleric (Personality-based); cleric fields come from the DCC
      // cleric mixin on the shared Player schema.
    },
    defaults: {
      sheetClass: 'Paladin-Of-Gambrinus',
      localize: { 'class.className': 'PaladinGambrinus.PaladinGambrinus' },
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
        'paladin-of-gambrinus': { id: 'paladin-of-gambrinus', template: classPartial('paladin-of-gambrinus') },
        clericSpells: { id: 'clericSpells', template: 'systems/dcc/templates/actor-partial-cleric-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'paladin-of-gambrinus', group: 'sheet', label: 'PaladinGambrinus.PaladinGambrinus' },
            { id: 'clericSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  'bloody-hound': {
    label: 'BloodyHound.ActorSheetBloodyHound',
    sheetHeight: 640,
    mixin () {
      // A full-size "halfling" P.I.: uses the halfling table with two 1d16
      // action dice (Multi-Tasker). Sneak & Hide comes from the DCC halfling
      // mixin on the shared Player schema; detective skills are notes.
    },
    defaults: {
      sheetClass: 'Bloody-Hound',
      localize: { 'class.className': 'BloodyHound.BloodyHound' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), 'bloody-hound': { id: 'bloody-hound', template: classPartial('bloody-hound') } },
      tabs: { sheet: { tabs: [{ id: 'bloody-hound', group: 'sheet', label: 'BloodyHound.BloodyHound' }] } }
    }
  },

  // ---- 2018 Collection ----

  'bardic-rocker': {
    label: 'BardicRocker.ActorSheetBardicRocker',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Performance die: rolled to inspire allies (1d20 + performance die +
      // level) and grows by level.
      schema.skills.fields.performanceDie = new f.SchemaField({
        label: new f.StringField({ initial: 'BardicRocker.PerformanceDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
      // Casts spells with cleric-style disapproval (the source uses a Luck-based
      // spell check; Personality is the closest supported DCC ability). Cleric
      // fields come from the DCC cleric mixin on the shared Player schema.
    },
    defaults: {
      sheetClass: 'Bardic-Rocker',
      localize: { 'class.className': 'BardicRocker.BardicRocker' },
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
        'bardic-rocker': { id: 'bardic-rocker', template: classPartial('bardic-rocker') },
        clericSpells: { id: 'clericSpells', template: 'systems/dcc/templates/actor-partial-cleric-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'bardic-rocker', group: 'sheet', label: 'BardicRocker.BardicRocker' },
            { id: 'clericSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  berserker: {
    label: 'Berserker.ActorSheetBerserker',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Savage instinct: rolled on triggers during combat; the die expression
      // grows (and compounds) by level.
      schema.skills.fields.savageInstinctDie = new f.SchemaField({
        label: new f.StringField({ initial: 'Berserker.SavageInstinct' }),
        die: new f.StringField({ initial: 'd3' })
      })
    },
    defaults: {
      sheetClass: 'Berserker',
      localize: { 'class.className': 'Berserker.Berserker' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), berserker: { id: 'berserker', template: classPartial('berserker') } },
      tabs: { sheet: { tabs: [{ id: 'berserker', group: 'sheet', label: 'Berserker.Berserker' }] } }
    }
  },

  faerie: {
    label: 'Faerie.ActorSheetFaerie',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Size bonus: added to AC and Reflex saves (and to Luck), growing by
      // level. Sneak & Hide comes from the DCC halfling mixin on the shared
      // Player schema; faeries cast as wizards (wizard mixin contributes the
      // spell fields).
      schema.skills.fields.sizeBonus = new f.SchemaField({
        label: new f.StringField({ initial: 'Faerie.SizeBonus' }),
        value: new f.StringField({ initial: '' })
      })
    },
    defaults: {
      sheetClass: 'Faerie',
      localize: { 'class.className': 'Faerie.Faerie' },
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
        faerie: { id: 'faerie', template: classPartial('faerie') },
        wizardSpells: { id: 'wizardSpells', template: 'systems/dcc/templates/actor-partial-wizard-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'faerie', group: 'sheet', label: 'Faerie.Faerie' },
            { id: 'wizardSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  'goat-o-war': {
    label: 'GoatOWar.ActorSheetGoatOWar',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Deed die: a warrior-style die rolled with each attack and applied to
      // attack and damage. Shared deedDie field; label pinned in defaults.
      schema.skills.fields.deedDie = new f.SchemaField({
        label: new f.StringField({ initial: 'GoatOWar.DeedDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
    },
    defaults: {
      sheetClass: 'Goat-O-War',
      localize: { 'class.className': 'GoatOWar.GoatOWar' },
      enrichHtml: { 'class.mightyDeedsLink': 'DCC.MightyDeedsLink' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'manual',
        'skills.deedDie.label': 'GoatOWar.DeedDie'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), 'goat-o-war': { id: 'goat-o-war', template: classPartial('goat-o-war') } },
      tabs: { sheet: { tabs: [{ id: 'goat-o-war', group: 'sheet', label: 'GoatOWar.GoatOWar' }] } }
    }
  },

  gongfarmer: {
    label: 'Gongfarmer.ActorSheetGongfarmer',
    sheetHeight: 635,
    mixin () {
      // No class-specific rollable die; the gongfarmer's abilities (Luck of the
      // Pail, Extreme Fortitude, Night Soil) are descriptive notes.
    },
    defaults: {
      sheetClass: 'Gongfarmer',
      localize: { 'class.className': 'Gongfarmer.Gongfarmer' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), gongfarmer: { id: 'gongfarmer', template: classPartial('gongfarmer') } },
      tabs: { sheet: { tabs: [{ id: 'gongfarmer', group: 'sheet', label: 'Gongfarmer.Gongfarmer' }] } }
    }
  },

  'kith-of-kingspire': {
    label: 'Kith.ActorSheetKith',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Deed die: available when the kith takes the martial focus (a d3 Mighty
      // Deed die). Shared deedDie field; label pinned in defaults. The mystic
      // focus casts as a wizard (wizard mixin contributes the spell fields).
      schema.skills.fields.deedDie = new f.SchemaField({
        label: new f.StringField({ initial: 'Kith.DeedDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
    },
    defaults: {
      sheetClass: 'Kith-Of-Kingspire',
      localize: { 'class.className': 'Kith.Kith' },
      enrichHtml: { 'class.mightyDeedsLink': 'DCC.MightyDeedsLink' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.showSpells': true,
        'class.spellCheckAbility': 'int',
        'config.attackBonusMode': 'flat',
        'skills.deedDie.label': 'Kith.DeedDie'
      }
    },
    sheetPart: {
      parts: {
        ...commonParts(),
        'kith-of-kingspire': { id: 'kith-of-kingspire', template: classPartial('kith-of-kingspire') },
        wizardSpells: { id: 'wizardSpells', template: 'systems/dcc/templates/actor-partial-wizard-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'kith-of-kingspire', group: 'sheet', label: 'Kith.Kith' },
            { id: 'wizardSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  lycanthrope: {
    label: 'Lycanthrope.ActorSheetLycanthrope',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Wolf-form bonus: added to Str/Sta mods, AC, and perception while
      // transformed. Wolf-form crit: the crit die/table used in wolf form.
      schema.skills.fields.wolfFormBonus = new f.SchemaField({
        label: new f.StringField({ initial: 'Lycanthrope.WolfFormBonus' }),
        value: new f.StringField({ initial: '' })
      })
      schema.skills.fields.wolfFormCrit = new f.SchemaField({
        label: new f.StringField({ initial: 'Lycanthrope.WolfFormCrit' }),
        die: new f.StringField({ initial: '1d12/M' })
      })
    },
    defaults: {
      sheetClass: 'Lycanthrope',
      localize: { 'class.className': 'Lycanthrope.Lycanthrope' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), lycanthrope: { id: 'lycanthrope', template: classPartial('lycanthrope') } },
      tabs: { sheet: { tabs: [{ id: 'lycanthrope', group: 'sheet', label: 'Lycanthrope.Lycanthrope' }] } }
    }
  },

  pirate: {
    label: 'Pirate.ActorSheetPirate',
    sheetHeight: 635,
    mixin () {
      // No class-specific rollable die; the pirate's abilities (Swashbuckle,
      // Buried Treasure, Strength in Numbers) are descriptive notes.
    },
    defaults: {
      sheetClass: 'Pirate',
      localize: { 'class.className': 'Pirate.Pirate' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), pirate: { id: 'pirate', template: classPartial('pirate') } },
      tabs: { sheet: { tabs: [{ id: 'pirate', group: 'sheet', label: 'Pirate.Pirate' }] } }
    }
  },

  'quantum-traveler': {
    label: 'QuantumTraveler.ActorSheetQuantumTraveler',
    sheetHeight: 640,
    mixin () {
      // Luck die (`class.luckDie`), the thief skill block, and Luck & Wits are
      // DCC built-ins on the shared Player schema (the traveler uses them as a
      // neutral thief); no class-specific fields are added here.
    },
    defaults: {
      sheetClass: 'Quantum-Traveler',
      localize: { 'class.className': 'QuantumTraveler.QuantumTraveler' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), 'quantum-traveler': { id: 'quantum-traveler', template: classPartial('quantum-traveler') } },
      tabs: { sheet: { tabs: [{ id: 'quantum-traveler', group: 'sheet', label: 'QuantumTraveler.QuantumTraveler' }] } }
    }
  },

  sage: {
    label: 'Sage.ActorSheetSage',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Curse die: Luck spent to inflict a penalty die on a foe; grows by level.
      schema.skills.fields.curseDie = new f.SchemaField({
        label: new f.StringField({ initial: 'Sage.CurseDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
      // Casts patron-granted spells as a wizard (wizard mixin contributes the
      // spell fields to the shared Player schema).
    },
    defaults: {
      sheetClass: 'Sage',
      localize: { 'class.className': 'Sage.Sage' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.showSpells': true,
        'class.spellCheckAbility': 'int',
        'config.attackBonusMode': 'flat',
        'config.addClassLevelToInitiative': true
      }
    },
    sheetPart: {
      parts: {
        ...commonParts(),
        sage: { id: 'sage', template: classPartial('sage') },
        wizardSpells: { id: 'wizardSpells', template: 'systems/dcc/templates/actor-partial-wizard-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'sage', group: 'sheet', label: 'Sage.Sage' },
            { id: 'wizardSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  scout: {
    label: 'Scout.ActorSheetScout',
    sheetHeight: 640,
    mixin () {
      // A thief variant: Luck die (`class.luckDie`) and the thief skill block
      // (sneak silently, climb sheer surfaces, find/disable trap, handle poison)
      // are DCC built-ins on the shared Player schema, driven per-level by the
      // chart. Ambush/hide-in-the-wilds/track/set-trap are descriptive notes.
    },
    defaults: {
      sheetClass: 'Scout',
      localize: { 'class.className': 'Scout.Scout' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), scout: { id: 'scout', template: classPartial('scout') } },
      tabs: { sheet: { tabs: [{ id: 'scout', group: 'sheet', label: 'Scout.Scout' }] } }
    }
  },

  soldier: {
    label: 'Soldier.ActorSheetSoldier',
    sheetHeight: 635,
    mixin () {
      // A 5-level Trench Crawl Classics class; its attack bonus and skills come
      // from the chosen military specialty (descriptive notes), so no
      // class-specific rollable die is added here.
    },
    defaults: {
      sheetClass: 'Soldier',
      localize: { 'class.className': 'Soldier.Soldier' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), soldier: { id: 'soldier', template: classPartial('soldier') } },
      tabs: { sheet: { tabs: [{ id: 'soldier', group: 'sheet', label: 'Soldier.Soldier' }] } }
    }
  },

  // ---- 2019 Collection ----

  'anti-cleric': {
    label: 'AntiCleric.ActorSheetAntiCleric',
    sheetHeight: 640,
    mixin () {
      // No class-specific rollable die. The anti-cleric is a cleric in all
      // mechanics (attack, crit, action dice, saves, hit die, spells known);
      // its Power!/Sacrifice/Drain Life/Command Chaos features are notes.
      // Cleric spell fields come from the DCC cleric mixin on the shared
      // Player schema. Spell check uses Personality (DCC supports int/per/sta).
    },
    defaults: {
      sheetClass: 'Anti-Cleric',
      localize: { 'class.className': 'AntiCleric.AntiCleric' },
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
        'anti-cleric': { id: 'anti-cleric', template: classPartial('anti-cleric') },
        clericSpells: { id: 'clericSpells', template: 'systems/dcc/templates/actor-partial-cleric-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'anti-cleric', group: 'sheet', label: 'AntiCleric.AntiCleric' },
            { id: 'clericSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  cambion: {
    label: 'Cambion.ActorSheetCambion',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Beast Die: the damage die of the cambion's natural weaponry (claws,
      // fangs, barbs); also added to physical skill tests. Grows by level.
      schema.skills.fields.beastDie = new f.SchemaField({
        label: new f.StringField({ initial: 'Cambion.BeastDie' }),
        die: new f.StringField({ initial: '1d4' })
      })
      // Aspects of the Demon: the cumulative number of demonic aspects the
      // cambion has gained (display-only count).
      schema.skills.fields.aspects = new f.SchemaField({
        label: new f.StringField({ initial: 'Cambion.Aspects' }),
        value: new f.StringField({ initial: '' })
      })
    },
    defaults: {
      sheetClass: 'Cambion',
      localize: { 'class.className': 'Cambion.Cambion' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), cambion: { id: 'cambion', template: classPartial('cambion') } },
      tabs: { sheet: { tabs: [{ id: 'cambion', group: 'sheet', label: 'Cambion.Cambion' }] } }
    }
  },

  'children-of-the-wild': {
    label: 'ChildrenOfTheWild.ActorSheetChildrenOfTheWild',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // The faerie casts as a hedge-magician wizard (no spellburn/corruption);
      // the wizard mixin contributes the spell fields. Known Spells and Max
      // Spell Level are display-only per-level columns.
      schema.skills.fields.knownSpells = new f.SchemaField({
        label: new f.StringField({ initial: 'ChildrenOfTheWild.KnownSpells' }),
        value: new f.StringField({ initial: '' })
      })
      schema.skills.fields.maxSpellLevel = new f.SchemaField({
        label: new f.StringField({ initial: 'ChildrenOfTheWild.MaxSpellLevel' }),
        value: new f.StringField({ initial: '' })
      })
    },
    defaults: {
      sheetClass: 'Children-Of-The-Wild',
      localize: { 'class.className': 'ChildrenOfTheWild.ChildrenOfTheWild' },
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
        'children-of-the-wild': { id: 'children-of-the-wild', template: classPartial('children-of-the-wild') },
        wizardSpells: { id: 'wizardSpells', template: 'systems/dcc/templates/actor-partial-wizard-spells.html' }
      },
      tabs: {
        sheet: {
          tabs: [
            { id: 'children-of-the-wild', group: 'sheet', label: 'ChildrenOfTheWild.ChildrenOfTheWild' },
            { id: 'wizardSpells', group: 'sheet', label: 'DCC.Spells' }
          ]
        }
      }
    }
  },

  godling: {
    label: 'Godling.ActorSheetGodling',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Bloodline Abilities: the cumulative number of "The Blood Tells" powers
      // the godling has chosen/rolled (display-only count). The à-la-carte
      // powers themselves are notes; some grant spellcasting, but the godling
      // has no fixed spell list, so no spell tab is added.
      schema.skills.fields.bloodlineAbilities = new f.SchemaField({
        label: new f.StringField({ initial: 'Godling.BloodlineAbilities' }),
        value: new f.StringField({ initial: '' })
      })
    },
    defaults: {
      sheetClass: 'Godling',
      localize: { 'class.className': 'Godling.Godling' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'flat'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), godling: { id: 'godling', template: classPartial('godling') } },
      tabs: { sheet: { tabs: [{ id: 'godling', group: 'sheet', label: 'Godling.Godling' }] } }
    }
  },

  fater: {
    label: 'Fater.ActorSheetFater',
    sheetHeight: 640,
    mixin (schema) {
      const f = foundry.data.fields
      // Deed die: the Fater receives no fixed attack modifier; instead a Deed
      // die is added to bare-hand attack/damage, Polymath/thief-skill checks,
      // Wild Healing, Will saves vs. mind-influence, and Hand of Fate re-rolls.
      // Shared deedDie field; label pinned in defaults.
      schema.skills.fields.deedDie = new f.SchemaField({
        label: new f.StringField({ initial: 'Fater.DeedDie' }),
        die: new f.StringField({ initial: '1d3' })
      })
      // Unarmed damage die (shared unarmedDamage field; label pinned below) and
      // the Wild Healing extract (amount + uses/day, display-only).
      schema.skills.fields.unarmedDamage = new f.SchemaField({
        label: new f.StringField({ initial: 'Fater.UnarmedDamage' }),
        die: new f.StringField({ initial: '1d4' })
      })
      schema.skills.fields.wildHealing = new f.SchemaField({
        label: new f.StringField({ initial: 'Fater.WildHealing' }),
        value: new f.StringField({ initial: '' })
      })
    },
    defaults: {
      sheetClass: 'Fater',
      localize: { 'class.className': 'Fater.Fater' },
      literal: {
        'details.critRange': 20,
        'config.showSkills': true,
        'config.attackBonusMode': 'manual',
        'skills.deedDie.label': 'Fater.DeedDie',
        'skills.unarmedDamage.label': 'Fater.UnarmedDamage'
      }
    },
    sheetPart: {
      parts: { ...commonParts(), fater: { id: 'fater', template: classPartial('fater') } },
      tabs: { sheet: { tabs: [{ id: 'fater', group: 'sheet', label: 'Fater.Fater' }] } }
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

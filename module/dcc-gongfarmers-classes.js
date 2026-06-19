/* global game, Hooks */

import * as AssassinSheets from './actor-sheets-assassin.js'
import * as DervishSheets from './actor-sheets-dervish.js'
import * as LuchadorSheets from './actor-sheets-luchador.js'
import * as SwordMongerSheets from './actor-sheets-sword-monger.js'
import * as MartialGrandmasterSheets from './actor-sheets-martial-grandmaster.js'
import * as PeasantSheets from './actor-sheets-peasant.js'
import * as BarbearianSheets from './actor-sheets-barbearian.js'
import * as HeavenlyHitmanSheets from './actor-sheets-heavenly-hitman.js'
import * as HumanSheets from './actor-sheets-human.js'
import * as FowlSummonerSheets from './actor-sheets-fowl-summoner.js'
import * as TarantinoElfSheets from './actor-sheets-tarantino-elf.js'
import * as PriestOldFatherSheets from './actor-sheets-priest-of-the-old-father.js'
import * as ArcaneWarriorSheets from './actor-sheets-arcane-warrior.js'
import * as MysticArcanistSheets from './actor-sheets-mystic-arcanist.js'
import * as SpellThiefSheets from './actor-sheets-spell-thief.js'
import * as RuneSageSheets from './actor-sheets-rune-sage.js'
import * as HotDogSuitSheets from './actor-sheets-hot-dog-suit.js'
import * as BarbarianSheets from './actor-sheets-barbarian.js'
import * as HalflingHuckerSheets from './actor-sheets-halfling-hucker.js'
import * as TechnoNecromancerSheets from './actor-sheets-techno-necromancer.js'
import { createClassItems, createAllClassItems } from './createClassItems.js'
import { registerGongfarmersClasses } from './gongfarmers-class-data.js'

/**
 * Sheet registrations: each class is a 5-line `DCCSheet` stub. The
 * `scope` is the persisted `flags.core.sheetClass` id for each class.
 */
const GONGFARMERS_SHEETS = [
  { sheet: AssassinSheets.ActorSheetAssassin, scope: 'dcc-gongfarmers-classes-assassin', label: 'Assassin.ActorSheetAssassin' },
  { sheet: DervishSheets.ActorSheetDervish, scope: 'dcc-gongfarmers-classes-dervish', label: 'Dervish.ActorSheetDervish' },
  { sheet: LuchadorSheets.ActorSheetLuchador, scope: 'dcc-gongfarmers-classes-luchador', label: 'Luchador.ActorSheetLuchador' },
  { sheet: SwordMongerSheets.ActorSheetSwordMonger, scope: 'dcc-gongfarmers-classes-sword-monger', label: 'SwordMonger.ActorSheetSwordMonger' },
  { sheet: MartialGrandmasterSheets.ActorSheetMartialGrandmaster, scope: 'dcc-gongfarmers-classes-martial-grandmaster', label: 'MartialGrandmaster.ActorSheetMartialGrandmaster' },
  { sheet: PeasantSheets.ActorSheetPeasant, scope: 'dcc-gongfarmers-classes-peasant', label: 'Peasant.ActorSheetPeasant' },
  { sheet: BarbearianSheets.ActorSheetBarbearian, scope: 'dcc-gongfarmers-classes-barbearian', label: 'Barbearian.ActorSheetBarbearian' },
  { sheet: HeavenlyHitmanSheets.ActorSheetHeavenlyHitman, scope: 'dcc-gongfarmers-classes-heavenly-hitman', label: 'HeavenlyHitman.ActorSheetHeavenlyHitman' },
  { sheet: HumanSheets.ActorSheetHuman, scope: 'dcc-gongfarmers-classes-human', label: 'Human.ActorSheetHuman' },
  { sheet: FowlSummonerSheets.ActorSheetFowlSummoner, scope: 'dcc-gongfarmers-classes-fowl-summoner', label: 'FowlSummoner.ActorSheetFowlSummoner' },
  { sheet: TarantinoElfSheets.ActorSheetTarantinoElf, scope: 'dcc-gongfarmers-classes-tarantino-elf', label: 'TarantinoElf.ActorSheetTarantinoElf' },
  { sheet: PriestOldFatherSheets.ActorSheetPriestOldFather, scope: 'dcc-gongfarmers-classes-priest-of-the-old-father', label: 'PriestOldFather.ActorSheetPriestOldFather' },
  { sheet: ArcaneWarriorSheets.ActorSheetArcaneWarrior, scope: 'dcc-gongfarmers-classes-arcane-warrior', label: 'ArcaneWarrior.ActorSheetArcaneWarrior' },
  { sheet: MysticArcanistSheets.ActorSheetMysticArcanist, scope: 'dcc-gongfarmers-classes-mystic-arcanist', label: 'MysticArcanist.ActorSheetMysticArcanist' },
  { sheet: SpellThiefSheets.ActorSheetSpellThief, scope: 'dcc-gongfarmers-classes-spell-thief', label: 'SpellThief.ActorSheetSpellThief' },
  { sheet: RuneSageSheets.ActorSheetRuneSage, scope: 'dcc-gongfarmers-classes-rune-sage', label: 'RuneSage.ActorSheetRuneSage' },
  { sheet: HotDogSuitSheets.ActorSheetHotDogSuit, scope: 'dcc-gongfarmers-classes-hot-dog-suit', label: 'HotDogSuit.ActorSheetHotDogSuit' },
  { sheet: BarbarianSheets.ActorSheetBarbarian, scope: 'dcc-gongfarmers-classes-barbarian', label: 'Barbarian.ActorSheetBarbarian' },
  { sheet: HalflingHuckerSheets.ActorSheetHalflingHucker, scope: 'dcc-gongfarmers-classes-halfling-hucker', label: 'HalflingHucker.ActorSheetHalflingHucker' },
  { sheet: TechnoNecromancerSheets.ActorSheetTechnoNecromancer, scope: 'dcc-gongfarmers-classes-techno-necromancer', label: 'TechnoNecromancer.ActorSheetTechnoNecromancer' }
]

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */
Hooks.once('init', async function () {
  console.log("DCC | Initializing Dungeon Crawl Classics — Gongfarmer's Almanac Classes")

  game.createGongfarmersClassItems = createClassItems
  game.createAllGongfarmersClassItems = createAllClassItems

  // Register the class level-data pack with the DCC system so the lib's
  // class-progression loader can assemble progressions at `dcc.ready`.
  Hooks.callAll('dcc.registerLevelDataPack', 'dcc-gongfarmers-classes.gongfarmers-class-level-data')

  // Register every class through the DCC extension API: schema mixin +
  // first-open defaults + sheet parts/tabs + progression-load mapping.
  // `game.dcc` is created during the DCC system's `init` hook, which
  // runs before this module's `init`.
  registerGongfarmersClasses(game.dcc)

  // Register the per-class sheet stubs. The `DCCSheet` base composes
  // parts/tabs from the `registerSheetPart` entries above by `CLASS_ID`.
  for (const { sheet, scope, label } of GONGFARMERS_SHEETS) {
    game.dcc.registerActorSheet('Player', sheet, { scope, label })
  }
})

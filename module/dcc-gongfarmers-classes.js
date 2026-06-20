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
import * as DwarfSapperSheets from './actor-sheets-dwarf-sapper.js'
import * as InvincibleChickenSheets from './actor-sheets-invincible-chicken.js'
import * as OrcSheets from './actor-sheets-orc-gfa.js'
import * as HalfOrcSheets from './actor-sheets-half-orc.js'
import * as PaladinGambrinusSheets from './actor-sheets-paladin-of-gambrinus.js'
import * as BloodyHoundSheets from './actor-sheets-bloody-hound.js'
import * as BardicRockerSheets from './actor-sheets-bardic-rocker.js'
import * as BerserkerSheets from './actor-sheets-berserker.js'
import * as FaerieSheets from './actor-sheets-faerie.js'
import * as GoatOWarSheets from './actor-sheets-goat-o-war.js'
import * as GongfarmerSheets from './actor-sheets-gongfarmer.js'
import * as KithSheets from './actor-sheets-kith-of-kingspire.js'
import * as LycanthropeSheets from './actor-sheets-lycanthrope.js'
import * as PirateSheets from './actor-sheets-pirate.js'
import * as QuantumTravelerSheets from './actor-sheets-quantum-traveler.js'
import * as SageSheets from './actor-sheets-sage.js'
import * as ScoutSheets from './actor-sheets-scout.js'
import * as SoldierSheets from './actor-sheets-soldier.js'
import * as AntiClericSheets from './actor-sheets-anti-cleric.js'
import * as CambionSheets from './actor-sheets-cambion.js'
import * as ChildrenOfTheWildSheets from './actor-sheets-children-of-the-wild.js'
import * as GodlingSheets from './actor-sheets-godling.js'
import * as FaterSheets from './actor-sheets-fater.js'
import * as AetherianWarcatSheets from './actor-sheets-aetherian-warcat.js'
import * as GnomeGfaSheets from './actor-sheets-gnome-gfa.js'
import * as SinEaterSheets from './actor-sheets-sin-eater-of-the-shudders.js'
import * as SupernaturalModelSheets from './actor-sheets-supernatural-model.js'
import * as ChimeramanSheets from './actor-sheets-chimeraman.js'
import * as InvestigatorSheets from './actor-sheets-investigator.js'
import * as TherapistSheets from './actor-sheets-therapist.js'
import * as TauruneSheets from './actor-sheets-taurune.js'
import * as MinoveanSageSheets from './actor-sheets-minovean-sage.js'
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
  { sheet: TechnoNecromancerSheets.ActorSheetTechnoNecromancer, scope: 'dcc-gongfarmers-classes-techno-necromancer', label: 'TechnoNecromancer.ActorSheetTechnoNecromancer' },
  { sheet: DwarfSapperSheets.ActorSheetDwarfSapper, scope: 'dcc-gongfarmers-classes-dwarf-sapper', label: 'DwarfSapper.ActorSheetDwarfSapper' },
  { sheet: InvincibleChickenSheets.ActorSheetInvincibleChicken, scope: 'dcc-gongfarmers-classes-invincible-chicken', label: 'InvincibleChicken.ActorSheetInvincibleChicken' },
  { sheet: OrcSheets.ActorSheetOrc, scope: 'dcc-gongfarmers-classes-orc-gfa', label: 'Orc.ActorSheetOrc' },
  { sheet: HalfOrcSheets.ActorSheetHalfOrc, scope: 'dcc-gongfarmers-classes-half-orc', label: 'HalfOrc.ActorSheetHalfOrc' },
  { sheet: PaladinGambrinusSheets.ActorSheetPaladinGambrinus, scope: 'dcc-gongfarmers-classes-paladin-of-gambrinus', label: 'PaladinGambrinus.ActorSheetPaladinGambrinus' },
  { sheet: BloodyHoundSheets.ActorSheetBloodyHound, scope: 'dcc-gongfarmers-classes-bloody-hound', label: 'BloodyHound.ActorSheetBloodyHound' },
  { sheet: BardicRockerSheets.ActorSheetBardicRocker, scope: 'dcc-gongfarmers-classes-bardic-rocker', label: 'BardicRocker.ActorSheetBardicRocker' },
  { sheet: BerserkerSheets.ActorSheetBerserker, scope: 'dcc-gongfarmers-classes-berserker', label: 'Berserker.ActorSheetBerserker' },
  { sheet: FaerieSheets.ActorSheetFaerie, scope: 'dcc-gongfarmers-classes-faerie', label: 'Faerie.ActorSheetFaerie' },
  { sheet: GoatOWarSheets.ActorSheetGoatOWar, scope: 'dcc-gongfarmers-classes-goat-o-war', label: 'GoatOWar.ActorSheetGoatOWar' },
  { sheet: GongfarmerSheets.ActorSheetGongfarmer, scope: 'dcc-gongfarmers-classes-gongfarmer', label: 'Gongfarmer.ActorSheetGongfarmer' },
  { sheet: KithSheets.ActorSheetKith, scope: 'dcc-gongfarmers-classes-kith-of-kingspire', label: 'Kith.ActorSheetKith' },
  { sheet: LycanthropeSheets.ActorSheetLycanthrope, scope: 'dcc-gongfarmers-classes-lycanthrope', label: 'Lycanthrope.ActorSheetLycanthrope' },
  { sheet: PirateSheets.ActorSheetPirate, scope: 'dcc-gongfarmers-classes-pirate', label: 'Pirate.ActorSheetPirate' },
  { sheet: QuantumTravelerSheets.ActorSheetQuantumTraveler, scope: 'dcc-gongfarmers-classes-quantum-traveler', label: 'QuantumTraveler.ActorSheetQuantumTraveler' },
  { sheet: SageSheets.ActorSheetSage, scope: 'dcc-gongfarmers-classes-sage', label: 'Sage.ActorSheetSage' },
  { sheet: ScoutSheets.ActorSheetScout, scope: 'dcc-gongfarmers-classes-scout', label: 'Scout.ActorSheetScout' },
  { sheet: SoldierSheets.ActorSheetSoldier, scope: 'dcc-gongfarmers-classes-soldier', label: 'Soldier.ActorSheetSoldier' },
  { sheet: AntiClericSheets.ActorSheetAntiCleric, scope: 'dcc-gongfarmers-classes-anti-cleric', label: 'AntiCleric.ActorSheetAntiCleric' },
  { sheet: CambionSheets.ActorSheetCambion, scope: 'dcc-gongfarmers-classes-cambion', label: 'Cambion.ActorSheetCambion' },
  { sheet: ChildrenOfTheWildSheets.ActorSheetChildrenOfTheWild, scope: 'dcc-gongfarmers-classes-children-of-the-wild', label: 'ChildrenOfTheWild.ActorSheetChildrenOfTheWild' },
  { sheet: GodlingSheets.ActorSheetGodling, scope: 'dcc-gongfarmers-classes-godling', label: 'Godling.ActorSheetGodling' },
  { sheet: FaterSheets.ActorSheetFater, scope: 'dcc-gongfarmers-classes-fater', label: 'Fater.ActorSheetFater' },
  { sheet: AetherianWarcatSheets.ActorSheetAetherianWarcat, scope: 'dcc-gongfarmers-classes-aetherian-warcat', label: 'AetherianWarcat.ActorSheetAetherianWarcat' },
  { sheet: GnomeGfaSheets.ActorSheetGnomeGfa, scope: 'dcc-gongfarmers-classes-gnome-gfa', label: 'Gnome.ActorSheetGnomeGfa' },
  { sheet: SinEaterSheets.ActorSheetSinEaterOfTheShudders, scope: 'dcc-gongfarmers-classes-sin-eater-of-the-shudders', label: 'SinEater.ActorSheetSinEaterOfTheShudders' },
  { sheet: SupernaturalModelSheets.ActorSheetSupernaturalModel, scope: 'dcc-gongfarmers-classes-supernatural-model', label: 'SupernaturalModel.ActorSheetSupernaturalModel' },
  { sheet: ChimeramanSheets.ActorSheetChimeraman, scope: 'dcc-gongfarmers-classes-chimeraman', label: 'Chimeraman.ActorSheetChimeraman' },
  { sheet: InvestigatorSheets.ActorSheetInvestigator, scope: 'dcc-gongfarmers-classes-investigator', label: 'Investigator.ActorSheetInvestigator' },
  { sheet: TherapistSheets.ActorSheetTherapist, scope: 'dcc-gongfarmers-classes-therapist', label: 'Therapist.ActorSheetTherapist' },
  { sheet: TauruneSheets.ActorSheetTaurune, scope: 'dcc-gongfarmers-classes-taurune', label: 'Taurune.ActorSheetTaurune' },
  { sheet: MinoveanSageSheets.ActorSheetMinoveanSage, scope: 'dcc-gongfarmers-classes-minovean-sage', label: 'MinoveanSage.ActorSheetMinoveanSage' }
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

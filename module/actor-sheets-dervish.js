/**
 * DCC Dervish character sheet — parts/tabs/defaults come from the DCC
 * extension-API registries (see `gongfarmers-class-data.js`).
 */

import { DCCSheet } from '../../../../../../../systems/dcc/module/actor-sheets-dcc.js'

/**
 * @extends {DCCSheet}
 */
class ActorSheetDervish extends DCCSheet {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    position: { height: 635 }
  }

  /** @inheritDoc */
  static CLASS_ID = 'dervish'
}

export {
  ActorSheetDervish
}

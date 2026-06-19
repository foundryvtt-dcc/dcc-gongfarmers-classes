/**
 * DCC Assassin character sheet — parts/tabs/defaults come from the DCC
 * extension-API registries (see `gongfarmers-class-data.js`).
 */

import { DCCSheet } from '../../../../../../../systems/dcc/module/actor-sheets-dcc.js'

/**
 * @extends {DCCSheet}
 */
class ActorSheetAssassin extends DCCSheet {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    position: { height: 635 }
  }

  /** @inheritDoc */
  static CLASS_ID = 'assassin'
}

export {
  ActorSheetAssassin
}

// Modules
// You can import script modules and have full type completion
import Dialog from './Dialog/index.mjs'
import BankItems from './BankItems/index.mjs'
import XCombat from './Combat/index.mjs'
import * as XButtons from './Button/index.mjs'
import * as Drop from './Drop/index.mjs'

// js
import lang from '../lang/index.js'

// Data
// Game data for registration
// import ModData from '../data/data.json'

// Styles
// Will automatically load your styles upon loading the mod
import '../css/styles.css'

// Images
// To bundle your mod's icon
import '../img/M.png'
// Reference images using `ctx.getResourceUrl`
// import LargeIcon from '../img/M_large.png';
import LargeSidebarIcon from '../img/icon_large.png'

/**
 * @param {ModContext} ctx
 */
export async function setup (ctx) {
  // await ctx.gameData.addPackage(ModData)

  ctx.onModsLoaded(async (ctx) => {
    Drop.dropPetHtml(ctx);
    // Drop.dropFishSellforHtml(ctx);
  });

  ctx.onInterfaceReady(async () => {
    // setting lang
    let currentLang = lang[setLang]
    if (!currentLang) {
      currentLang = lang['en']
    }

    // mod setting
    const settingId = 'x-setting'
    const setting = Dialog({
      modalShow: false,
      modalID: `modal-${settingId}`,
      modalTitle: currentLang.setting.name,
      modalContent: `<div id="${settingId}"></div>`
    })
    ui.create(setting, document.getElementById('page-container'))
    Drop.dropSetting(ctx, setting, settingId, currentLang)

    // all function btn
    const functionId = 'x-function'
    const XFunction = Dialog({
      modalShow: false,
      modalID: `modal-${functionId}`,
      modalTitle: currentLang.function.name,
      modalContent: `<div id="${functionId}"></div>`
    })
    ui.create(XFunction, document.getElementById('page-container'))
    XButtons.xSidebarFunction(functionId)

    // cheat
    const dialog = Dialog({
      modalShow: false,
      modalID: 'modal-x-cheat',
      modalTitle: currentLang.cheating.name,
      modalContent: `<div id="x-table-Items"></div>`
    })
    ui.create(dialog, document.getElementById('page-container'))
    ui.create(
      BankItems({ select: 'select', ctx, lang: currentLang }),
      document.getElementById('x-table-Items')
    )
    // inster cheat button into sidebar
    sidebar
      .category('X Auto Manger', { toggleable: true, after: 'Modding' })
      .item(currentLang.cheating.name, {
        icon: ctx.getResourceUrl(LargeSidebarIcon),
        onClick () {
          dialog.open()
        }
      })
    sidebar
      .category('X Auto Manger')
      .item(currentLang.setting.name, {
        icon: ctx.getResourceUrl(LargeSidebarIcon),
        onClick () {
          setting.open()
        }
      })
    if (window.settingStorage.inSidebar) {
      sidebar
        .category('X Auto Manger')
        .item(currentLang.function.name, {
          icon: ctx.getResourceUrl(LargeSidebarIcon),
          onClick () {
            XFunction.open()
          }
        })
    }

    // combat
    const combatDialog = Dialog({
      modalShow: false,
      modalID: 'modal-x-combat',
      modalTitle: currentLang.button.slayerSetting,
      modalContent: `<div id="x-combat-dialog"></div>`
    })
    ui.create(combatDialog, document.getElementById('page-container'))
    ui.create(
      XCombat({
        select: 'select',
        ctx,
        dialog: combatDialog,
        lang: currentLang
      }),
      document.getElementById('x-combat-dialog')
    )
    if (!window.settingStorage.inSidebar) {
      ui.create(
        XButtons.xSlayerButton({ ctx, dialog: combatDialog, lang: currentLang, func: null }),
        $('#combat-slayer-task-menu').children()[0]
      )
    } else {
      ui.create(
        XButtons.xSlayerButton({ ctx, dialog: combatDialog, lang: currentLang, func: XFunction }),
        document.getElementById('x-slayer-btn-box')
      )
    }


    // MonsterDrop
    Drop.drop(ctx)
    // Pet
    Drop.dropPetInterfaceHtml()

    // Auto Buttons
    XButtons.xAutoLootButton(ctx, currentLang)
    XButtons.xAttackStyles(ctx, currentLang)

    // Farming
    XButtons.xAutoFarmingButton(ctx, currentLang)

    if (window.settingStorage.sortBtn) {
      XButtons.xAutoResetBankTab(ctx, currentLang)
    }

  })
}

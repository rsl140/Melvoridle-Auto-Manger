// Modules
// You can import script modules and have full type completion
import Dialog from './Dialog/index.mjs';
import BankItems from './BankItems/index.mjs';

// Data
// Game data for registration
import ModData from '../data/data.json';

// Styles
// Will automatically load your styles upon loading the mod
import '../css/styles.css';

// Images
// To bundle your mod's icon
import '../img/M.png';
// Reference images using `ctx.getResourceUrl`
import LargeIcon from '../img/M_large.png';
import LargeSidebarIcon from '../img/icon_large.png';

/**
 * @param {ModContext} ctx
 */
export async function setup (ctx) {
  await ctx.gameData.addPackage(ModData);
  // ctx.onModsLoaded(() => {
  //   console.warn('Hello From My Mod!');
  // });

  ctx.onInterfaceReady(() => {
    const dialog = Dialog({
      modalShow: false,
      modalID: 'modal-cheat',
      modalTitle: 'Game Cheat',
      // modalContent: `<img class="modBoilerplate__logo-img" src="${ctx.getResourceUrl(LargeIcon)}" />`
      modalContent: `<div id="x-table-Items"></div>`
    })
    ui.create(dialog, document.getElementById('page-container'));
    ui.create(BankItems({ select: 'select' }), document.getElementById('x-table-Items'));
    sidebar.category('X Auto Manger', { toggleable: true, after: 'Modding' }).item('Game Cheat', {
      icon: ctx.getResourceUrl(LargeSidebarIcon),
      onClick () {
        dialog.open()
      }
    });
  });
}

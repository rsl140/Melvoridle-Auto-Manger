// Modules
// You can import script modules and have full type completion
import Dialog from './Dialog/index.mjs';

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
export async function setup(ctx) {
  await ctx.gameData.addPackage(ModData);
  // ctx.onModsLoaded(() => {
  //   console.warn('Hello From My Mod!');
  // });

  ctx.onInterfaceReady(() => {
    const dialog = Dialog({
      modalShow: false,
      modalID: 'modal-aaa',
      modalTitle: 'text',
      modalContent: `<img class="modBoilerplate__logo-img" src="${ctx.getResourceUrl(LargeIcon)}" />`
    })
    ui.create(dialog, document.getElementById('page-container'));
    sidebar.category('X Auto Manger', { toggleable: true, after: 'Modding' }).item('Game Cheating', {
      icon: ctx.getResourceUrl(LargeSidebarIcon),
      onClick() {
        dialog.open()
      }
    });
  });
}

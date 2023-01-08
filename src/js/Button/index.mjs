export function xSlayerButton (props) {
  return {
    $template: '#x-slayer-btn',
    lang: props.lang,
    dialog: props.dialog,
    handleClick () {
      if (game.combat.isActive) {
        // stop now combat
        combatMenus.runButton.click();
      }
      this.dialog.open();
    }
  }
}

export function xAutoLootButton (ctx, lang) {
  if ($('#x-auto-loot').length !== 0) {
    return
  }
  const isCheck = ctx.characterStorage.getItem('x-auto-loot');
  const div = document.createElement('div')
  div.className = 'block-content pt-0 pb-3'
  div.innerHTML = `
        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" id="x-auto-loot" ${isCheck ? 'checked' : ''}>
          <label class="custom-control-label" for="x-auto-loot">${lang.combat.autoLootAll}</label>
        </div>
      `
  $('#combat-loot').prepend(div);

  $("#x-auto-loot").on("change",function(){
    ctx.characterStorage.setItem('x-auto-loot', this.checked);
  });

  ctx.patch(CombatManager, 'onEnemyDeath').after(() => {
    const autoLootAll = $('#x-auto-loot')[0].checked;
    if (autoLootAll) {
      const drops = game.combat.loot.drops;
      const count = drops.length;
      if (count > 0) {
        game.combat.loot.lootAll();
      }
    }
  });
}

export function xAttackStyles (ctx, lang) {
  // Automatically switch attack styles according to skill level
  if ($('#x-attack-styles').length !== 0) {
    return
  }
  const isCheck = ctx.characterStorage.getItem('x-attack-styles');
  const div = document.createElement('div')
  div.className = 'block-content pb-0 pb-3'
  div.innerHTML = `
        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" id="x-attack-styles" ${isCheck ? 'checked' : ''}>
          <label class="custom-control-label" for="x-attack-styles">${lang.combat.autoAttackStyles}</label>
        </div>
      `
  $('#combat-slayer-task-menu').next().append(div);

  $("#x-attack-styles").on("change",function(){
    ctx.characterStorage.setItem('x-attack-styles', this.checked);
  });

  function getAttackStyles () {
    const obj = {};
    game.attackStyles.forEach(e => {
      obj[e.localID] = e;
    });
    return obj;
  }

  ctx.patch(CombatManager, 'onEnemyDeath').after(() => {
    const autoAttackStyles = $('#x-attack-styles')[0].checked;
    if (autoAttackStyles) {
      const skillName = getAttackStyles();
      const obj = { 0: 'Stab', 1: 'Slash', 2: 'Block' };
      const skillLvArr = [game.attack.level, game.strength.level, game.defence.level];
      const min = Math.min(...skillLvArr);
      const index = skillLvArr.indexOf(min);
      game.combat.player.setAttackStyle(skillName[obj[index]].attackType, skillName[obj[index]]);
    }
  });
}

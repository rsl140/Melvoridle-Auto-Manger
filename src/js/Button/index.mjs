export function xSidebarFunction (domId) {
  const div = document.createElement('div')
  div.className = 'x-bank-items-box'
  div.innerHTML = `
    <div class="col-12">
      <div class="row row-deck">
        <div class="col" id="x-slayer-btn-box"> </div>
        <div class="col" id="x-auto-loot-box" style="display: flex; align-items: center;"> </div>
        <div class="col" id="x-attack-styles-box"> </div>
      </div>
      <div class="mb-3"></div>
      <div class="row row-deck">
        <div class="col" id="x-auto-farming-box"> </div>
      </div>
    </div>
  `
  $(`#${domId}`).append(div)
}

export function xSlayerButton (props) {
  return {
    $template: '#x-slayer-btn',
    lang: props.lang,
    dialog: props.dialog,
    func: props.func,
    handleClick () {
      if (game.combat.isActive) {
        // stop now combat
        combatMenus.runButton.click();
      }
      this.dialog.open();
      if (this.func) {
        this.func.close();
      }
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
  if (!window.settingStorage.inSidebar) {
    $('#combat-loot').prepend(div);
  } else {
    $(`#x-auto-loot-box`).append(div)
  }


  $("#x-auto-loot").on("change", function () {
    ctx.characterStorage.setItem('x-auto-loot', this.checked);
  });

  ctx.patch(CombatManager, 'onEnemyDeath').after(() => {
    const isCheck = ctx.characterStorage.getItem('x-auto-loot');
    if (isCheck) {
      const drops = game.combat.loot.drops;
      const count = drops.length;
      if(count > 0) {
          for(let i = count - 1; i >= 0; i--) {
              const drop = drops[i];
              if (game.bank.addItem(drop.item, drop.quantity, false, true)) {
                  game.stats.Combat.add(CombatStats.ItemsLooted, drop.quantity);
                  drops.splice(i, 1);
                  game.combat.loot.renderRequired = true;
              }
          }
      }
      const lostCount = game.combat.loot.lostLoot.size
      if (lostCount > 0) {
        const lostLoot = game.combat.loot.lostLoot
        lostLoot.forEach((v,i)=>{
          game.bank.addItem(i, v, false, true)
        })
        lostLoot.clear()
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
  if (!window.settingStorage.inSidebar) {
    $('#melee-attack-style-buttons').append(div);
  } else {
    $(`#x-attack-styles-box`).append(div)
  }

  $("#x-attack-styles").on("change", function () {
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
    if ($('#x-attack-styles').length !== 0) {
      const autoAttackStyles = $('#x-attack-styles')[0].checked;
      if (autoAttackStyles) {
        const skillName = getAttackStyles();
        const obj = { 0: 'Stab', 1: 'Slash', 2: 'Block' };
        const skillLvArr = [game.attack.level, game.strength.level, game.defence.level];
        const min = Math.min(...skillLvArr);
        const index = skillLvArr.indexOf(min);
        game.combat.player.setAttackStyle(skillName[obj[index]].attackType, skillName[obj[index]]);
      }
    }
  });
}


export function xAutoFarmingButton (ctx, lang) {
  if ($('#x-auto-farming').length !== 0) {
    return
  }
  const btn = document.createElement('button')
  btn.className = "btn btn-sm btn-alt-success m-1"
  btn.id = 'x-auto-farming'
  btn.textContent = lang.button.farming
  btn.addEventListener("click", () => {
    game.farming.categories.allObjects.map(val => {
      game.farming.harvestAllOnClick(val)
      game.farming.compostAllOnClick(val, game.items.composts.allObjects[0])
      game.farming.plantAllSelectedOnClick(val)
    })
  })

  if (!window.settingStorage.inSidebar) {
    $('#farming-category-options').prepend(btn);
  } else {
    $('#x-auto-farming-box').append(btn)
  }
}



// 药水[4]，垃圾[5]，装备类[6]，使用类[7]，食物类[8]，材料类[9]，合成类[10]，杂物类[11]
function fliterItem () {
  return {
    // 药水[4]
    potionArr: {
      tabId: 4,
      value: ['PotionItem']
    },
    // 装备，武器 [6]
    equipArr: {
      tabId: 6,
      value: ['EquipmentItem', 'WeaponItem']
    },
    // 骨头，代币，宝箱 [7]
    useArr: {
      tabId: 7,
      value: ['BoneItem', 'TokenItem', 'OpenableItem']
    },
    // 食物 [8]
    etaArr: {
      tabId: 8,
      value: ['FoodItem']
    },
    // 肥料 [9]
    materialArr: {
      tabId: 9,
      value: ['CompostItem']
    },
    // [10]
    synthesisArr: {
      tabId: 10,
      value: []
    },
    // 书 [11]
    otherArr: {
      tabId: 11,
      value: ['ReadableItem']
    },
  }
}

// 装备类[6]，使用类[7]，食物类[8]，材料类[9]，合成类[10]，杂物类[11]
function fliterItemType () {
  return {
    junkArr: {
      tabId: 5,
      value: ['Artefact', 'Junk']
    },
    equipArr: {
      tabId: 6,
      value: ['Amulet']
    },
    useArr: {
      tabId: 7,
      value: ['Shard']
    },
    etaArr: {
      tabId: 8,
      value: ['Raw Fish']
    },
    materialArr: {
      tabId: 9,
      value: ['Logs', 'Bar', 'Crafting Material', 'Dragonhide', 'Cooked Fish', 'Essence', 'Gem', 'General', 'Herb', 'Ingredient', 'Ore', 'Rune', 'Seeds', 'Superior Gem', 'Urn', 'Leather', 'Crafting', 'Crystal']
    },
    synthesisArr: {
      tabId: 10,
      value: ['Arrows', 'Arrowtips', 'Bows', 'Crossbow', 'Fragment', 'Item', 'Javelin', 'Material', 'Misc', 'Unstrung Bows']
    },
    otherArr: {
      tabId: 11,
      value: ['Christmas', 'Christmas 2021', 'Easter', 'Fish', 'Junk', 'Lemon', 'Lime', 'Miscellaneous', 'Resource', 'TODO', 'Secret']
    }
  }
}

// 武器分类 近战[1]，远程[2]，魔法[3]
function fliterCombatItemType () {
  return {
    combatArr: {
      tabId: 1,
      value: ['Weapon', 'Armour', 'Trimmed Armour', 'Shield', '2H']
    },
    rangedArr: {
      tabId: 2,
      value: ['Ranged Weapon', 'Ammo', 'Ranged Armour', 'Arrows', 'Bolts']
    },
    magicArr: {
      tabId: 3,
      value: ['Magic Staff', 'Magic Armour', 'Magic Wand', 'Magic Book', 'Magic']
    }
  }
}

function mapBankItems (arr, type, tabId, byTabId) {
  game.bank.itemsByTab[byTabId].forEach(x => {
    if (type === 'constructor') {
      if (arr.includes(Object.getPrototypeOf(x.item).constructor.name)) {
        game.bank.toggleItemSelected(x)
      }
    } else if (type === 'type') {
      if (arr.includes(x.item.type)) {
        game.bank.toggleItemSelected(x)
      }
    }
  })
  game.bank.itemSelectionMode = 1
  game.bank.moveSelectedItemsToTab(tabId)
}

export function xAutoResetBankTab (ctx, lang) {
  if ($('#x-auto-reset-bank-tab').length !== 0) {
    return
  }
  const btn = document.createElement('button')
  btn.className = "btn btn-sm btn-alt-info m-1"
  btn.id = 'x-auto-reset-bank-tab'
  btn.textContent = lang.button.resetBankTab
  btn.addEventListener("click", () => {
    for (let item of game.bank.defaultItemTabs.entries()) {
      game.bank.defaultItemTabs.set(item[0], 0)
    }

    // init to tab 0
    for (let i = 1; i < game.bank.tabCount; i++) {
      game.bank.itemSelectionMode = 1
      game.bank.itemsByTab[i].forEach(x => {
        game.bank.toggleItemSelected(x)
      })
      game.bank.moveSelectedItemsToTab(0)
    }


    const constructorItem = Object.values(fliterItem())
    const itemType = Object.values(fliterItemType())
    const combatType = Object.values(fliterCombatItemType())

    constructorItem.forEach(val => {
      if (val.value.length > 0) {
        mapBankItems(val.value, 'constructor', val.tabId, 0)
      }
    })
    itemType.forEach(val => {
      if (val.value.length > 0) {
        mapBankItems(val.value, 'type', val.tabId, 0)
      }
    })
    combatType.forEach(val => {
      if (val.value.length > 0) {
        mapBankItems(val.value, 'type', val.tabId, 6)
      }
    })
    game.bank.sortButtonOnClick()
  })
  $('#main-bank-options').children(0).children(0).children(0).children(0)[0].prepend(btn)
  tippy('#x-auto-reset-bank-tab', {
    content: "<div style='color: #e56767;font-size: 18px;'>" + lang.button.resetBankTabNote + "</div>",
    placement: 'bottom',
    allowHTML: true,
    interactive: false,
    animation: false,
  });

  if (!window.settingStorage.sortBtn) {
    $('#x-auto-reset-bank-tab').hide()
  }
}
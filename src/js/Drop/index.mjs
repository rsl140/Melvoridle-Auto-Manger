function dropSetting (ctx, dialog, settingDomId, lang) {
  const settingStorage = ctx.characterStorage.getItem(`x-${settingDomId}`)
  let checkObj = {
    gp: true,
    qty: true,
    lock: true,
  }
  if (!settingStorage) {
    ctx.characterStorage.setItem(`x-${settingDomId}`, checkObj)
  } else {
    checkObj = settingStorage
  }
  window.settingStorage = checkObj
  const div = document.createElement('div')
  div.className = 'x-bank-items-box'
  div.innerHTML = `
    <div class="col-12">
      <h4 class="mb-2" style="min-width: 40vw;">${lang.setting.Drop}</h4>
      <div class="row row-deck">
        <div class="col">
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="x-drop-gp" ${checkObj && checkObj.gp ? 'checked' : ''}>
            <label class="custom-control-label" for="x-drop-gp">${lang.setting.GP}</label>
          </div>
        </div>
        <div class="col">
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="x-drop-qty" ${checkObj && checkObj.qty ? 'checked' : ''}>
            <label class="custom-control-label" for="x-drop-qty">${lang.setting.qty}</label>
          </div>
        </div>
        <div class="col">
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="x-drop-lock" ${checkObj && checkObj.lock ? 'checked' : ''}>
            <label class="custom-control-label" for="x-drop-lock">${lang.setting.lock}</label>
          </div>
        </div>
      </div>
    </div>
  `
  $(`#${settingDomId}`).append(div)
  $("#x-drop-gp").on("change", function () {
    checkObj.gp = this.checked
    ctx.characterStorage.setItem(`x-${settingDomId}`, checkObj)
    window.settingStorage = checkObj
  });
  $("#x-drop-qty").on("change", function () {
    checkObj.qty = this.checked
    ctx.characterStorage.setItem(`x-${settingDomId}`, checkObj)
    window.settingStorage = checkObj
  });
  $("#x-drop-lock").on("change", function () {
    checkObj.lock = this.checked
    ctx.characterStorage.setItem(`x-${settingDomId}`, checkObj)
    window.settingStorage = checkObj
  });
}

function drop (ctx) {
  dropMonsterHtml(ctx)
  dropThievingHtml(ctx)
  window.viewItemContents = viewItemContents
}

// monster
function dropMonsterHtml (ctx) {
  ctx.patch(CombatManager, 'getMonsterDropsHTML').replace(function (o, monster, respectArea) {
    const settingStorage = window.settingStorage
    let drops = ''
    if (monster.lootChance > 0 && monster.lootTable.size > 0 && !(respectArea && this.areaType === CombatAreaType.Dungeon)) {
      drops = monster.lootTable.sortedDropsArray.map((drop) => {
        let dropText = templateLangString('BANK_STRING', '40', {
          qty: `${drop.maxQuantity}`,
          itemImage: `<img class="skill-icon-xs mr-2" src="${drop.item.media}">`,
          itemName: drop.item.name
        })
        dropText += ` (${((monster.lootChance * drop.weight) / monster.lootTable.weight).toFixed(2)}%)`
        if (settingStorage.lock) {
          dropText += `
          ${game.stats.Items.get(drop.item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
          `
        }
        if (settingStorage.gp) {
          dropText += `
            <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${drop.item.sellsFor}
          `
        }
        if (settingStorage.qty) {
          dropText += `
          <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(drop.item)}
          `
        }
        // dropText += ` (${((monster.lootChance * drop.weight) / monster.lootTable.weight).toFixed(2)}%)
        //   ${game.stats.Items.get(drop.item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
        //   <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${drop.item.sellsFor}
        //   <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(drop.item)}
        // `
        return dropText
      }
      ).join('<br>')
    }
    let bones = ''
    if (monster.bones !== undefined && !(respectArea && this.selectedArea instanceof Dungeon && !this.selectedArea.dropBones)) {
      bones = `${getLangString('MISC_STRING', '7')}<br><small><img class="skill-icon-xs mr-2" src="${monster.bones.item.media}">${monster.bones.item.name}</small><br><br>`
    } else {
      bones = getLangString('COMBAT_MISC', '107') + '<br><br>'
    }
    let html = `<span class="text-dark">${bones}<br>`
    if (drops !== '') {
      html += `${getLangString('MISC_STRING', '8')}<br><small>${getLangString('MISC_STRING', '9')}</small><br>${drops}`
    }
    html += '</span>'
    return html
  });
}

// items
function viewItemContents (item) {
  const settingStorage = window.settingStorage
  const dropsOrdered = item.dropTable.sortedDropsArray;
  const drops = dropsOrdered.map((drop) => {
    let dropText = templateString(getLangString('BANK_STRING', '40'), {
      qty: `${numberWithCommas(drop.maxQuantity)}`,
      itemImage: `<img class="skill-icon-xs mr-2" src="${drop.item.media}">`,
      itemName: drop.item.name,
    });
    dropText += ` (${((100 * drop.weight) / item.dropTable.totalWeight).toFixed(2)}%)`
    if (settingStorage.lock) {
      dropText += `
          ${game.stats.Items.get(drop.item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
          `
    }
    if (settingStorage.gp) {
      dropText += `
            <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${drop.item.sellsFor}
          `
    }
    if (settingStorage.qty) {
      dropText += `
          <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(drop.item)}
          `
    }
    // dropText += ` (${((100 * drop.weight) / item.dropTable.totalWeight).toFixed(2)}%)
    //     ${game.stats.Items.get(drop.item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
    //     <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${drop.item.sellsFor}
    //     <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(drop.item)}
    //     `
    return dropText
  }
  ).join('<br>');
  SwalLocale.fire({
    title: item.name,
    html: getLangString('BANK_STRING', '39') + '<br><small>' + drops,
    imageUrl: item.media,
    imageWidth: 64,
    imageHeight: 64,
    imageAlt: item.name,
  });
}

// thieving
function dropThievingHtml (ctx) {
  ctx.patch(ThievingMenu, 'formatSpecialDrop').replace(function (o, item, qty) {
    const settingStorage = window.settingStorage
    let html = o(item, qty)
    const found = game.stats.itemFindCount(item);
    if (found) {
      html += ` (${(100 / 500).toFixed(2)}%)`
      if (settingStorage.lock) {
        html += `
            ${game.stats.Items.get(item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
          `
      }
      if (settingStorage.gp) {
        html += `
            <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${item.sellsFor}
          `
      }
      if (settingStorage.qty) {
        html += `
            <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(item)}
          `
      }
      // html += `
      //   (${(100 / 500).toFixed(2)}%)
      //   ${game.stats.Items.get(item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
      //   <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${item.sellsFor}
      //   <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(item)}
      // `
    }
    return html
  })
  ctx.patch(ThievingMenu, 'showNPCDrops').replace(function (o, npc, area) {
    const settingStorage = window.settingStorage
    const sortedTable = npc.lootTable.sortedDropsArray;
    const { minGP, maxGP } = game.thieving.getNPCGPRange(npc);
    let html = `<span class="text-dark"><small><img class="skill-icon-xs mr-2" src="${cdnMedia('assets/media/main/coins.svg')}"> ${templateLangString('MENU_TEXT', 'GP_AMOUNT', {
      gp: `${formatNumber(minGP)}-${formatNumber(maxGP)}`,
    })}</small><br>`;
    html += `${getLangString('THIEVING', 'POSSIBLE_COMMON')}<br><small>`;
    if (sortedTable.length) {
      html += `${getLangString('THIEVING', 'MOST_TO_LEAST_COMMON')}<br>`;
      const totalWeight = npc.lootTable.weight;
      html += sortedTable.map(({ item, weight, minQuantity, maxQuantity }) => {
        let text = `${maxQuantity > minQuantity ? `${minQuantity}-` : ''}${maxQuantity} x <img class="skill-icon-xs mr-2" src="${item.media}">${item.name}`;
        text += ` (${((100 * weight) / totalWeight).toFixed(2)}%)`
        if (settingStorage.lock) {
          text += `
            ${game.stats.Items.get(item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
          `
        }
        if (settingStorage.gp) {
          text += `
            <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${item.sellsFor}
          `
        }
        if (settingStorage.qty) {
          text += `
            <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(item)}
          `
        }
        // text += `
        //   (${((100 * weight) / totalWeight).toFixed(2)}%)
        //   ${game.stats.Items.get(item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
        //   <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${item.sellsFor}
        //   <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(item)}
        // `
        return text;
      }
      ).join('<br>');
      if (DEBUGENABLED)
        html += `<br>Average Value: ${npc.lootTable.averageDropValue.toFixed(2)} GP`;
    } else {
      html += getLangString('THIEVING', 'NO_COMMON_DROPS');
    }
    html += `</small><br>`;
    html += `${getLangString('THIEVING', 'POSSIBLE_RARE')}<br><small>`;
    const generalRareHTML = [];
    game.thieving.generalRareItems.forEach(({ item, npcs }) => {
      if (npcs === undefined || npcs.has(npc))
        generalRareHTML.push(this.formatSpecialDrop(item));
    }
    );
    html += generalRareHTML.join('<br>');
    html += `</small><br>`;
    if (area.uniqueDrops.length) {
      html += `${getLangString('THIEVING', 'POSSIBLE_AREA_UNIQUE')}<br><small>`;
      html += area.uniqueDrops.map((drop) => this.formatSpecialDrop(drop.item, drop.quantity)).join('<br>');
      html += '</small><br>';
    }
    if (npc.uniqueDrop !== undefined) {
      html += `${getLangString('THIEVING', 'POSSIBLE_NPC_UNIQUE')}<br><small>${this.formatSpecialDrop(npc.uniqueDrop.item, npc.uniqueDrop.quantity)}</small>`;
    }
    html += '</span>';
    SwalLocale.fire({
      title: npc.name,
      html,
      imageUrl: npc.media,
      imageWidth: 64,
      imageHeight: 64,
      imageAlt: npc.name,
    });
  });
}

// pet
function dropPetHtml (ctx) {
  ctx.patch(CombatAreaMenu, "createName").replace(function (o, areaData) {
    let name = o(areaData);
    if (areaData.pet) {
      const pet = areaData.pet.pet
      const requirements = createElement('div', {
        classList: ['font-size-sm']
      });
      requirements.innerHTML = `
        <small id="x-manger-${pet.id}">
          ${getLangString('PAGE_NAME', 'CompletionLog_SUBCATEGORY_4')}：
          <img class="skill-icon-xs mr-1 ml-2" src="${pet.media}">
          (${(100 / areaData.pet.weight).toFixed(2)}%)
        </small>
      `
      name.appendChild(requirements)
    }
    return name;
  });

  ctx.patch(PetManager, "unlockPet").replace(function (o, pet) {
    const petDiv = document.getElementById(`x-manger-${pet.id}`)
    if (petDiv) {
      if (petDiv.lastChild.tagName === 'I') {
        petDiv.removeChild(petDiv.lastChild)
        const iDiv = createElement('i', {
          classList: ['text-success', 'fa', 'fa-check-circle']
        });
        petDiv.appendChild(iDiv);
      }
    }
    return o(pet)
  })
}

function dropPetInterfaceHtml () {
  function renderPet (area) {
    area.map(({ pet }) => {
      if (pet) {
        const petDiv = document.getElementById(`x-manger-${pet.pet.id}`)
        if (petDiv) {
          if (game.petManager.isPetUnlocked(game.pets.getObjectByID(pet.pet.id))) {
            const iDiv = createElement('i', {
              classList: ['text-success', 'fa', 'fa-check-circle']
            });
            petDiv.appendChild(iDiv);
          } else {
            const iDiv = createElement('i', {
              classList: ['fa', 'fa-fw', 'fa-times']
            });
            iDiv.style = 'color: #e56767;'
            petDiv.appendChild(iDiv);
          }
        }
      }
    })
  }

  renderPet(game.combatAreaDisplayOrder)
  renderPet(game.slayerAreaDisplayOrder)
  renderPet(game.dungeonDisplayOrder)
}

// FishGP
function dropFishSellforHtml (ctx) {
  ctx.patch(FishingAreaMenuButton, "setFishUnlocked").replace(function (o, fish, area) {
    this.fishName.textContent = `${fish.product.name}(${fish.product.sellsFor}GP)`;
    this.fishImage.src = fish.product.media;
    showElement(this.fishImage);
    this.link.onclick = () => game.fishing.onAreaFishSelection(area, fish);
    this.fishName.classList.remove('text-danger');
    // return true
  })
}

export {
  drop,
  dropSetting,
  dropPetHtml,
  dropPetInterfaceHtml,
  dropFishSellforHtml
}
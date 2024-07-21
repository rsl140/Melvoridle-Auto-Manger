function dropSetting (ctx, dialog, settingDomId, lang) {
  const settingStorage = ctx.accountStorage.getItem(`x-${settingDomId}`)
  let checkObj = {
    gp: true,
    qty: true,
    lock: true,
    sortBtn: true,
    inSidebar: false
  }
  if (!settingStorage) {
    ctx.accountStorage.setItem(`x-${settingDomId}`, checkObj)
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
        <div class="col">
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="x-drop-sort-btn" ${checkObj && checkObj.sortBtn ? 'checked' : ''}>
            <label class="custom-control-label" for="x-drop-sort-btn">${lang.setting.sortBtn}</label>
          </div>
        </div>
      </div>
      <h4 class="mb-2" style="min-width: 40vw;">${lang.setting.Btn}</h4>
      <div class="row row-deck">
        <div class="col">
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="x-btn-in-sidebar" ${checkObj && checkObj.inSidebar ? 'checked' : ''}>
            <label class="custom-control-label" for="x-btn-in-sidebar">${lang.setting.inSidebar}</label>
          </div>
        </div>
      </div>
    </div>
  `
  $(`#${settingDomId}`).append(div)
  $("#x-drop-gp").on("change", function () {
    checkObj.gp = this.checked
    ctx.accountStorage.setItem(`x-${settingDomId}`, checkObj)
    window.settingStorage = checkObj
  });
  $("#x-drop-qty").on("change", function () {
    checkObj.qty = this.checked
    ctx.accountStorage.setItem(`x-${settingDomId}`, checkObj)
    window.settingStorage = checkObj
  });
  $("#x-drop-lock").on("change", function () {
    checkObj.lock = this.checked
    ctx.accountStorage.setItem(`x-${settingDomId}`, checkObj)
    window.settingStorage = checkObj
  });
  $("#x-drop-sort-btn").on("change", function () {
    checkObj.sortBtn = this.checked
    ctx.accountStorage.setItem(`x-${settingDomId}`, checkObj)
    window.settingStorage = checkObj

    // 动态显示隐藏归类按钮
    if (this.checked) {
      $('#x-auto-reset-bank-tab').show()
    } else {
      $('#x-auto-reset-bank-tab').hide()
    }
  });
  $("#x-btn-in-sidebar").on("change", function () {
    checkObj.inSidebar = this.checked
    ctx.accountStorage.setItem(`x-${settingDomId}`, checkObj)
    window.settingStorage = checkObj
  });
}

function drop (ctx) {
  dropMonsterHtml(ctx)
  dropThievingHtml(ctx)
  dropArchaeologyHtml(ctx)
  window.viewItemContents = viewItemContents
}

// monster
function dropMonsterHtml (ctx) {
  ctx.patch(CombatManager, 'getMonsterDropsHTML').replace(function (o, monster, respectArea) {
    const settingStorage = window.settingStorage
    let drops = ''
    if (monster.lootChance > 0 && monster.lootTable.size > 0 && !(respectArea && this.selectedArea !== undefined && !this.selectedArea.dropsLoot)) {
      drops = monster.lootTable.sortedDropsArray.map((drop) => {
        let dropText = templateLangString('BANK_STRING_40', {
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
            <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${drop.item.sellsFor.quantity}
          `
        }
        if (settingStorage.qty) {
          dropText += `
          <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(drop.item)}
          `
        }
        return dropText
      }
      ).join('<br>')
    }
    let always = `${getLangString('MISC_STRING_7')}`;
    if (!(respectArea && this.selectedArea !== undefined && !this.selectedArea.dropsCurrency)) {
      monster.currencyDrops.forEach((currencyDrop) => {
        always += `<br>${templateLangString('BETWEEN_VALUE', { qty1: numberWithCommas(currencyDrop.min), qty2: numberWithCommas(currencyDrop.max), })} <img class="skill-icon-xs mr-2" src="${currencyDrop.currency.media}">${currencyDrop.currency.name}`;
      });
    }
    let bones = '';
    const dropsBones = monster.bones !== undefined && !(respectArea && this.selectedArea !== undefined && !this.selectedArea.dropsBones);
    const dropsBarrierDust = monster.hasBarrier;
    if (dropsBarrierDust || dropsBones) {
      if (dropsBones && monster.bones !== undefined) {
        bones += `<br>${monster.bones.quantity} x <img class="skill-icon-xs mr-2" src="${monster.bones.item.media}">${monster.bones.item.name}`;
      }
      if (dropsBarrierDust) {
        const barrierDustItem = this.game.items.getObjectByID("melvorAoD:Barrier_Dust");
        if (barrierDustItem !== undefined) {
          bones += `<br><img class="skill-icon-xs mr-2" src="${barrierDustItem.media}">${barrierDustItem.name}`;
        }
      }
      bones += `<br><br>`;
    } else {
      bones = `<br><small class="text-danger">${getLangString('COMBAT_MISC_107')}</small><br><br>`;
    }
    let html = `<span class="text-dark">${always}${bones}<br>`;
    if (drops !== '') {
      html += `${getLangString('MISC_STRING_8')}<br><small>${getLangString('MISC_STRING_9')}</small><br>${drops}`;
    }
    html += '</span>';
    return html
  });
}

// items
function viewItemContents (item) {
  const settingStorage = window.settingStorage
  const dropsOrdered = item.dropTable.sortedDropsArray;
  const drops = dropsOrdered.map((drop) => {
    let dropText = templateString(getLangString('BANK_STRING_40'), {
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
            <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${drop.item.sellsFor.quantity}
          `
    }
    if (settingStorage.qty) {
      dropText += `
          <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(drop.item)}
          `
    }
    return dropText
  }).join('<br>')
  SwalLocale.fire({
    title: item.name,
    html: getLangString('BANK_STRING_39') + '<br><small>' + drops,
    imageUrl: item.media,
    imageWidth: 64,
    imageHeight: 64,
    imageAlt: item.name,
  });
}

// archaeology
function dropArchaeologyHtml (ctx) {
  ctx.patch(ArtefactDropListElement, 'getItemDrop').replace(function (o, item, quantity, weight) {
    const settingStorage = window.settingStorage
    let html = o(item, quantity, weight)
    const { digSite, size } = game.archaeology.getArtefactTypeAndLocation(item)
    const totalWeight = digSite.artefacts[size].totalWeight

    const found = game.stats.itemFindCount(item);

    html += ` (${(100 * weight / totalWeight).toFixed(2)}%)`

    if (settingStorage.gp) {
      html += `
            <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${item.sellsFor.quantity}
          `
    }
    if (settingStorage.qty && found) {
      html += `
            <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(item)}
          `
    }
    return html
  })
}

// thieving
function dropThievingHtml (ctx) {
  ctx.patch(Thieving, 'formatSpecialDrop').replace(function (o, item, qty) {
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
            <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${item.sellsFor.quantity}
          `
      }
      if (settingStorage.qty) {
        html += `
            <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(item)}
          `
      }
    }
    return html
  })
  ctx.patch(Thieving, 'fireNPCDropsModal').replace(function (o, area, npc) {
    const settingStorage = window.settingStorage
    const sortedTable = npc.lootTable.sortedDropsArray;
    let html = '<span class="text-dark">';
    npc.currencyDrops.forEach(({
      currency,
      quantity
    }) => {
      const {
        min,
        max
      } = this.getNPCCurrencyRange(npc, currency, quantity);
      html += `<small><img class="skill-icon-xs mr-2" src="${currency.media}"> ${currency.formatAmount(`${formatNumber(min)}-${formatNumber(max)}`)}</small><br>`;
    });
    html += `${getLangString('THIEVING_POSSIBLE_COMMON')}<br><small>`;
    if (sortedTable.length) {
      html += `${getLangString('THIEVING_MOST_TO_LEAST_COMMON')}<br>`;
      const totalWeight = npc.lootTable.weight;
      html += sortedTable.map(({
        item,
        weight,
        minQuantity,
        maxQuantity
      }) => {
        let text = `${maxQuantity > minQuantity ? `${minQuantity}-` : ''}${maxQuantity} x <img class="skill-icon-xs mr-2" src="${item.media}">${item.name}`;
        text += ` (${((100 * weight) / totalWeight).toFixed(2)}%)`;
        if (settingStorage.lock) {
          text += `
            ${game.stats.Items.get(item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
          `
        }
        if (settingStorage.gp) {
          text += `
            <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${item.sellsFor.quantity}
          `
        }
        if (settingStorage.qty) {
          text += `
            <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(item)}
          `
        }
        return text;
      }).join('<br>');
      if (DEBUGENABLED) {
        html += `<br>Average Value: `;
        const averageDropValue = npc.lootTable.getAverageDropValue();
        averageDropValue.forEach((quantity, currency) => {
          html += `<br>${quantity.toFixed(2)} ${currency.name}`;
        });
      }
    } else {
      html += getLangString('THIEVING_NO_COMMON_DROPS');
    }
    html += `</small><br>`;
    html += `${getLangString('THIEVING_POSSIBLE_RARE')}<br><small>`;
    const generalRareHTML = [];
    this.generalRareItems.forEach((drop) => {
      if (this.isCorrectRealmForGeneralRareDrop(drop, npc.realm) && (drop.npcs === undefined || drop.npcs.has(npc)))
        generalRareHTML.push(this.formatSpecialDrop(drop.item));
    });
    html += generalRareHTML.join('<br>');
    html += `</small><br>`;
    if (area.uniqueDrops.length) {
      html += `${getLangString('THIEVING_POSSIBLE_AREA_UNIQUE')}<br><small>`;
      html += area.uniqueDrops.map((drop) => this.formatSpecialDrop(drop.item, drop.quantity)).join('<br>');
      html += '</small><br>';
    }
    if (npc.uniqueDrop !== undefined) {
      html += `${getLangString('THIEVING_POSSIBLE_NPC_UNIQUE')}<br><small>${this.formatSpecialDrop(npc.uniqueDrop.item, npc.uniqueDrop.quantity)}</small>`;
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
  ctx.patch(CombatAreaMenuElement, "setArea").replace(function (o, areaData) {
    o(areaData)
    if (areaData.pet) {
      const pet = areaData.pet.pet
      this.areaName.innerHTML = `${this.areaName.innerHTML}
      <small id="x-manger-${pet.id}">
        <img class="skill-icon-xs mr-1 ml-2" src="${pet.media}">
        (${(100 / areaData.pet.weight).toFixed(2)}%)
      </small>`
    }
  })

  const creatPetCheck = (pet) => {
    const petDiv = document.getElementById(`x-manger-${pet.id}`)
    if (petDiv) {
      if (petDiv.lastChild.tagName === 'I') {
        petDiv.removeChild(petDiv.lastChild)
      }
      const iDiv = createElement('i', {
        classList: ['text-success', 'fa', 'fa-check-circle']
      });
      petDiv.appendChild(iDiv);
    }
  }

  ctx.patch(PetManager, "unlockPet").replace(function (o, pet) {
    creatPetCheck(pet)
    return o(pet)
  })
}

function dropPetInterfaceHtml () {
  // 初始化战斗地下城宠物信息
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

  game.combatAreaCategories.allObjects.forEach(v => {
    renderPet(v.areas)
  })
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
export function drop (ctx) {
  ctx.patch(CombatManager, 'getMonsterDropsHTML').replace(function (o, monster, respectArea) {
    let drops = ''
    if (monster.lootChance > 0 && monster.lootTable.size > 0 && !(respectArea && this.areaType === CombatAreaType.Dungeon)) {
      drops = monster.lootTable.sortedDropsArray.map((drop) => {
        let dropText = templateLangString('BANK_STRING', '40', {
          qty: `${drop.maxQuantity}`,
          itemImage: `<img class="skill-icon-xs mr-2" src="${drop.item.media}">`,
          itemName: drop.item.name
        })
        dropText += ` (${((monster.lootChance * drop.weight) / monster.lootTable.weight).toFixed(2)}%)
          ${game.stats.Items.get(drop.item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
          <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${drop.item.sellsFor}
          <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(drop.item)}
        `
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

  // items
  function viewItemContents (item) {
    const dropsOrdered = item.dropTable.sortedDropsArray;
    const drops = dropsOrdered.map((drop) => {
      let dropText = templateString(getLangString('BANK_STRING', '40'), {
        qty: `${numberWithCommas(drop.maxQuantity)}`,
        itemImage: `<img class="skill-icon-xs mr-2" src="${drop.item.media}">`,
        itemName: drop.item.name,
      });
      dropText += ` (${((100 * drop.weight) / item.dropTable.totalWeight).toFixed(2)}%)
          ${game.stats.Items.get(drop.item, ItemStats.TimesFound) > 0 ? '<i class="text-success fa fa-check-circle mr-1"></i>' : '<i style="color: #e56767;" class="fa fa-fw fa-times mr-1"></i>'}
          <img class="skill-icon-xxs mr-1" src="${cdnMedia('assets/media/main/coins.svg')}">${drop.item.sellsFor}
          <img class="mr-1" width="10" src="${cdnMedia('assets/media/main/bank_header.svg')}">${game.bank.getQty(drop.item)}
          `
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
  window.viewItemContents = viewItemContents
}


export function dropPetHtml (ctx) {
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

export function dropPetInterfaceHtml () {
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
// Contenedor principal de tarjetas/cards

let cardContainer = document.getElementById('pkmnContainer')

async function returnPkmn(num) {
    let pkmnData = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`)).json()
    return pkmnData
}
async function returnPkmnv2() {
    let pkmnData = await (await fetch('https://pokeapi.co/api/v2/pokemon/2')).json()
    console.log(pkmnData)
}
async function renderPkmns(num, cb) {
    let pkmnData = await cb(num)
    let pkmnCard = document.createElement('div');
    pkmnCard.setAttribute('name', pkmnData.order)
    pkmnCard.setAttribute('id', pkmnData.order)
    pkmnCard.className = 'card d-flex flex-column align-items-center p-2'
    pkmnCard.innerHTML = `
                        <div class="card__mainInfo d-flex flex-row align-items-center justify-content-between">
                            <p class="card__name">${pkmnData.name}</p>
                            <p class="card__id">#000</p>
                        </div>
                        <img src="${pkmnData.sprites.front_default}" alt="Imagen de Pkmn" class="card__img">
                        `
    let pkmnTypes = document.createElement('div');
    pkmnTypes.className = 'card__types d-flex flex-row align-items-center justify-content-evenly'
    pkmnTypes.setAttribute('id', 'cardTypes')
    pkmnData.types.forEach( elem => {
        let type = document.createElement('p')
        let bgColor = elem.type.name
        type.style.background = `var(--${bgColor})`
        type.innerHTML = elem.type.name
        pkmnTypes.append(type)
    })
    pkmnCard.append(pkmnTypes)
    cardContainer.append(pkmnCard)
}

renderPkmns(1, returnPkmn)

returnPkmnv2()
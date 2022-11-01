// Contenedor principal de tarjetas/cards
let cardContainer = document.getElementById('pkmnContainer')

async function returnPkmn(num) {
    try {
        let pkmnData = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`)).json()
        return pkmnData
    }catch(err){
        console.log('Se ha generado un error ', err)
    }
}
async function returnPkmnForData() {
    let pkmnData = await (await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=900')).json()
    // console.log(pkmnData)
    let pkmnAll = []
    pkmnData.results.forEach(elem => {
        pkmnAll.push(elem.name)
    })
    return pkmnAll
}
async function renderPkmns(num) {
    let pkmnData = await returnPkmn(num)
    let pkmnCard = document.createElement('div');
    pkmnCard.setAttribute('name', pkmnData.id)
    pkmnCard.setAttribute('id', pkmnData.id)
    // pkmnCard.setAttribute('onclick', renderOnModal)
    pkmnCard.setAttribute('data-bs-toggle', 'modal')
    pkmnCard.setAttribute('data-bs-target', '#renderModalView')
    pkmnCard.className = 'card d-flex flex-column align-items-center p-2'
    pkmnCard.innerHTML = `
                        <div class="card__mainInfo d-flex flex-row align-items-center justify-content-between">
                            <p class="card__name">${pkmnData.name}</p>
                            <p class="card__id">#000</p>
                        </div>
                        <img src="${pkmnData.sprites.front_default}" alt="Imagen de Pkmn" class="card__img" onclick='renderOnModal(event)'>
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

renderPkmns(25)

// onkeypressSearch
// Filtrado y renderizado de tarjetas pkmn
async function onkeypressSearch(e) {
    cardContainer.innerHTML = ''
    let pkmnNamesAll = await returnPkmnForData()
    let filterNames = pkmnNamesAll.filter((elem, index) => {
        return elem.startsWith(e.target.value)
    })
    if(e.target.value !== ''){
        pkmnNamesAll.forEach((elem, index) => {
            if(elem.startsWith(e.target.value)){
                renderPkmns(index + 1)
            }
        })
    }else{
        cardContainer.innerHTML = ''
    }
    // console.log(filterNames)
}


// Render y configuracion sobre el Modal
let modal__pkmnName = document.getElementById('modal__pkmnName')
let modal__pkmnGeneralInfo = document.getElementById('modal__pkmnGeneralInfo')
let renderOnModal = async (e) => {
    let pkmnData = await returnPkmn(e.target.parentElement.id)
    modal__pkmnName.innerHTML = `${pkmnData.name}`
    modal__pkmnGeneralInfo.innerHTML = `<img src='${pkmnData.sprites.front_default}'/>`
}


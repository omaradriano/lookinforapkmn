// Contenedor principal de tarjetas/cards
let cardContainer = document.getElementById('pkmnContainer')

async function returnPkmn(num = '') {
    try {
        let pkmnData = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`)).json()
        console.log(pkmnData)
        return pkmnData
    } catch (err) {
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
    pkmnCard.setAttribute('data-bs-toggle', 'modal')
    pkmnCard.setAttribute('data-bs-target', '#renderModalView')
    pkmnCard.className = 'card d-flex flex-column align-items-center p-2'
    pkmnCard.innerHTML = `
                        <div class="card__mainInfo d-flex flex-row align-items-center justify-content-between">
                            <p class="card__name">${pkmnData.name}</p>
                            <p class="card__id">#${changeIDVisually(pkmnData.id)}</p>
                        </div>
                        <img src="${pkmnData.sprites.front_default}" alt="Imagen de Pkmn" class="card__img" onclick='renderOnModal(event)'>
                        `
    let pkmnTypes = document.createElement('div');
    pkmnTypes.className = 'card__types d-flex flex-row align-items-center justify-content-evenly'
    pkmnTypes.setAttribute('id', 'cardTypes')
    pkmnData.types.forEach(elem => {
        let type = document.createElement('p')
        let bgColor = elem.type.name
        type.style.background = `var(--${bgColor})`
        type.innerHTML = elem.type.name
        pkmnTypes.append(type)
    })
    pkmnCard.append(pkmnTypes)
    cardContainer.append(pkmnCard)
}

// Modificar ID visualmente
function changeIDVisually(id){
    let coercedId = ''+id
    switch (coercedId.length) {
        case 1:
            return `00${coercedId}`
        case 2:
            return `0${coercedId}`
        case 3:
            return `${coercedId}`
    }
}

renderPkmns(25)
// returnPkmn()
// onkeypressSearch
// Filtrado y renderizado de tarjetas pkmn
async function onkeypressSearch(e) {
    cardContainer.innerHTML = ''
    let pkmnNamesAll = await returnPkmnForData()
    let filterNames = pkmnNamesAll.filter((elem, index) => {
        return elem.startsWith(e.target.value)
    })
    if (e.target.value !== '') {
        pkmnNamesAll.forEach((elem, index) => {
            if (elem.startsWith(e.target.value)) {
                renderPkmns(index + 1)
            }
        })
    } else {
        cardContainer.innerHTML = ''
    }
    // console.log(filterNames)
}

// Render y configuracion sobre el Modal
let modal__pkmnName = document.getElementById('modal__pkmnName')
// let modal__pkmnGeneralInfo = document.getElementById('modal__pkmnGeneralInfo')
let modal__pkmnId = document.getElementById('modal__pkmnId')
let modal__statsValues = document.getElementById('modal__statsValues') //Renderizar datos de stats en modal
let modal__types = document.getElementById('modal__types') //Renderizar tipos en el modal
let modal__img = document.getElementById('modal__img') //Renderizar imangen en modal
let physicalStats__height = document.getElementById('physicalStats__height') //Renderizar peso
let physicalStats__weight = document.getElementById('physicalStats__weight') //renderizar estatura
let left__name = document.getElementById('left__name')
let renderOnModal = async (e) => {
    let pkmnData = await returnPkmn(e.target.parentElement.id)
    left__name.innerHTML = 
                        `
                        <p id="modal__pkmnId">#${changeIDVisually(pkmnData.id)}</p>
                        `
    modal__pkmnName.innerHTML = `${pkmnData.name}` //Pone titulo al Modal con el nombre del Pkmn
    modal__statsValues.innerHTML = ''
    pkmnData.stats.forEach(elem => {
        let everyStat = document.createElement('div')
        everyStat.innerHTML = `<p>${elem.stat.name} <span class='bold'>${elem.base_stat}</span></p>
                                <div class="progress">
                                    <div class="progress-bar" role="progressbar" style="width: ${elem.base_stat}%;" aria-valuenow="${elem.base_stat}"
                                        aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                `
        modal__statsValues.append(everyStat)
    })
    modal__types.innerHTML = ''
    pkmnData.types.forEach(elem => {
        let type = document.createElement('img')
        let typeIcon = elem.type.name
        type.className = 'types__item'
        type.setAttribute('alt', `Type ${typeIcon}`)
        type.setAttribute('src', `./res/icons/${typeIcon}.png` )
        modal__types.append(type)
    })
    modal__img.setAttribute('src', pkmnData.sprites.front_default)
    modal__img.className = 'modal__img'
    physicalStats__height.innerHTML =
                                    `
                                    <p class='me-4'>${pkmnData.height / 10}<span class='bold'>m</span></p>
                                    <p>${((pkmnData.height*10)/30.48).toFixed(2)}<span class='bold'>inch</span></p>
                                    `
    physicalStats__weight.innerHTML =
                                    `
                                    <p class='me-4'>${pkmnData.weight / 10}<span class='bold'>kg</span></p>
                                    <p>${((pkmnData.weight/10)/.453).toFixed(2)}<span class='bold'>lb</span></p>
                                    `                               
}

// Intersection Observer

function* generatePkmnByScroll() {
    let index = 0
    while(index <= 900){
        yield index++
    }
}
let generate = generatePkmnByScroll()
let optionsOnScroll = {
    // root: cardContainer,
    rootMargin: '0px',
    threshold: 1
}
let renderOnScroll = new IntersectionObserver(cb, optionsOnScroll)

renderOnScroll.observe(cardContainer)

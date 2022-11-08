// Contenedor principal de tarjetas/cards
let cardContainer = document.getElementById('pkmnContainer')
let lastRenderedChild = null
let onTyping = true //Bandera para activar o desactivar scroll dependiendo si se escribe en onkeysearch o no

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

    lastRenderedChild = cardContainer.lastElementChild
    console.log('Last rendered')
    console.log(lastRenderedChild)
    observer.observe(lastRenderedChild)
}

// Modificar ID visualmente
//Renderiza el numero del PKMN dependiendo de la cantidad de caracteres que tenga el numero | EJ #1: agrega dos ceros al principio
function changeIDVisually(id) {
    let coercedId = '' + id
    switch (coercedId.length) {
        case 1:
            return `00${coercedId}`
        case 2:
            return `0${coercedId}`
        case 3:
            return `${coercedId}`
    }
}
// onkeypressSearch
// Filtrado y renderizado de tarjetas pkmn
async function onkeypressSearch(e) {
    // observer.unobserve()
    cardContainer.innerHTML = ''
    console.log(e.target.value)
    let pkmnNamesAll = await returnPkmnForData()
    const searchText = e.target.value.toLowerCase()

    if (searchText === '') {
        onTyping = true //re activa el scroll infinito
        cardContainer.innerHTML = ''
        idGenerator() //Reinicia el generador en caso de que se borren los datos
        renderFirst() //Vuelve a generar los primeros 5 cards
        return
    }

    pkmnNamesAll.forEach((elem, index) => {
        onTyping = false //Se desactiva el estado de scroll infinito
        if (elem.startsWith(searchText)) {
            renderPkmns(index + 1)
        }
    })
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
    e.stopImmediatePropagation()
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
        type.setAttribute('src', `./res/icons/${typeIcon}.png`)
        modal__types.append(type)
    })
    modal__img.setAttribute('src', pkmnData.sprites.front_default)
    modal__img.className = 'modal__img'
    physicalStats__height.innerHTML =
        `
                                    <p class='me-4'>${pkmnData.height / 10}<span class='bold'>m</span></p>
                                    <p>${((pkmnData.height * 10) / 30.48).toFixed(2)}<span class='bold'>inch</span></p>
                                    `
    physicalStats__weight.innerHTML =
        `
                                    <p class='me-4'>${pkmnData.weight / 10}<span class='bold'>kg</span></p>
                                    <p>${((pkmnData.weight / 10) / .453).toFixed(2)}<span class='bold'>lb</span></p>
                                    `
}

// Generador con la primera iteracion

function* idGenerator(start = 6) {
    while (start <= 900) {
        yield start++
    }
}
let generate = idGenerator()

// IntersectionObserver
const options = {
    root: cardContainer,
    marginRoot: '200px',
    threshold: 0.2
}
// let stateDown = null 
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(elem => {
        // console.log(observer)
        if(elem.isIntersecting && (elem.target === lastRenderedChild) && onTyping){
            //Primer validador: si el elemento entra en el root(cardContainer)
            //Segundo validador: verifica que sea el ultimo elemento el que se observe
            //Tercer validador: Verifica el estado si hay una busqueda en onkeypress para no generar incongruencia
            renderPkmns(generate.next().value)
        }
    })
}, options)
 
//El siguiente codigo no es necesario pero igual lo dejo por si acaso, solo recuerda usar la bandera stateDown despues

// let lastPosition = 0;
// cardContainer.addEventListener('scroll', function () {
//     if (cardContainer.scrollTop > lastPosition) {
//         lastPosition = cardContainer.scrollTop
//         stateDown = true
//     } else {
//         lastPosition = cardContainer.scrollTop
//         stateDown = false
//     }

// });

//Esto va a ejecutar cuando la pagina se cargue por primera vez
let renderFirst = () => {
    for (let i = 1; i <= 5; i++) {
        renderPkmns(i)

    }
}
window.onload = renderFirst()




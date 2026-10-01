const pokeName  = []
let pokemonList = []
let currentPoke = JSON.parse(sessionStorage.getItem('currentPoke')) || 1
let limit = 50

if(currentPoke > limit)currentPoke = 1

const next = document.getElementById('next')
const prev = document.getElementById('prev')
const pokeList = document.getElementById('poke-list')
const hero = document.getElementById('hero')

//save currentPoke
function savePoke(){
    sessionStorage.setItem('currentPoke', JSON.stringify(currentPoke))
}

//Fetching data

function transformPokemon(pokemon) {
    return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.front_default,
        height: pokemon.height,
        weight: pokemon.weight
  };
}

async function fetchData(url) {
    return await fetch(url).then(response => response.json()).then(data => transformPokemon(data))
}

async function getPokeData() {
    await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
    .then(response => response.json())
    .then(data => {data.results.forEach(pokemon => {pokeName.push(pokemon)})})
    pokemonList = await Promise.all(pokeName.map(poke => fetchData(poke.url)))
}


//render
function renderList () {
    pokeList.innerHTML = pokemonList.map(poke => {
        let id = String(poke.id)
        while(id.length < 4){id = 0 + id}
        return /*html*/`<li id='${poke.name}' class='pokemon hover:bg-slate-200 bg-[url(${poke.image})] bg-right bg-size-[30%] bg-no-repeat cursor-pointer'>
            <span>${id}: </span><span>${poke.name}</span>
        </li>`;
    }).join('')
}

function renderHero(){
    const pokemon = pokemonList.find(a => a.id == currentPoke)
    let id = String(pokemon.id);
    while(id.length < 4){id = 0 + id}
            hero.innerHTML = `
                    <div class="flex flex-1 flex-col justify-center">
                        <p id="poke-id" class="font-semibold text-slate-500">#${id}</p>
                        <h2 id="poke-name" class="my-4 text-5xl font-bold capitalize">${pokemon.name}</h2>
                        <span class ='flex w-full gap-4'>
                            <p class='font-semibold'>Height: ${pokemon.height}</p>
                            <p class='font-semibold'>Weight: ${pokemon.weight}</p>
                        </span>
                    </div>
                    <img
                        id="poke-image"
                        class="my-auto h-100 w-auto object-contain sm:h-84 sm:w-84"
                        src="${pokemon.image}"
                        alt="${pokemon.name}"
                    />
    `
    document.querySelectorAll('#poke-list .pokemon').forEach(item => {item.classList.toggle('bg-slate-400', item.id === pokemon.name)})
    savePoke()
}

function prevVisible(){
    prev.classList.toggle('hidden', currentPoke <= 1)
    next.classList.toggle('hidden', currentPoke >= limit)
}

//eventListeners
prev.addEventListener('click', () => {--currentPoke; prevVisible(); renderHero()})
next.addEventListener('click', () => {++currentPoke; prevVisible(); renderHero()})
pokeList.addEventListener('click', (event) => {
    const item = event.target.closest('li.pokemon')
    if (!item || !pokeList.contains(item)) return
    currentPoke = pokemonList.find(a => a.name == item.id).id
    prevVisible()
    renderHero()
    })



async function init() {
    await getPokeData()
    await renderList()
    renderHero()
}

init()
prevVisible()
    

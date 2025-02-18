let pokedex = document.getElementById("pokedex");
let leftArrowTop = document.getElementById("leftArrowTop");
let rightArrowTop = document.getElementById("rightArrowTop");
let leftArrowBottom = document.getElementById("leftArrowBottom");
let rightArrowBottom = document.getElementById("rightArrowBottom");
let paginationTop = document.getElementById("paginationTop");
let paginationBottom = document.getElementById("paginationBottom");

let btnFilter = document.getElementById("btnFilter");
let filters = document.getElementById("filters");
let filterType = document.getElementById("filterType");
let filterGeneration = document.getElementById("filterGeneration");
let searchBar = document.getElementById("searchBar");

const typeTrad = {
	normal: "Normal",
	fire: "Feu",
	water: "Eau",
	electric: "Électrique",
	grass: "Plante",
	ice: "Glace",
	fighting: "Combat",
	poison: "Poison",
	ground: "Sol",
	flying: "Vol",
	psychic: "Psy",
	bug: "Insecte",
	rock: "Roche",
	ghost: "Spectre",
	dragon: "Dragon",
	dark: "Ténèbres",
	steel: "Acier",
	fairy: "Fée",
};

let allPokemon = []; // Liste complète des Pokémon
let allPokemonNamesFr = {}; // Stocke les noms FR des Pokémon
let allPokemonTypes = {}; // Stocke les types des Pokémon
let currentIndex = 0;
let currentPage = 0;
const limit = 50;
let filteredPokemon = [];

// Vérifier si les données sont déjà stockées
if (
	localStorage.getItem("allPokemon") &&
	localStorage.getItem("pokemonTypes")
) {
	console.log("🔄 Chargement des Pokémon depuis localStorage...");
	allPokemon = JSON.parse(localStorage.getItem("allPokemon"));
	allPokemonTypes = JSON.parse(localStorage.getItem("pokemonTypes"));
	afficherPokemon();
} else {
	console.log("📡 Récupération de tous les Pokémon...");

	// Récupérer la liste complète des Pokémon
	fetch("https://pokeapi.co/api/v2/pokemon?limit=1025")
		.then((response) => response.json())
		.then((data) => {
			allPokemon = data.results;
			localStorage.setItem("allPokemon", JSON.stringify(allPokemon));

			const typeList = Object.keys(typeTrad);
			let requests = typeList.map((type) =>
				fetch(`https://pokeapi.co/api/v2/type/${type}`)
					.then((response) => response.json())
					.then((data) => {
						data.pokemon.forEach((p) => {
							let pokeName = p.pokemon.name;
							if (!allPokemonTypes[pokeName]) {
								allPokemonTypes[pokeName] = [];
							}
							allPokemonTypes[pokeName].push(typeTrad[type]);
						});
					})
			);

			Promise.all(requests).then(() => {
				localStorage.setItem("pokemonTypes", JSON.stringify(allPokemonTypes));
				console.log("✅ Données enregistrées !");
				afficherPokemon();
			});
		});
}

// Fonction pour afficher les Pokémon
function afficherPokemon() {
	pokedex.innerHTML = "";

	let selectedType = filterType.value;
	let selectedGen = filterGeneration.value;
	let searchQuery = searchBar.value.toLowerCase();

	// Appliquer les filtres
	filteredPokemon = allPokemon.filter((pokemon) => {
		let types = allPokemonTypes[pokemon.name] || ["Inconnu"];
		let matchType = selectedType === "all" || types.includes(selectedType);

		let pokemonId = parseInt(pokemon.url.split("/")[6]);
		let genRanges = {
			1: [1, 151],
			2: [152, 251],
			3: [252, 386],
			4: [387, 493],
			5: [494, 649],
			6: [650, 721],
			7: [722, 809],
			8: [810, 905],
			9: [906, 1025],
		};
		let matchGen =
			selectedGen === "all" ||
			(genRanges[selectedGen] &&
				pokemonId >= genRanges[selectedGen][0] &&
				pokemonId <= genRanges[selectedGen][1]);

		// 🔍 Vérifier si le nom correspond en FR ou EN
		let nomFr = allPokemonNamesFr[pokemon.name] || "";
		let matchName =
			pokemon.name.toLowerCase().includes(searchQuery) ||
			nomFr.toLowerCase().includes(searchQuery);

		return matchType && matchGen && matchName;
	});

	if (currentIndex >= filteredPokemon.length) {
		currentIndex = Math.max(0, filteredPokemon.length - limit);
		currentPage = Math.floor(currentIndex / limit);
	}

	let pokemonToShow = filteredPokemon.slice(currentIndex, currentIndex + limit);

	pokemonToShow.forEach((pokemon) => {
		let types = allPokemonTypes[pokemon.name] || ["Inconnu"];
		const card = document.createElement("div");
		card.classList.add("card");

		let pokemonId = pokemon.url.split("/")[6];
		let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

		let img = document.createElement("img");
		img.src = imageUrl;
		img.alt = `${pokemon.name} image`;
		card.appendChild(img);

		fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
			.then((response) => response.json())
			.then((data) => {
				const frenchName = data.names.find(
					(name) => name.language.name === "fr"
				);
				allPokemonNamesFr[pokemon.name] = frenchName.name; // Stocke le nom FR

				let nomPokemon = document.createElement("p");
				nomPokemon.innerText = frenchName.name + " / " + pokemon.name;

				let zoneType = document.createElement("div");
				zoneType.classList.add("zoneType");

				let type1 = document.createElement("span");
				type1.innerText = types[0];
				type1.classList.add(`type`, types[0]);
				zoneType.appendChild(type1);

				if (types[1]) {
					let type2 = document.createElement("span");
					type2.innerText = types[1];
					type2.classList.add(`type`, types[1]);
					zoneType.appendChild(type2);
				}

				card.appendChild(nomPokemon);
				card.appendChild(zoneType);
				pokedex.appendChild(card);
			});
	});

	pagination();
}

/* ************************************************************************** */
/* 																PageChanger																	*/
/* ************************************************************************** */

function next() {
	if (currentIndex + limit < filteredPokemon.length) {
		currentIndex += limit;
		currentPage++;
		afficherPokemon();
	}
}

function previous() {
	if (currentIndex >= limit) {
		currentIndex -= limit;
		currentPage--;
		afficherPokemon();
	}
}
leftArrowTop.addEventListener("click", previous);
rightArrowTop.addEventListener("click", next);
leftArrowBottom.addEventListener("click", previous);
rightArrowBottom.addEventListener("click", next);

/* ************************************************************************** */
/* 																Pagination																	*/
/* ************************************************************************** */
function pagination() {
	paginationTop.innerHTML = "";
	paginationBottom.innerHTML = "";

	const nbrPage = Math.ceil(filteredPokemon.length / limit);

	for (let i = 0; i < nbrPage; i++) {
		let page = document.createElement("button");
		page.innerText = i + 1;
		page.addEventListener("click", function () {
			jumpPage(i);
		});
		if (i == currentPage) {
			page.classList.add("current");
		}

		paginationTop.appendChild(page);

		let clonedPage = page.cloneNode(true);
		clonedPage.addEventListener("click", function () {
			jumpPage(i);
		});
		paginationBottom.append(clonedPage);
	}
}

function jumpPage(index) {
	currentIndex = limit * index;
	currentPage = index;
	afficherPokemon();
}

/* ************************************************************************** */
/* 																	Filtre																		*/
/* ************************************************************************** */
btnFilter.addEventListener("click", () => {
	filters.classList.toggle("hidden");
});

filterType.addEventListener("change", () => {
	currentIndex = 0;
	currentPage = 0;
	afficherPokemon();
});

filterGeneration.addEventListener("change", () => {
	currentIndex = 0;
	currentPage = 0;
	afficherPokemon();
});

// Ajouter les types au dropdown
Object.values(typeTrad).forEach((type) => {
	let option = document.createElement("option");
	option.value = type;
	option.innerText = type;
	filterType.appendChild(option);
});

searchBar.addEventListener("input", () => {
	currentIndex = 0;
	currentPage = 0;
	afficherPokemon();
});

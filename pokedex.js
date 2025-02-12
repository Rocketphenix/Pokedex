// let data = JSON.parse(localStorage.getItem("Pokemon"));

// let pokedex = document.getElementById("pokedex");

// if (!data) {
// 	fetch("https://pokeapi.co/api/v2/pokemon")
// 		.then((response) => response.json())
// 		.then((data) => {
// 			localStorage.setItem("Pokemon", JSON.stringify(data));
// 			showPokemon(data);
// 		})
// 		.catch((error) =>
// 			console.error("Erreur lors du chargement du JSON :", error)
// 		);

// 	// fetch("pokedex.json")
// 	// 	.then((response) => response.json())
// 	// 	.then((data) => showPokemon(data))
// 	// 	.catch((error) =>
// 	// 		console.error("Erreur lors du chargement du JSON :", error)
// 	// 	);
// } else {
// 	showPokemon(data);
// }

// function showPokemon(data) {
// 	console.log(data);

// 	// data.results.forEach((pokemon) => {
// 	// 	let card = document.createElement("div");
// 	// 	card.classList.add("card");

// 	// 	let imgPokemon = document.createElement("img");
// 	// 	imgPokemon.src = pokemon.img;
// 	// 	imgPokemon.alt = `Image ${pokemon.nom}`;

// 	// 	let nomPokemon = document.createElement("p");
// 	// 	nomPokemon.innerText = pokemon.name;

// 	// 	let zoneType = document.createElement("div");
// 	// 	zoneType.classList.add("zoneType");

// 	// 	let type1 = document.createElement("span");
// 	// 	type1.innerText = pokemon.type1Fr;
// 	// 	type1.classList.add(`type`);
// 	// 	type1.classList.add(`type-${pokemon.type1Fr}`);
// 	// 	zoneType.appendChild(type1);

// 	// 	if (pokemon.type2Fr != "") {
// 	// 		let type2 = document.createElement("span");
// 	// 		type2.innerText = pokemon.type2Fr;
// 	// 		type2.classList.add(`type`);
// 	// 		type2.classList.add(`type-${pokemon.type2Fr}`);
// 	// 		zoneType.appendChild(type2);
// 	// 	}

// 	// 	card.appendChild(imgPokemon);
// 	// 	card.appendChild(nomPokemon);
// 	// 	card.appendChild(zoneType);

// 	// 	pokedex.appendChild(card);
// 	// });
// }

let pokedex = document.getElementById("pokedex");
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

let allPokemonTypes = {}; // Objet pour stocker les types
let pokemonData = []; // Objet pour stocker les Pokémon

// Vérifier si les données sont déjà dans le localStorage
if (
	localStorage.getItem("pokemonTypes") &&
	localStorage.getItem("pokemonData")
) {
	console.log("🔄 Chargement des types et Pokémon depuis localStorage...");
	allPokemonTypes = JSON.parse(localStorage.getItem("pokemonTypes"));
	pokemonData = JSON.parse(localStorage.getItem("pokemonData"));
	afficherPokemon(); // Afficher les Pokémon sans refaire les requêtes
} else {
	console.log("📡 Récupération des types et Pokémon depuis l'API...");
	const typeList = [
		"normal",
		"fire",
		"water",
		"electric",
		"grass",
		"ice",
		"fighting",
		"poison",
		"ground",
		"flying",
		"psychic",
		"bug",
		"rock",
		"ghost",
		"dragon",
		"dark",
		"steel",
		"fairy",
	];

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

	// Récupérer la liste des 32 premiers Pokémon
	fetch("https://pokeapi.co/api/v2/pokemon?limit=35")
		.then((response) => response.json())
		.then((data) => {
			pokemonData = data.results; // Stocke la liste des Pokémon

			// Stocker les données dans localStorage après avoir récupéré les types et Pokémon
			Promise.all(requests).then(() => {
				console.log("✅ Types et Pokémon enregistrés dans le localStorage !");
				localStorage.setItem("pokemonTypes", JSON.stringify(allPokemonTypes));
				localStorage.setItem("pokemonData", JSON.stringify(pokemonData));
				afficherPokemon(); // Afficher les Pokémon après stockage
			});
		});
}

// Fonction pour afficher les Pokémon
function afficherPokemon() {
	pokedex.innerHTML = ""; // On vide la liste avant d'ajouter les Pokémon

	// Trier les Pokémon par ID (récupéré de l'URL)
	pokemonData.sort((a, b) => {
		const idA = parseInt(a.url.split("/")[6]);
		const idB = parseInt(b.url.split("/")[6]);
		return idA - idB; // Tri par ID croissant
	});

	pokemonData.forEach((pokemon) => {
		let types = allPokemonTypes[pokemon.name] || ["Inconnu"];
		const card = document.createElement("div");
		card.classList.add("card");

		// Récupérer l'ID du Pokémon depuis l'URL
		const pokemonId = pokemon.url.split("/")[6];

		// Construire l'URL de l'image du Pokémon
		const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

		// Créer l'élément image
		const img = document.createElement("img");
		img.src = imageUrl;
		img.alt = `${pokemon.name} image`;
		img.style.width = "100px"; // Vous pouvez ajuster cette valeur
		img.style.height = "100px"; // Vous pouvez ajuster cette valeur
		img.style.objectFit = "contain"; // Assurer les bonnes proportions
		card.appendChild(img); // Ajouter l'image avant le nom

		// Récupérer le nom en français
		fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
			.then((response) => response.json())
			.then((data) => {
				// Rechercher la traduction en français
				const frenchName = data.names.find(
					(name) => name.language.name === "fr"
				);

				// Créer l'élément pour le nom
				let nomPokemon = document.createElement("p");
				nomPokemon.innerText = frenchName
					? frenchName.name
					: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

				let zoneType = document.createElement("div");
				zoneType.classList.add("zoneType");

				let type1 = document.createElement("span");
				type1.innerText = types[0];
				type1.classList.add(`type`);
				type1.classList.add(`type-${types[0]}`);
				zoneType.appendChild(type1);

				if (types[1]) {
					let type2 = document.createElement("span");
					type2.innerText = types[1];
					type2.classList.add(`type`);
					type2.classList.add(`type-${types[1]}`);
					zoneType.appendChild(type2);
				}

				card.appendChild(nomPokemon);
				card.appendChild(zoneType);

				// Ajouter l'élément card à la liste
				pokedex.appendChild(card);
			});
	});
}

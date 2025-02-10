let pokedex = document.getElementById("pokedex");

fetch("pokedex.json")
	.then((response) => response.json())
	.then((data) => showPokemon(data))
	.catch((error) =>
		console.error("Erreur lors du chargement du JSON :", error)
	);

function showPokemon(data) {
	console.log(data); // Affiche les objets dans la console
	data.forEach((pokemon) => {
		let card = document.createElement("div");
		card.classList.add("card");

		let imgPokemon = document.createElement("img");
		imgPokemon.src = pokemon.img;
		imgPokemon.alt = `Image ${pokemon.nom}`;

		let nomPokemon = document.createElement("p");
		nomPokemon.innerText = pokemon.nom;

		let zoneType = document.createElement("div");
		zoneType.classList.add("zoneType");

		let type1 = document.createElement("span");
		type1.innerText = pokemon.type1Fr;
		type1.classList.add(`type`);
		type1.classList.add(`type-${pokemon.type1Fr}`);
		zoneType.appendChild(type1);

		if (pokemon.type2Fr != "") {
			let type2 = document.createElement("span");
			type2.innerText = pokemon.type2Fr;
			type2.classList.add(`type`);
			type2.classList.add(`type-${pokemon.type2Fr}`);
			zoneType.appendChild(type2);
		}

		card.appendChild(imgPokemon);
		card.appendChild(nomPokemon);
		card.appendChild(zoneType);

		pokedex.appendChild(card);
	});
}

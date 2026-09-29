import * as pokeApi from "./pokeApi/api.js"
import "./node_modules/bootstrap/dist/js/bootstrap.min.js";


window.addEventListener("load", async function(){

    let inputName = document.querySelectorAll("#pokemon-name");

    let loadBar = document.getElementById("Load-bar");

    let form1 = document.getElementById("form1");

    let pokemonList = document.getElementById("pokemon-list");

    let modalTitle = document.getElementById("pokemon-modal-title");
    let modalBody = document.getElementById("pokemon-modal-body");
    let modal = new bootstrap.Modal(document.getElementById("pokemon-modal"));


    let showLoadBar = function(){
        loadBar.classList.remove("d-none");
    }

    let hideLoadBar = function(){
        loadBar.classList.add("d-none");
    }

    let getTypes = function(pokemon){
        let types = [];
        for (let i = 0; i < pokemon.types.length; i++) {
            types.push(pokemon.types[i].type.name);
        }
        return types.join(", ");
    }

    let getAbilities = function(pokemon){
        let abilities = [];
        for (let i = 0; i < pokemon.abilities.length; i++) {
            abilities.push(pokemon.abilities[i].ability.name);
        }
        return abilities.join(", ");
    }

    let showModal = function(pokemon){
        modalTitle.textContent = "#" + pokemon.id + " " + pokemon.name;

        modalBody.innerHTML =
            "<img src='" + pokemon.sprites.front_default + "' alt='" + pokemon.name + "' class='d-block mx-auto'>" +
            "<p><strong>Altura:</strong> " + (pokemon.height / 10) + " m</p>" +
            "<p><strong>Peso:</strong> " + (pokemon.weight / 10) + " kg</p>" +
            "<p><strong>Tipos:</strong> " + getTypes(pokemon) + "</p>" +
            "<p><strong>Habilidades:</strong> " + getAbilities(pokemon) + "</p>";

        modal.show();
    }

    let addCard = function(pokemon){
        let col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-3";

        col.innerHTML =
            "<div class='card h-100 text-center pokemon-card'>" +
                "<img src='" + pokemon.sprites.front_default + "' class='card-img-top' alt='" + pokemon.name + "'>" +
                "<div class='card-body'>" +
                    "<p class='text-muted mb-1'>#" + pokemon.id + "</p>" +
                    "<h5 class='card-title'>" + pokemon.name + "</h5>" +
                    "<p class='card-text'>" + getTypes(pokemon) + "</p>" +
                "</div>" +
            "</div>";

        col.addEventListener("click", function(){
            showModal(pokemon);
        });

        pokemonList.appendChild(col);
    }


    form1.addEventListener("submit", async function($e){
        $e.preventDefault();

        let formData = new FormData(this);
        let pokemonNumber = formData.get("pokedex-number");

        showLoadBar();

        try {
            let pokemonData = await pokeApi.getPokemonById(pokemonNumber);

            inputName[0].value=pokemonData.name;

            showModal(pokemonData);
        } catch (error) {
            inputName[0].value = "No encontrado";
        }

        hideLoadBar();
    });


    showLoadBar();

    try {
        let allPokemons = await pokeApi.getAllPokemons();

        for (let i = 0; i < allPokemons.results.length; i++) {
            let pokemon = await pokeApi.getPokemonById(allPokemons.results[i].name);
            addCard(pokemon);
        }
    } catch (error) {
        pokemonList.innerHTML = "<p>Error al cargar los pokemon</p>";
    }

    hideLoadBar();

});

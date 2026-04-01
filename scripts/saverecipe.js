const apikey2 = "";
const useAPI = false;
// const useAPI = true;

document.addEventListener('DOMContentLoaded', () => {
    let recipeCSV = getSavedAndConvertToCSVFromLocalStorage();

    if (recipeCSV && useAPI) {
        buildAllCards(recipeCSV);
    }
});

async function callApi2(link) {
    let resp = await fetch(link);
    let data = await resp.json();
    // let formatted = JSON.stringify(data, null, 2);
    console.log("call performed");
    return data;
}

async function buildAllCards(ingredients) {
    let link = `https://api.spoonacular.com/recipes/informationBulk?ids=${ingredients}&includeNutrition=false${apikey2}`;
    let data = await callApi2(link);

    let recipes = [];
    for (let i = 0; i < data.length; i++) {
        recipes.push(data[i].id);
    }

    let metadata = getMetadataFromDict2(data);

    for (let i = 0; i < metadata.length; i++) {
        buildSavedRecipeCard(metadata[i]);
    }

    // for recipe in recipe, i need to use an api to get 
    // the recipe data, then build the card with the data 
    // so im going to have to copy over the buildRecipeCard and mod
    // it, also copy over the build link api function 

    console.log("DONE :)");
}

function getMetadataFromDict2(data, number = -1) {
    let recipes = [];

    if (number == -1) {
        number = data.length;
    }

    for (let i = 0; i < number; i++) {
        let entry = {};
        console.log(data[i]);
        entry.title = data[i].title;
        entry.image = data[i].image;
        entry.id = data[i].id;
        entry.link = data[i].sourceUrl;
        recipes.push(entry);
    }
    return recipes;
}


function buildSavedRecipeCard(recipe) {

    let container = document.getElementById('main-container');

    // main container
    let card = document.createElement('div');
    card.classList = "recipe-card";

    // save / favorite button
    let favbtn = document.createElement('button');
    favbtn.classList = "toggle-save-button delete-button";
    let btnimg = document.createElement('img');
    btnimg.src = "images/trash.png";
    btnimg.alt = "Delete Recipe";
    btnimg.id = recipe.id;
    btnimg.classList = "toggle-save-button-image";
    addRemoveButtonFunctionality(favbtn);
    favbtn.appendChild(btnimg);

    // recipe title & link
    let link = document.createElement('a');
    link.classList = "recipe-link";
    link.href = recipe.link;
    link.innerText = recipe.title;

    // picture of recipe
    let mainimgbtn = document.createElement('button');
    mainimgbtn.classList = "recipe-card-image-button";
    let img = document.createElement('img');
    img.classList = "recipe-card-image";
    img.src = recipe.image;
    mainimgbtn.appendChild(img);

    card.appendChild(favbtn);
    card.appendChild(link);
    card.appendChild(mainimgbtn);

    container.appendChild(card);
}

function getSavedAndConvertToCSVFromLocalStorage() {
    let savedRecipes = localStorage.getItem('savedRecipes');

    if (savedRecipes) {
        savedRecipes = JSON.parse(savedRecipes);
    } else {
        savedRecipes = [];
    }

    let csv = savedRecipes.join(',');


    if (csv) {
        return csv;
    } else {
        return '';
    }
}

// yucky duplicated code 
function addRemoveButtonFunctionality(button) {
    button.addEventListener('click', async (event) => {

        let savedRecipes = localStorage.getItem('savedRecipes');
        if (savedRecipes) {
            savedRecipes = JSON.parse(savedRecipes);
        } else {
            savedRecipes = [];
        }

        // sorry if u read this
        let btnid;
        if (event.target.id) {
            btnid = event.target.id;
        } else if (event.currentTarget.id) {
            btnid = event.currentTarget.id;
        } else {
            btnid = button.id;
        }

        if (savedRecipes.includes(btnid)) {
            savedRecipes = savedRecipes.filter(recipe => recipe !== btnid);
            console.log('Recipe removed!');
            let btnparent = button.parentElement;
            btnparent.remove();
        } else {
            console.log('Recipe not found!');
        }

        // save the updated savedRecipes array to localStorage
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    });
}
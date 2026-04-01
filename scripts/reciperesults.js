// DEFAULTS 
const numSearch = 16; // number to search 
const ranking = 1; // 1 = maximize used ingredients, 2 = minimize missing ingredients
const ignorePantry = true; // ignore items such as salt, flour, etc
const apiKey = "";

// use this so i don't get charged by the api lol 
const APIACTIVE = false;
// const APIACTIVE = true;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const ingredients = params.get('ingredients'); // what was passed in from the search / pantry 

    // if there are ingredients, build the results page
    if (ingredients) {
        console.log(ingredients);
        if (APIACTIVE) {
            buildResultsPage(ingredients);
        }
    }
});

/**
 * Builds the results page based on the ingredients passed in
 */
async function buildResultsPage(ingredients) {
    // CALL NUMBER 1: Gets the recipes that match the ingredients the user wanted 
    let link = buildApiLinkRecipesFromIngredients(ingredients, numSearch, ranking, ignorePantry);
    let data = await performApiCall(link);

    // CALL NUMBER 2: Gets the metadata for the recipes that were found
    let recipes = getRecipeIDsFromDict(data);
    let spoonacularApiLink = buildApiLinkBulkRecipes(recipes);
    data = await performApiCall(spoonacularApiLink);

    console.log(data);

    // get the metadata for the recipes, so we can build our cards 
    let metadata = getMetadataFromDict(data);

    // build the cards for the recipes
    for (let i = 0; i < numSearch; i++) {
        console.log(metadata[i]);
        buildRecipeCard(metadata[i]);
    }
}

// FIXME: Might've been better to use a template for this
function buildRecipeCard(recipe) {

    let container = document.getElementById('main-container');

    // main container
    let card = document.createElement('div');
    card.classList = "recipe-card";

    // save / favorite button
    let favbtn = document.createElement('button');
    favbtn.classList = "toggle-save-button save-button";
    let btnimg = document.createElement('img');
    btnimg.src = "images/star.png";
    btnimg.alt = "Save Recipe";
    btnimg.id = recipe.id;
    btnimg.classList = "toggle-save-button-image";
    addSaveButtonFunctionality(favbtn);

    // get from local storage. if it doesn't exist, create an empty array
    let savedRecipes = localStorage.getItem('savedRecipes');
    if (savedRecipes) {
        savedRecipes = JSON.parse(savedRecipes);
    } else {
        savedRecipes = [];
    }

    // if the recipe is already saved, change the button image to a full star
    if (savedRecipes.includes(recipe.id.toString())) {
        btnimg.src = "images/star_full.png";
        console.log("HAS ALREADY");
    }

    favbtn.appendChild(btnimg);

    // recipe title & link
    let link = document.createElement('a');
    link.classList = "recipe-link";
    link.href = recipe.link;
    // link.innerText = "EX LINK TO RECIPE";
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

async function performApiCall(link, stringified = false) {
    let resp = await fetch(link);
    let data = await resp.json();
    let formatted = JSON.stringify(data, null, 2);
    if (stringified) {
        return formatted;
    }
    return data;
}

// FIXME: Building the API links two separate ways lol 
function buildApiLinkRecipesFromIngredients(ingredients, number, ranking, ignorePantry) {
    let apiLink = "https://api.spoonacular.com/recipes/findByIngredients?"
    let link = apiLink + "ingredients=" + ingredients + "&number=" + number + "&ranking=" + ranking + "&ignorePantry=" + ignorePantry + apiKey;
    return link;
}

function buildApiLinkBulkRecipes(ids) {
    let idstring = ids.join(',');
    let link = `https://api.spoonacular.com/recipes/informationBulk?ids=${idstring}&includeNutrition=false${apiKey}`;
    console.log(link);
    return link;
}

// used to get the ids of the recipes from the data returned by the first API call 
function getRecipeIDsFromDict(data) {
    let recipes = [];
    for (let i = 0; i < data.length; i++) {
        recipes.push(data[i].id);
    }
    return recipes;
}

// used to get the image, link, id, and title of a recipe
function getMetadataFromDict(data, number = -1) {
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

// yucky duplicated code 
function addSaveButtonFunctionality(button) {
    // if the button is already saved, change the button image to a full star
    // to indicate that it is saved

    // get from local storage. if it doesn't exist, create an empty array
    let savedRecipes = localStorage.getItem('savedRecipes');
    if (savedRecipes) {
        savedRecipes = JSON.parse(savedRecipes);
    } else {
        savedRecipes = [];
    }

    if (savedRecipes.includes(button.id) && button.classList.contains('save-button')) {
        let img = button.querySelector('img');

        if (img) {
            img.src = "images/star_full.png";
        }
    }

    button.addEventListener('click', async (event) => {

        // get from local storage. if it doesn't exist, create an empty array
        let savedRecipes = localStorage.getItem('savedRecipes');
        if (savedRecipes) {
            savedRecipes = JSON.parse(savedRecipes);
        } else {
            savedRecipes = [];
        }

        // this works since i set the id of the button to the recipe id

        let btnid;

        // sorry if u read this
        if (event.target.id !== "") {
            btnid = event.target.id;
        } else if (event.currentTarget.id !== "") {
            btnid = event.currentTarget.id;
        } else {
            btnid = -1;
        }

        if (!savedRecipes.includes(btnid)) {
            savedRecipes.push(btnid);
            console.log('Recipe saved!');
            let img = button.querySelector('img');
            img.src = "images/star_full.png";
        }
        // if it does exist, remove it
        else {
            savedRecipes = savedRecipes.filter(recipe => recipe !== btnid);
            console.log('Recipe removed!');
            let img = button.querySelector('img');
            img.src = "images/star.png";
        }
         
        console.log("DONE WITH THE SAVE BUTTON");

        // save the updated savedRecipes array to localStorage
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    });
}


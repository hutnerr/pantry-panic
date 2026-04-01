/**
 * This script is used when there exists a search bar whose purpose is to provide a list of ingredients to search for.
 * 
 * Should work as long as the document has a button with the id 'search-button' 
 * and an input with the id 'search-bar'.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    console.log("CONTENT LOADED");
    let inputs = document.getElementById('search-bar');

    document.getElementById('search-button').addEventListener('click', async (event) => {

        console.log("BUTTON CLICKED");
        event.preventDefault(); // prevent the form from submitting

        let ingredients = inputs.value; // get the value of the input field. space separated ingredients

        // complain if the input is empty
        if (ingredients == null || ingredients == "") {
            alert("Please enter ingredients");
            return;
        }

        // if the input is space separated, convert it to comma separated
        if (ingredients.includes(' ')) {
            ingredients = ingredients.split(' ').map(ingredient => ingredient.trim()).join(',');
        }

        // remove extra spaces after the commas
        ingredients = ingredients.split(',').map(ingredient => ingredient.trim()).join(',');

        window.location.href = `recipe_results.html?ingredients=${encodeURIComponent(ingredients)}`;
    });
});

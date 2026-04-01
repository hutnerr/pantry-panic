/**
 * This script is used when there exists a button whose purpose is to search using the local storage pantry.
 * 
 * Should work as long as the document has a button with the id 'pantry-search-button'.
 */
document.addEventListener('DOMContentLoaded', () => {
    let pantrySearchButton = document.getElementById('pantry-search-button');

    pantrySearchButton.addEventListener('click', async (event) => {

        // get the ingredients from the local storage
        let ingredients = localStorage.getItem('pantry');
        if (ingredients === '' || ingredients == null || !ingredients) {
            ingredients = '';
        }

        if (localStorage.getItem('pantry') === null || localStorage.getItem('pantry') === '') {
            alert('Your pantry is empty. Please add ingredients to your pantry.');
            return;
        }

        // if the input is space separated, convert it to comma separated
        if (ingredients.includes(' ')) {
            ingredients = ingredients.split(' ').map(ingredient => ingredient.trim()).join(',');
        }

        // remove extra spaces after the commas
        ingredients = ingredients.split(',').map(ingredient => ingredient.trim()).join(',');

        // redirect to the recipe results page with the ingredients as a query parameter
        window.location.href = `recipe_results.html?ingredients=${encodeURIComponent(ingredients)}`;
    });
});
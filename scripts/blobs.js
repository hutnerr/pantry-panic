document.addEventListener('DOMContentLoaded', () => {

    let exportBtn = document.getElementById('export-button');

    // save the recipes from local storage to a json file 
    exportBtn.addEventListener('click', () => {
        let data = JSON.stringify(localStorage.getItem('savedRecipes'));
        let blob = new Blob([data], { type: 'application/json' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'localStorage.json';
        a.click();
        URL.revokeObjectURL(url);
        console.log('Exported!');
    });

    let importBtn = document.getElementById('import-button');

    // import the recipes from a json file to local storage
    importBtn.addEventListener('click', () => {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.addEventListener('change', (event) => {
            let file = event.target.files[0];
            if (file) {
                let reader = new FileReader();
                reader.onload = (e) => {
                    let content = e.target.result;
                    localStorage.setItem('savedRecipes', JSON.parse(content));
                    console.log('Imported!');
                };
                reader.readAsText(file);
            }
            location.reload(); // so we can see the change 
        });
        input.click();
    });
});
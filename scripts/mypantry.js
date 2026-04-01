// Function to save checkbox states to localStorage
function saveCheckboxState() {
    const checkboxes = document.querySelectorAll('.pantry-search-submenu input[type="checkbox"]');
    const checkboxStates = {}; // Object to hold checkbox states

    checkboxes.forEach((checkbox) => {
        const label = checkbox.parentElement.textContent.trim(); // Get label text
        checkboxStates[label] = checkbox.checked; // Save state
    });

    // build the csv
    let csvContent = Object.entries(checkboxStates)
        .filter(([label, checked]) => checked)
        .map(([label]) => label)
        .join(',');

    console.log('CSV of checked ingredients:', csvContent); // Debugging log

    // Save to localStorage
    localStorage.setItem('pantry', csvContent);

    // localStorage.setItem('pantryStates', JSON.stringify(checkboxStates)); // Save to localStorage
    console.log('Pantry states saved:', checkboxStates); // Debugging log
    localStorage.setItem('pantryCheckboxes', JSON.stringify(checkboxStates)); // Save to localStorage
}

// Function to load checkbox states from localStorage
function loadCheckboxState() {
    const savedStates = JSON.parse(localStorage.getItem('pantryCheckboxes')) || {}; // Get saved states

    const checkboxes = document.querySelectorAll('.pantry-search-submenu input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        const label = checkbox.parentElement.textContent.trim(); // Get label text
        if (savedStates.hasOwnProperty(label)) {
            checkbox.checked = savedStates[label]; // Set checkbox state
        }
    });

    console.log('Pantry states loaded:', savedStates); // Debugging log
}

// Event listener to save state when a checkbox is toggled
document.querySelectorAll('.pantry-search-submenu input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', saveCheckboxState);
});

// Load saved states on page load
window.addEventListener('DOMContentLoaded', loadCheckboxState);

window.addEventListener('DOMContentLoaded', function() {
    // Load saved states on page load
    document.getElementById('saveBlobBtn').addEventListener('click', savePantryAsBlob);
    document.getElementById('loadBlobInput').addEventListener('change', loadPantryFromBlob);
    document.querySelectorAll('.pantry-search-submenu input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', saveCheckboxState);
    });
});



// Function to save pantry inputs as a Blob
function savePantryAsBlob() {
    const checkboxes = document.querySelectorAll('.pantry-search-submenu input[type="checkbox"]');
    const pantryData = {}; // Object to store pantry state

    checkboxes.forEach((checkbox) => {
        const label = checkbox.parentElement.textContent.trim(); // Get label text
        pantryData[label] = checkbox.checked; // Save state
    });

    const jsonBlob = new Blob([JSON.stringify(pantryData, null, 2)], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(jsonBlob);

    // Create a temporary download link
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'my_pantry.json';
    link.textContent = 'Download Pantry Data';
    document.body.appendChild(link);

    link.click(); // Trigger download
    document.body.removeChild(link); // Cleanup
    URL.revokeObjectURL(blobUrl); // Free up memory

    console.log('Pantry saved as blob:', pantryData); // Debugging log
}

// Function to load pantry data from a Blob
function loadPantryFromBlob(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const pantryData = JSON.parse(e.target.result); // Parse JSON data
            console.log('Pantry data loaded:', pantryData); // Debugging log

            // Update checkboxes based on loaded data
            const checkboxes = document.querySelectorAll('.pantry-search-submenu input[type="checkbox"]');
            checkboxes.forEach((checkbox) => {
                const label = checkbox.parentElement.textContent.trim(); // Get label text
                if (pantryData.hasOwnProperty(label)) {
                    checkbox.checked = pantryData[label];
                }
            });
        };

        reader.readAsText(file); // Read file content
    }
}


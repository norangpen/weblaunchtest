// Variable to store the position
let position = null;

// Function to set the position
function setPosition(value) {
    position = value;
}

// Function to get the position
function getPosition() {
    return position;
}

// Expose the functions to the global scope
window.setPosition = setPosition;
window.getPosition = getPosition;

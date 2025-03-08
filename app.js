// Initialize an empty array to store player stats
let playerStats = [];

// Function to display the player stats on the page
function displayStats() {
    const statsList = document.getElementById("stats-list");
    statsList.innerHTML = ""; // Clear previous stats
    
    playerStats.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("player");
        playerDiv.innerHTML = `
            <strong>${player.name}</strong> - Stat: ${player.stat} - Date: ${player.date}
        `;
        statsList.appendChild(playerDiv);
    });
}

// Handle the form submission to add new stats
const statsForm = document.getElementById("stats-form");
statsForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const playerName = document.getElementById("playerName").value;
    const statValue = document.getElementById("stat").value;
    
    if (playerName && statValue) {
        const newStat = {
            name: playerName,
            stat: statValue,
            date: new Date().toLocaleString()
        };
        
        // Add the new stat to the array
        playerStats.push(newStat);
        
        // Display the updated stats
        displayStats();
        
        // Clear the form fields
        statsForm.reset();
    }
});

// Initialize the page with any existing player stats
displayStats();

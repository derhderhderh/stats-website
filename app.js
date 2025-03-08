// Client ID from Google API Console
const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';

// Google Sheets API settings
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Your Google Sheet ID
const RANGE = 'Sheet1!A:C'; // Example range where player stats are stored

let playerStats = [];

// Load the Google API client
function loadGoogleAPI() {
    gapi.load('client:auth2', initialize);
}

// Initialize Google API client
function initialize() {
    gapi.client.init({
        apiKey: 'YOUR_API_KEY', // From Google API console
        clientId: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
    }).then(() => {
        console.log('Google API initialized.');
    });
}

// Handle form submission
const statsForm = document.getElementById('stats-form');
statsForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const playerName = document.getElementById('playerName').value;
    const statValue = document.getElementById('stat').value;
    
    if (playerName && statValue) {
        const newStat = {
            name: playerName,
            stat: statValue,
            date: new Date().toLocaleString()
        };
        
        // Save the stat to the Google Sheet
        saveStatToSheet(newStat);

        // Add to local display
        playerStats.push(newStat);
        displayStats();

        // Clear form
        statsForm.reset();
    }
});

// Save stat to Google Sheets
function saveStatToSheet(stat) {
    const params = {
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: 'RAW'
    };

    const values = [
        [stat.name, stat.stat, stat.date]
    ];

    const body = {
        values: values
    };

    const request = gapi.client.sheets.spreadsheets.values.append(params, body);
    request.then((response) => {
        console.log('Data saved:', response);
    }, (error) => {
        console.error('Error saving data:', error);
    });
}

// Display stats on the page
function displayStats() {
    const statsList = document.getElementById('stats-list');
    statsList.innerHTML = ''; // Clear previous stats

    playerStats.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        playerDiv.innerHTML = `
            <strong>${player.name}</strong> - Stat: ${player.stat} - Date: ${player.date}
        `;
        statsList.appendChild(playerDiv);
    });
}

// Load the stored stats on page load
function loadStats() {
    const params = {
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE
    };

    const request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then((response) => {
        const data = response.result.values;
        playerStats = data ? data.map(row => ({
            name: row[0],
            stat: row[1],
            date: row[2]
        })) : [];
        displayStats();
    }, (error) => {
        console.error('Error loading data:', error);
    });
}

// Initialize the app
window.onload = function () {
    loadGoogleAPI();
    loadStats();
};

const socket = io();

// Ask the user for their name
const playerName = prompt("Enter your name to join the game:");
socket.emit('new-player', playerName);

// Listen for player list updates from the server
const playerList = document.getElementById('players');
const voteOptions = document.getElementById('vote-options');
let selectedVote = null;
let players = [];

socket.on('player-list', (playerArray) => {
    players = playerArray;
    updatePlayerList();
    updateVoteOptions();
});

// Update the player list in the UI
function updatePlayerList() {
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.innerText = player.name + (player.voted ? ' (Voted)' : '');
        playerList.appendChild(li);
    });
}

// Update the voting options dynamically
function updateVoteOptions() {
    voteOptions.innerHTML = '';
    players.forEach(player => {
        if (player.name !== playerName) {
            const voteDiv = document.createElement('div');
            voteDiv.innerText = player.name;
            voteDiv.dataset.playerName = player.name;
            voteDiv.classList.add('vote-option');
            voteOptions.appendChild(voteDiv);
        }
    });
}

// Handle vote selection
voteOptions.addEventListener('click', (e) => {
    if (e.target.classList.contains('vote-option')) {
        selectedVote = e.target.dataset.playerName;
        document.getElementById('submit-vote').disabled = false;
    }
});

// Handle vote submission
document.getElementById('submit-vote').addEventListener('click', () => {
    if (selectedVote) {
        socket.emit('vote', selectedVote);
        document.getElementById('submit-vote').disabled = true;
    }
});

// Listen for vote updates from the server
socket.on('update-votes', (votes) => {
    let resultsText = 'Votes so far:\n';
    for (const voterId in votes) {
        resultsText += `${votes[voterId]} was voted.\n`;
    }
    document.getElementById('results').innerText = resultsText;
});

// Chat functionality
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendMessageButton = document.getElementById('send-message');

function displayMessage(message) {
    let msgDiv = document.createElement('div');
    msgDiv.innerText = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendMessageButton.addEventListener('click', () => {
    const message = chatInput.value;
    if (message.trim() !== "") {
        displayMessage(`You: ${message}`);
        chatInput.value = "";
    }
});

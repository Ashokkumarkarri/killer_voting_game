// Sample players array
let players = ['Alice', 'Bob', 'Charlie', 'David'];

// Add players dynamically
const playerList = document.getElementById('players');
const voteOptions = document.getElementById('vote-options');
players.forEach(player => {
    let li = document.createElement('li');
    li.innerText = player;
    playerList.appendChild(li);

    // Voting options for each player
    let voteDiv = document.createElement('div');
    voteDiv.innerText = player;
    voteDiv.dataset.playerName = player;
    voteDiv.classList.add('vote-option');
    voteOptions.appendChild(voteDiv);
});

// Handle vote submission
let selectedVote = null;
voteOptions.addEventListener('click', (e) => {
    if (e.target.classList.contains('vote-option')) {
        selectedVote = e.target.dataset.playerName;
        alert(`You voted for ${selectedVote}`);
    }
});

document.getElementById('submit-vote').addEventListener('click', () => {
    if (selectedVote) {
        document.getElementById('results').innerText = `You voted for ${selectedVote}`;
    } else {
        alert('Please select a player to vote for!');
    }
});

// Chat functionality
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendMessageButton = document.getElementById('send-message');

// Display chat messages
function displayMessage(message) {
    let msgDiv = document.createElement('div');
    msgDiv.innerText = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle chat message send
sendMessageButton.addEventListener('click', () => {
    const message = chatInput.value;
    if (message.trim() !== "") {
        displayMessage(`You: ${message}`);
        chatInput.value = "";
    }
});

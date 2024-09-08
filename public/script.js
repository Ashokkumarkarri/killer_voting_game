const socket = io();
let playerName = '';

document.getElementById('joinGame').addEventListener('click', () => {
    playerName = document.getElementById('playerName').value;
    if (playerName) {
        socket.emit('joinGame', playerName);
        document.getElementById('joinSection').style.display = 'none';
        document.getElementById('playerSection').style.display = 'block';
    }
});

// Update players in the game
socket.on('updatePlayers', (players) => {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name} - ${player.ready ? 'Ready' : 'Not Ready'}`;
        playerList.appendChild(li);
    });
});

// Player clicks ready
document.getElementById('readyButton').addEventListener('click', () => {
    socket.emit('playerReady');
    document.getElementById('readyButton').disabled = true;
});

// Start voting
socket.on('startVoting', (players) => {
    document.getElementById('playerSection').style.display = 'none';
    document.getElementById('votingSection').style.display = 'block';

    const voteList = document.getElementById('voteList');
    voteList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.innerHTML = `${player.name} <button onclick="vote('${player.id}')">Vote</button>`;
        voteList.appendChild(li);
    });
});

// Vote for a player
function vote(playerId) {
    socket.emit('votePlayer', playerId);
}

// Handle elimination
socket.on('eliminatePlayer', (playerName) => {
    document.getElementById('votingSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('resultsMessage').textContent = `${playerName} has been eliminated!`;
});

// Handle revote in case of a draw
socket.on('drawRevote', () => {
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('resultsMessage').textContent = `It's a draw! Revote.`;
});

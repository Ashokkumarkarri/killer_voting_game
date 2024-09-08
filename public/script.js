const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const playerList = document.getElementById('player-list');
    const voteList = document.getElementById('vote-list');
    const playerStatus = document.getElementById('player-status');
    const votingSection = document.getElementById('voting-section');
    const statusSection = document.getElementById('status-section');
    const submitVoteButton = document.getElementById('submit-vote');

    // Update player list
    socket.on('updatePlayers', (players) => {
        playerList.innerHTML = '';
        players.forEach(player => {
            const div = document.createElement('div');
            div.textContent = `${player.name} - ${player.status}`;
            playerList.appendChild(div);
        });

        // Display voting section if game has started
        if (players.every(player => player.status === 'ready')) {
            votingSection.style.display = 'block';
            updateVoteList(players);
        }
    });

    // Update voting options
    function updateVoteList(players) {
        voteList.innerHTML = '';
        players.forEach(player => {
            if (player.status === 'active') {
                const button = document.createElement('button');
                button.textContent = player.name;
                button.onclick = () => voteForPlayer(player.id);
                voteList.appendChild(button);
            }
        });
    }

    // Handle vote submission
    submitVoteButton.addEventListener('click', () => {
        socket.emit('submitVote');
    });

    // Show player status and votes
    socket.on('updateStatus', (status) => {
        playerStatus.innerHTML = '';
        status.forEach(player => {
            const div = document.createElement('div');
            div.textContent = `${player.name} - Votes: ${player.votes} - ${player.voted ? 'Voted' : 'Not Voted'}`;
            playerStatus.appendChild(div);
        });
        statusSection.style.display = 'block';
    });

    // Handle voting
    function voteForPlayer(playerId) {
        socket.emit('vote', playerId);
    }
});

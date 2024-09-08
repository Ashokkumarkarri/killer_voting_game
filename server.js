const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];
let readyCount = 0;

// Serve static files (your HTML, CSS, JS)
app.use(express.static('public'));

// Handle new player connections
io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    // New player joins
    socket.on('joinGame', (playerName) => {
        players.push({ id: socket.id, name: playerName, votes: 0, ready: false });
        io.emit('updatePlayers', players);
    });

    // Player is ready
    socket.on('playerReady', () => {
        players = players.map(player =>
            player.id === socket.id ? { ...player, ready: true } : player
        );
        readyCount++;
        io.emit('updatePlayers', players);

        // Check if all players are ready
        if (readyCount === players.length) {
            io.emit('startVoting', players);
        }
    });

    // Handle voting
    socket.on('votePlayer', (votedPlayerId) => {
        players = players.map(player =>
            player.id === votedPlayerId ? { ...player, votes: player.votes + 1 } : player
        );

        const allVotesIn = players.every(player => player.votes > 0);
        if (allVotesIn) {
            // Check for elimination or draw
            const highestVotes = Math.max(...players.map(p => p.votes));
            const playersWithMaxVotes = players.filter(p => p.votes === highestVotes);

            if (playersWithMaxVotes.length === 1) {
                io.emit('eliminatePlayer', playersWithMaxVotes[0].name);
            } else {
                io.emit('drawRevote');
            }
            // Reset votes
            players = players.map(player => ({ ...player, votes: 0 }));
        }
    });

    // Handle player disconnect
    socket.on('disconnect', () => {
        players = players.filter(player => player.id !== socket.id);
        io.emit('updatePlayers', players);
        readyCount = players.filter(player => player.ready).length;
        console.log('A player disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

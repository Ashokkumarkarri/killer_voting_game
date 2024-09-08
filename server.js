const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

// Example player list
const players = [
    { id: '1', name: 'Alice', status: 'active' },
    { id: '2', name: 'Bob', status: 'active' },
];

const votes = {}; // Track votes

io.on('connection', (socket) => {
    // Notify clients of player updates
    io.emit('updatePlayers', players);

    socket.on('submitVote', () => {
        // Calculate votes and determine status
        io.emit('updateStatus', players.map(player => ({
            ...player,
            votes: votes[player.id] || 0,
            voted: votes[player.id] > 0
        })));
    });

    socket.on('vote', (playerId) => {
        if (!votes[playerId]) votes[playerId] = 0;
        votes[playerId]++;
        // Optionally, emit updated votes to all clients
        io.emit('updateStatus', players.map(player => ({
            ...player,
            votes: votes[player.id] || 0,
            voted: votes[player.id] > 0
        })));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

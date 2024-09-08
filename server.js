const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let players = [];
let votes = {};

// Serve static files
app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A player connected.');

    // Handle new player joining
    socket.on('new-player', (name) => {
        players.push({ id: socket.id, name, voted: false });
        io.emit('player-list', players);
    });

    // Handle player voting
    socket.on('vote', (votedPlayer) => {
        votes[socket.id] = votedPlayer;
        players.forEach(player => {
            player.voted = votes[socket.id] ? true : false;
        });
        io.emit('update-votes', votes);
        io.emit('player-list', players);
    });

    // Handle player disconnection
    socket.on('disconnect', () => {
        players = players.filter(player => player.id !== socket.id);
        io.emit('player-list', players);
        console.log('A player disconnected.');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

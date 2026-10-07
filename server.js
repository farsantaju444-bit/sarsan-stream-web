const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, role) => {
        socket.join(roomId);
        
        if (role === 'watcher') {
            // Bilbili lammaffaan yeroo seene, bilbila duraa (broadcaster) beeksisa
            socket.to(roomId).emit('watcher-joined', socket.id);
        }
    });

    socket.on('offer', (id, message) => {
        io.to(id).emit('offer', socket.id, message);
    });

    socket.on('answer', (id, message) => {
        io.to(id).emit('answer', socket.id, message);
    });

    socket.on('ice-candidate', (id, message) => {
        io.to(id).emit('candidate', socket.id, message);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

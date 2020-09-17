module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            console.log('client disconnected');
            socket.emit('USER_LOGGED_OUT');
        });

        socket.on('USER_ADDED', () => {
            console.log('USER_ADDED');
            io.sockets.emit('UPDATE_USERS_LIST');
        });
    });
};

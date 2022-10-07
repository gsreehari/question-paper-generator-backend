
const io = require('../../app.js')
// var sockets = io.io;

module.exports = (socket)=>{
    io.socketIo.sockets.emit("newconnection",`user connected ${socket.id}`)

    socket.on('disconnect', function () {
    });
}
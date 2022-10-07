const io = require('../../app.js')

module.exports = {
    emitUsers:(data)=>{
        return io.socketIo.sockets.emit("users",{data:data})
        // console.log(data);
    }
}
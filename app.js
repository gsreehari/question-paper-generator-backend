require("dotenv").config();

const express = require('express');
const app = express();
const mysql = require('mysql');
const mysqlEvents = require('@rodrigogs/mysql-events');
const httpServer = require('http').Server(app);
const socketio = require('socket.io')(httpServer);
const userRouter = require("./src/users/user.routes");
const subjectRouter = require("./src/subjects/subjects.routes");
const questionsRouter = require("./src/questions/questions.routes");
const questionpaperRouter = require("./src/questionpaper/questionpaper.routes");
const cors = require('cors')
const router = require("express").Router();
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cors());

app.use('/questionImage', express.static('public/uploads/question images'));

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/questionpaper", questionpaperRouter);


app.get("/",(req,res)=>{
    return res.send("QPGO API")
})

// const program = async () => {
//     const connection = mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: ''
//     });

//     const instance = new mysqlEvents(connection, {
//         startAtEnd: true // to record only the new binary logs, if set to false or you didn'y provide it all the events will be console.logged after you start the app
//     });

//     await instance.start();

//     instance.addTrigger({
//         name: 'monitoring all statments',
//         expression: 'question_paper_generator.*', // listen to TEST database !!!
//         statement: mysqlEvents.STATEMENTS.ALL, // you can choose only insert for example MySQLEvents.STATEMENTS.INSERT, but here we are choosing everything
//         onEvent: e => {
//             console.log(e);
//         }
//     });

//     instance.on(mysqlEvents.EVENTS.CONNECTION_ERROR, console.error);
//     instance.on(mysqlEvents.EVENTS.ZONGJI_ERROR, console.error);
// };

// program()
//     .then()
//     .catch(console.error);

socketio.on('connection', function (socket) {
    console.log('A user connected');

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT;

httpServer.listen(PORT, function() {
    console.log(`listening on *:${PORT}`);
});
require("dotenv").config();

const express = require('express');
const app = express();
const mysql = require('mysql');
const mysqlEvents = require('@rodrigogs/mysql-events');
const httpServer = require('http').Server(app);
const socketio = require('socket.io');
const userRouter = require("./src/users/user.routes");
const branchRouter = require("./src/branch/branch.routes");
const subjectRouter = require("./src/subjects/subjects.routes");
const questionsRouter = require("./src/questions/questions.routes");
const questionpaperRouter = require("./src/questionpaper/questionpaper.routes");
const socketConnection = require('./src/socket/connection')
const pool = require("./src/db/database");
const { sign, verify } = require("jsonwebtoken");
const { mailer } = require('./src/mailer/mailer');
const { getUserByUserEmail, updateUser } = require('./src/users/user.service')
const prtemplete = require('./src/mailer/templates/password-reset/password-reset')



const cors = require('cors');
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
app.set('view engine', 'ejs');

app.use('/questionImage', express.static('public/uploads/question images'));
app.use('/userImage', express.static('public/uploads/profile pics'));


app.use(express.json());
app.use(express.urlencoded());


app.use("/api/users", userRouter);
app.use("/api/branch", branchRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/questionpaper", questionpaperRouter);

app.post("/updatePassword",(req,res)=>{
    console.log(req.body)
    verify(req.body.token, process.env.JWT_ACCESS_TOKEN + req.body.userEmail, (err, decoded) => {
        return res.send(decoded)
    })
})

app.get("/reset/:jwtToken/:email", (req, res) => {
    let jwtToken = req.params.jwtToken
    let email = req.params.email
    verify(jwtToken, process.env.JWT_ACCESS_TOKEN + email, (err, decoded) => {
        if (err) {
            return res.render('401');
        } else {
            return res.render('password-reset',{userId: decoded.userId,token:jwtToken, userEmail: decoded.userEmail});
        }
    });
})

app.post("/api/resetPassword", (req, res) => {
    let email = req.body.email

    getUserByUserEmail(email, (error, result) => {
        if (error) {
            res.json(error)
        }

        delete result.userPassword
        
        const jsontoken = sign({ ...result }, process.env.JWT_ACCESS_TOKEN + email, {
            expiresIn: "30m"
        });

        prtemplete.passwordResetTemplete({ token: jsontoken, email }, (error, html) => {

            mailer({ email, subject: "Password Reset", message: html }, (error, result) => {
                if (error) {
                    return res.status(500).json(error)
                }
                return res.json({message:`An email has been sent to ${email} for password reset`})
            })
            // return res.send(html)++
        })
    })

})


app.get("/", (req, res) => {
    return res.json("QUESTION PAPER GENERATOR API :)")
})


var io = socketio(httpServer, { allowEIO3: true, cors: { origin: "http://localhost:4200", credentials: true } });

io.on('connection', socketConnection);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, function () {
    console.log(`listening on *:${PORT}`);
});
// console.log(io)
module.exports.socketIo = io;
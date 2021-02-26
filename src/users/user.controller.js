const md5 = require('md5');

const {
    create,
    getUserByUsername,
    getUserByUserId,
    getUsers,
    updateUserStatus,
    deleteUser,
    getFacultyNames,
    getUsersTotalCount
} = require("./user.service");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.userPassword = hashSync(body.userPassword, salt);
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    status:"fail",
                    code:"DBCE",
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                status:"success",
                code:"UIS",
                data: results
            });
        });
    },
    login: (req, res) => {
        const body = req.body;
        getUserByUsername(body.username, body.college, (err, results) => {
            if (err === "NA") {
                return res.json({
                    status: "fail",
                    code: "RNF",
                    message: "This account has no permission to access please contact ADMIN."
                });
            }
            if (err === "NF") {
                return res.json({
                    status: "fail",
                    code: "RNF",
                    message: "Username or Password incorrect"
                });
            }
            if (err) {
                return res.json({
                    status: "fail",
                    code: "ER",
                    message: "database error"
                });
            }
            if (!results) {
                return res.json({
                    status: "fail",
                    code: "IC",
                    message: "Invalid username or password"
                });
            }
            const result = compareSync(body.password, results.userPassword);
            if (result) {
                results.password = undefined;
                const jsontoken = sign({ result: results }, process.env.JWT_ACCESS_TOKEN, {
                    expiresIn: "1d"
                });
                return res.json({
                    status: "success",
                    message: "login successfully",
                    code: "LS",
                    result: results,
                    token: jsontoken,
                });
            } else {
                return res.json({
                    status: "failed",
                    code: "LF",
                    message: "Invalid username or password"
                });
            }
        });
    },
    getUserByUserId: (req, res) => {
        const id = req.params.id;
        try {
            getUserByUserId(id, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (!results) {
                    return res.json({
                        status: "error",
                        message: "Record not Found"
                    });
                }
                results.password = undefined;
                return res.json({
                    status :"success",
                    data: results
                });
            });
        } catch (error) {
            res.json({
                status: "error",
                message: "error in database"
            })
        }
    },
    getUsers: (req, res) => {
        getUsers((err, results) => {
            if (err) {
                return res.status(500).json({
                    status:"error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:err
                });
            }
            return res.json({
                status:"success",
                data: results
            });
        });
    },
    getUsersCount:(req,res) => {
        getUsersTotalCount((error, results)=>{
            if (error) {
                return res.status(500).json({
                    status:"error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:err
                });
            }
            return res.json({
                status:"success",
                data: results
            });
        })
    },
    getFacultyUsers: (req, res) => {
        getFacultyNames((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                status: "success",
                data: results
            });
        });
    },
    updateUsersStatus: (req, res) => {
        const body = req.body;
        updateUserStatus(body, (err, results) => {
            if (err) {
                return res.json(err);
            }
            return res.json({
                status : "success",
                msg: "updated successfully",
                data : results
            });
        });
    },
    deleteUser: (req, res) => {
        const data = req.body;
        deleteUser(data, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record Not Found"
                });
            }
            return res.json({
                success: 1,
                message: "user deleted successfully"
            });
        });
    },
    checkUserToken:(req,res)=>{
        return res.json({
            status:"success",
            code:'VT',
            message:"valid token"
        })
    }
};
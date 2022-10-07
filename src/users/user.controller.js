const md5 = require('md5');
const {emitUsers} = require('../socket/functions');

const {
    create,
    getUserByUsername,
    getUserByUserId,
    getUsers,
    getUsersByCollege,
    updateUserStatus,
    deleteUser,
    getFacultyNames,
    getUsersTotalCount,
    getUsersCountByRoles,
    updateUserProfilePic,
    updateUserRoles,
    getFacultyByBranch
} = require("./user.service");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
    createUser: (req, res, next) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.userPassword = hashSync(body.userPassword, salt);
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    status:"fail",
                    code:"DBCE",
                    message: "Database connection error",
                    error:err
                });
            }
            // emitUsers(results);
            req['databaseResults'] = results
            req['databaseTable'] = 'users'
            // next()
            return res.status(200).json({
                status:"success",
                code:"UIS",
                data: results
            });
        });
    },
    login: (req, res, next) => {
        const body = req.body;
        if(body.username === "" || body.password === "" || body.college == ""){
            return res.status(500).json({
                status: "fail",
                message: "Empty details",
            });
        }else{
            getUserByUsername(body.username, (err, results) => {
                if (err === "NA") {
                    return res.status(404).json({
                        status: "fail",
                        code: "RNF",
                        message: "This account has no permission to access please contact ADMIN.",
                        error:err
                    });
                }
                if (err === "NF") {
                    return res.status(404).json({
                        status: "fail",
                        code: "RNF",
                        message: "User not found",
                        error:err
                    });
                }
                if (err) {
                    return res.status(500).json({
                        status: "fail",
                        code: "ER",
                        message: "database error",
                        error:err
                    });
                }
                if (!results) {
                    return res.status(404).json({
                        status: "fail",
                        code: "IC",
                        message: "Invalid username or password"
                    });
                }
                const result = compareSync(body.password, results.userPassword);
                if (result) {
                    results.password = undefined;
                    const jsontoken = sign({ result: results }, "question_paper_generator_token", {
                        expiresIn: "1d"
                    });
                    req.decoded = results
                    return res.status(200).json({
                        status: "success",
                        message: "login successfully",
                        code: "LS",
                        result: results,
                        token: jsontoken,
                    });
                } else {
                    return res.status(404).json({
                        status: "failed",
                        code: "LF",
                        message: "Invalid username or password"
                    });
                }
            });
        }
    },
    getUserByUserId: (req, res, next) => {
        const id = req.params.id;
        try {
            getUserByUserId(id, (err, results) => {
                if (err) {
                    return res.status(500).json({
                        status: "fail",
                        code: "RNF",
                        message: "This account has no permission to access please contact ADMIN.",
                        error:err
                    });
                }
                if (!results) {
                    return res.json({
                        status: "error",
                        message: "Record not Found"
                    });
                }
                results.password = undefined;
                req['databaseResults'] = results
                req['databaseTable'] = 'users'
                next()
            });
        } catch (error) {
            res.json({
                status: "error",
                message: "error in database"
            })
        }
    },
    getUsers: (req, res, next) => {
        getUsers((err, results) => {
            if (err) {
                return res.status(500).json({
                    status:"error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:err
                });
            }
            req['databaseResults'] = results
            req['databaseTable'] = 'users'
            next()
            // return res.json({
            //     status:"success",
            //     data: results
            // });
        });
    },
    getUsersByCollege: (req, res, next) => {
        let collegeId = req.params.collegeId

        getUsersByCollege(collegeId,(err, results) => {
            if (err) {
                return res.status(500).json({
                    status:"error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:err
                });
            }
            req['databaseResults'] = results
            req['databaseTable'] = 'users'
            next()
            // return res.json({
            //     status:"success",
            //     data: results
            // });
        });
    },
    getUsersCount:(req,res, next) => {
        getUsersTotalCount((error, results)=>{
            if (error) {
                return res.status(500).json({
                    status:"error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:err
                });
            }
            req['databaseResults'] = results
            req['databaseTable'] = 'users'
            next()
            // return res.json({
            //     status:"success",
            //     data: results
            // });
        })
    },
    getUsersCountByRoles:(req,res, next) => {
        getUsersCountByRoles((error, results)=>{
            if (error) {
                return res.status(500).json({
                    status:"error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:error
                });
            }
            req['databaseResults'] = results
            req['databaseTable'] = 'users'
            next()
            // return res.json({
            //     status:"success",
            //     data: results
            // });
        })
    },
    getFacultyUsers: (req, res, next) => {
        getFacultyNames((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            req['databaseResults'] = results
            req['databaseTable'] = 'users'
            next()
            // return res.json({
            //     status: "success",
            //     data: results
            // });
        });
    },
    getFacultyByBranch:(req, res, next)=>{
        let branchId = req.params.branchId
        let collegeId = parseInt(req.params.collegeId)
        getFacultyByBranch({branchId,collegeId},(err, results) => {
            if (err) {
                return err;
            }
            req['databaseResults'] = results
            req['databaseTable'] = 'users'
            next()
            // return res.json({
            //     status: "success",
            //     data: results
            // });
        })
    },
    updateUsersStatus: (req, res, next) => {
        const body = req.body;
        updateUserStatus(body, (err, results) => {
            if (err) {
                return res.json(err);
            }
            req['databaseResults'] = results
            req['databaseTable'] = 'users'
            next()
            // return res.json({
            //     status : "success",
            //     msg: "updated successfully",
            //     data : results
            // });
        });
    },
    updateUserRoles: (req, res, next) => {
        const body = req.body;
        updateUserRoles(body, (err, results) => {
            if (err) {
                return res.json(err);
            }
            req['databaseResults'] = results
            req['databaseTable'] = 'users'
            next()
            // return res.json({
            //     status : "success",
            //     msg: "updated successfully",
            //     data : results
            // });
        });
    },
    updateUserProfilePic: (req, res, next) => {
        var body = req.body;
        if(req.file){
            body.file = req.file.filename
        }
        updateUserProfilePic(body,(error,result)=>{
            if (error) {
                return res.json(err);
            }
            req['databaseResults'] = results
            req['databaseTable'] = 'users'
            next()
            // return res.json({
            //     status : "success",
            //     msg: "updated successfully",
            //     data : result
            // });
        })
    },
    deleteUser: (req, res, next) => {
        var id = req.params.id
        deleteUser(id, (error, results) => {
            if(error){
                return res.status(500).json({
                    status : "error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:err
                });
            }
            emitUsers(results);
            req['databaseResults'] = results
            req['databaseTable'] = 'users'
            next()
            // return res.json({
            //     status : "success",
            //     data: results
            // });
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
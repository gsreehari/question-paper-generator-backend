const md5 = require("md5");
const pool = require("../db/database");
const {userId} = require('../id_generator/idGenerator')

module.exports = {
    create: (data, callBack) => {
        let res;
        let uid = userId();
        pool.query(
            `INSERT INTO users(userId, userName, userPassword, userEmail, userProfilePic, userDisplayName, userCollege) 
                values(?,?,?,?,?,?,?)`,
            [
                uid,
                data.userName,
                data.userPassword,
                data.userEmail,
                data.userProfilePic || null,
                data.userName,
                data.userCollege
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                res = results;
                let roles = [];
                data.userRole.forEach(element => {
                    let r = []
                    r.push(uid);
                    r.push(element+1);
                    roles.push(r);
                });
                if(data.userRole > 0){
                    pool.query(
                        `INSERT INTO userrolemap (userId, roleId) values ?`,
                        [roles],
                        (error, results, fields) => {
                            if (error) {
                                return callBack(error);
                            }
                            return callBack(null, res);
                        }
                    );
                }else{
                    return callBack(null, res);
                }
            }
        );
    },
    getUserByUsername: (username, college, callBack) => {
        var res;
        pool.query(
            `select userId, userName, userPassword, userEmail, userProfilePic, userDisplayName, userStatus, userCollege, lastLogin, createdDate,collegeId,collegeName from users inner join college on users.userCollege = college.collegeId where userName = ?`,
            [username],
            (error, results, fields) => {
                if (error) {
                    console.log(error)
                    return callBack(error);
                }
                res = results[0];
                if(results[0]){
                    if(results[0].userStatus === 1){
                        pool.query(
                            `select role from userrolemap as urm inner join role on urm.roleId = role.roleId where userId = ?`,
                            [res.userId],
                            (error, results, fields) => {
                                if (error) {
                                    return callBack(error);
                                }
                                let r = [];
                                results.forEach(element => {
                                    r.push(element.role);
                                });
                                res['roles'] = r.sort();
                                return callBack(null, res);
                            }
                        );
                    }else{
                        return callBack("NA")
                    }
                }else{
                    return callBack("NF")
                }
            }
        );
    },
    getUserByUserId: (id, callBack) => {
        var res;
        pool.query(
            `select userId, userName, userPassword, userEmail, userProfilePic, userDisplayName, userStatus, userCollege, lastLogin, createdDate,collegeId,collegeName from users inner join college on users.userCollege = college.collegeId where userId = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                res = results[0];
                pool.query(
                    `select role from userrolemap as urm inner join role on urm.roleId = role.roleId where userId = ?`,
                    [res.userId],
                    (error, results, fields) => {
                        if (error) {
                            return callBack(error);
                        }
                        let r = [];
                        results.forEach(element => {
                            r.push(element.role);
                        });
                        res['roles'] = r.sort();
                        return callBack(null, res);
                        // return callBack(null, results[0]);
                    }
                );
            }
        );
    },
    getUsers: callBack => {
        pool.query(
            // `select userId, userName, userDisplayName, userEmail, userStatus, createdDate, collegeName as userCollege from users inner join college on users.userCollege = college.collegeId`,
            `select u.userId, u.userName, u.userDisplayName, u.userEmail, u.userStatus, u.createdDate, u.userCollege, role from userrolemap urm inner join users as u on u.userId = urm.userId inner join role on role.roleId = urm.roleId group by urm.userId order by u.createdDate DESC`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                console.log(results)
                return callBack(null, results);
            }
        );
    },
    getUsersTotalCount: callBack => {
        pool.query(
            `select count(*) as count from users`,
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    getUsersCountByRoles: callBack =>{
        pool.query(
            `SELECT count(*) as count FROM userrolemap WHERE roleId = 2 OR roleId = 3 GROUP BY roleId`,
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                console.log(results);
                return callBack(null, results[0]);
            }
        );
    },
    getFacultyNames:(callBack)=>{
        pool.query(
            `select users.userId,users.userDisplayName as name from userrolemap inner join users on users.userId = userrolemap.userId where roleId = 3`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    updateUserStatus: (data, callBack) => {
        pool.query(
            `update users set userStatus=? where userId = ?`,
            [
                data.status,
                data.uid
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                module.exports.getUserByUserId(data.uid,(err,res)=>{
                    if (error) {
                        callBack(error);
                    }
                    return callBack(null, res);
                });
            }
        );
    },
    deleteUser: (data, callBack) => {
        pool.query(
            `delete from users where id = ?`,
            [data.id],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    }
};
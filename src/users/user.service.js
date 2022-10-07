const md5 = require("md5");
const pool = require("../db/database");
const {userId} = require('../id_generator/idGenerator')

module.exports = {
    create: (data, callBack) => {
        let res;
        pool.query(`select MAX(cast(substring(userId,8) as INT)) as count from users`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                let uid = userId(data.userCollege,results[0].count);
                console.log(data.userBranch)
                pool.query(
                    `INSERT INTO users(userId, userName, userPassword, userEmail, userProfilePic, userDisplayName, userBranch,userCollege) 
                        values(?,?,?,?,?,?,?,?)`,
                    [
                        uid,
                        data.userName,
                        data.userPassword,
                        data.userEmail,
                        data.userProfilePic || null,
                        data.userName,
                        data.userBranch,
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
                        if(roles.length > 0){
                            pool.query(
                                `INSERT INTO userrolemap (userId, roleId) values ?`,
                                [roles],
                                (error, results, fields) => {
                                    if (error) {
                                        return callBack(error);
                                    }
                                    module.exports.getUsers((error,results)=>{
                                        return callBack(null, results);
                                    })
                                }
                            );
                        }else{
                            return callBack("user must have roles");
                        }
                    }
                );
            }
        )
        
    },
    getUserByUsername: (username, callBack) => {
        var res;
        pool.query(
            `select userId, userName, userPassword, userEmail, userProfilePic, userDisplayName, userStatus, userCollege, lastLogin, createdDate,collegeId,collegeName from users inner join college on users.userCollege = college.collegeId WHERE userName = ?`,
            [
                username
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                if(results.length > 0){
                    res = results[0];
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
    getUserByUserEmail: (email, callBack) => {
        var res;
        pool.query(
            `select userId, userName, userPassword, userEmail, userProfilePic, userDisplayName, userStatus, userCollege, lastLogin, createdDate,collegeId,collegeName from users inner join college on users.userCollege = college.collegeId where userEmail = ?`,
            [email],
            (error, results, fields) => {
                if (error) {
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
                        return callBack({message: "user not assigned"})
                    }
                }else{
                    return callBack({message: "User not found"})
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
            `SELECT users.userId,userDisplayName,userEmail,userProfilePic,userStatus,(SELECT GROUP_CONCAT(role.role) FROM userrolemap INNER JOIN role ON role.roleId = userrolemap.roleId WHERE userrolemap.userId = users.userId GROUP BY userrolemap.userId) as roles,(SELECT GROUP_CONCAT(CONCAT(subject.subjectShortName, "-",subject.subjectId) SEPARATOR',') from subjectfaculty as sf INNER JOIN subject on subject.subjectId = sf.subjectId WHERE sf.userId = users.userId GROUP BY sf.userId) as subjects, branchName FROM users LEFT OUTER JOIN branch ON branch.branchId = users.userBranch ORDER BY users.createdDate ASC`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                results.forEach(item => {
                    item.roles = item.roles.split(",").map(i => parseInt(i)).sort()
                    item.subjects = item.subjects ? item.subjects.split(",").map((item)=>item.split('-')).sort() : []
                })
                return callBack(null, results);
            }
        );
    },
    getUsersByCollege: (college, callBack) => {
        pool.query(
            // `select userId, userName, userDisplayName, userEmail, userStatus, createdDate, collegeName as userCollege from users inner join college on users.userCollege = college.collegeId`,
            `SELECT users.userId,userDisplayName,userEmail,userProfilePic,userStatus,
            (SELECT GROUP_CONCAT(role.role) FROM userrolemap INNER JOIN role ON role.roleId = userrolemap.roleId WHERE userrolemap.userId = users.userId GROUP BY userrolemap.userId) as roles,
            (SELECT GROUP_CONCAT(CONCAT(subject.subjectShortName, "-",subject.subjectId) SEPARATOR',') from subjectfaculty as sf INNER JOIN subject on subject.subjectId = sf.subjectId WHERE sf.userId = users.userId GROUP BY sf.userId) as subjects, branchName 
            FROM users 
            LEFT OUTER JOIN branch ON branch.branchId = users.userBranch 
            WHERE users.userCollege = ?
            ORDER BY users.createdDate ASC`,
            [college],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                results.forEach(item => {
                    item.roles = item.roles.split(",").map(i => parseInt(i)).sort()
                    item.subjects = item.subjects ? item.subjects.split(",").map((item)=>item.split('-')).sort() : []
                })
                return callBack(null, results);
            }
        );
    },
    getUsersTotalCount: callBack => {
        pool.query(
            `select count(*) as count from users`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    getUsersCountByRoles: callBack =>{
        pool.query(
            `select urm.userId, group_concat(urm.roleId) as roles from userrolemap as urm inner join users as u on urm.userId = u.userId where u.userCollege=? and urm.roleId in (3,4) group by urm.userId;`,
            [
                "64560"
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                let res = {
                    totalCount:0,
                    adminCount : 0,
                    facultyCount : 0,
                    bothCount : 0
                }
                results.forEach(item => {
                    item.roles = item.roles.split(",")
                    if(item.roles.length == 2){
                        res.bothCount += 1
                    }
                    else{
                        if(item.roles.includes("3")){
                            res.adminCount += 1
                        }
                        if(item.roles.includes("4")){
                            res.facultyCount += 1
                        }
                    }
                    res.totalCount += 1
                })
                return callBack(null, res);
            }
        );
    },
    getFacultyNames:(callBack)=>{
        pool.query(
            `select users.userId,users.userDisplayName as name from userrolemap inner join users on users.userId = userrolemap.userId where roleId = 4`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getFacultyByBranch:(data,callBack)=>{
        pool.query(
            `select users.userId,users.userDisplayName as name from userrolemap inner join users on users.userId = userrolemap.userId where roleId = 4 AND users.userBranch = ? AND users.userCollege = ?`,
            [
                data.branchId,
                data.collegeId
            ],
            (error, results, fields) => {
                console.log(results)
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    updateUser: (data, callBack) => {
        pool.query(
            `update users set userName=?, userPassword=?, userEmail=?, userProfilePic=?, userDisplayName=?, userStatus=?, userCollege=?, userBranch=?, where userId = ?`,
            [
                data.userName,
                data.userPassword,
                data.userEmail,
                data.userProfilePic,
                data.userDisplayName,
                data.userStatus,
                data.userCollege,
                data.userBranch,
                data.userId
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
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
    updateUserStatus: (data, callBack) => {
        pool.query(
            `update users set userStatus=? where userId = ?`,
            [
                data.status,
                data.uid
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
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
    updateUserRoles: (data, callBack) => {
        let roles = [];
        data.userRoles.forEach(element => {
            let r = []
            r.push(data.userId);
            r.push(element+1);
            roles.push(r);
        });
        if(roles.length > 0){
        pool.query(
            'DELETE FROM userrolemap WHERE userId = ?',
            [data.userId],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                    pool.query(
                        `INSERT INTO userrolemap (userId, roleId) values ?`,
                        [roles],
                        (error, results, fields) => {
                            if (error) {
                                return callBack(error);
                            }
                            module.exports.getUserByUserId(data.userId,(err,res)=>{
                                if (error) {
                                    return callBack(error);
                                }
                                return callBack(null, res);
                            });
                        }
                    );
            }
        )
        }
        else{
            return callBack("user must have roles");
        }
    },
    updateUserProfilePic: (data, callBack) => {
        pool.query(
            `update users set userProfilePic=? where userId = ?`,
            [
                data.file,
                data.userId
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                module.exports.getUserByUserId(data.userId,(err,res)=>{
                    if (error) {
                        callBack(error);
                    }
                    return callBack(null, res);
                });
            }
        );
    },
    deleteUser: (id, callBack) => {
        pool.query(
            `DELETE FROM users where userId = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                module.exports.getUsers((error,results)=>{
                    return callBack(null, results);
                })
            }
        );
    }
};

// MYSQL_HOST = database-2.cwheqxa1f5jt.us-east-1.rds.amazonaws.com
// MYSQL_USER = admin
// MYSQL_PASSWORD = 8497961326Gs
// MYSQL_DATABASE = qpg
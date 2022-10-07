const pool = require("../db/database");
const { subjectId, collegeId } = require('../id_generator/idGenerator')

module.exports = {
    getAllSubjects: callBack => {
        pool.query(
            `SELECT s.subjectId,s.subjectName,s.subjectShortName, s.subjectScheme, s.subjectYear, s.subjectSemister, s.questionCount, s.subjectStatus, s.subjectUnits, s.subjectCode, s.subjectType, s.subjectCreatedAt,users.userDisplayName as subjectAddedBy,group_concat(u.userDisplayName,"|",u.userId) as faculty,b.branchName AS subjectDepartment,b.branchDegree as subjectDegree
            FROM subject as s 
            LEFT OUTER JOIN subjectfaculty as sf on s.subjectId = sf.subjectId 
            LEFT OUTER JOIN users as u on u.userId = sf.userId 
            LEFT OUTER JOIN branch as b on s.subjectDepartment = b.branchId 
            LEFT OUTER JOIN users on users.userId = s.subjectAddedBy 
            GROUP BY s.subjectId 
            ORDER BY s.subjectName ASC`,
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getAllSubjectsByCollege: (collegeId, callBack) => {
        pool.query(
            `SELECT s.subjectId,s.subjectName,s.subjectShortName, s.subjectScheme, s.subjectYear, s.subjectSemister, s.questionCount, s.subjectStatus, s.subjectUnits, s.subjectCode, s.subjectType, s.subjectCreatedAt,users.userDisplayName as subjectAddedBy,group_concat(u.userDisplayName,"|",u.userId) as faculty,b.branchName AS subjectDepartment,b.branchDegree as subjectDegree
            FROM subject as s 
            LEFT OUTER JOIN subjectfaculty as sf on s.subjectId = sf.subjectId 
            LEFT OUTER JOIN users as u on u.userId = sf.userId 
            LEFT OUTER JOIN branch as b on s.subjectDepartment = b.branchId 
            LEFT OUTER JOIN users on users.userId = s.subjectAddedBy 
            WHERE s.subjectCollege = ?
            GROUP BY s.subjectId 
            ORDER BY s.subjectName ASC`,
            [collegeId],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getSubjectById: (id, callBack) => {
        var res = {}
        pool.query(
            `SELECT s.subjectId,s.subjectName,s.subjectShortName, s.subjectScheme, s.subjectYear, s.subjectSemister, s.questionCount, s.subjectStatus, s.subjectUnits, s.subjectCode, s.subjectType, s.subjectCreatedAt,users.userDisplayName as subjectAddedBy,group_concat(u.userDisplayName,"|",u.userId) as faculty,b.branchName AS subjectDepartment,b.branchDegree as subjectDegree
            FROM subject as s 
            LEFT OUTER JOIN subjectfaculty as sf on s.subjectId = sf.subjectId 
            LEFT OUTER JOIN users as u on u.userId = sf.userId 
            LEFT OUTER JOIN branch as b on s.subjectDepartment = b.branchId 
            LEFT OUTER JOIN users on users.userId = s.subjectAddedBy 
            WHERE s.subjectId=?
            GROUP BY s.subjectId 
            ORDER BY s.subjectName ASC `,
            [id],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                res = results[0];
                return callBack(null,res);
            }
        );
    },
    getSubjectsByUserId:(id,callBack)=>{
        pool.query(
            `SELECT s.subjectId,s.subjectName,s.subjectSequence, s.subjectShortName, s.subjectScheme, s.subjectYear, s.subjectSemister, s.questionCount, s.subjectStatus, s.subjectUnits, s.subjectCode, s.subjectType, s.subjectCreatedAt,users.userDisplayName as subjectAddedBy,group_concat(u.userDisplayName,"|",u.userId) as faculty,b.branchName AS subjectDepartment,b.branchDegree as subjectDegree
            FROM subject as s 
            LEFT OUTER JOIN subjectfaculty as sf on s.subjectId = sf.subjectId 
            LEFT OUTER JOIN users as u on u.userId = sf.userId 
            LEFT OUTER JOIN branch as b on s.subjectDepartment = b.branchId 
            LEFT OUTER JOIN users on users.userId = s.subjectAddedBy 
            WHERE sf.userId=?
            GROUP BY s.subjectId 
            ORDER BY s.subjectName ASC`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                res = results;
                return callBack(null,res);
            }
        );
    },
    getSubjectsCountByBranch:(callBack)=>{
        pool.query(
            `select count(*) as count, subjectBranch from subject group by subjectBranch ORDER BY subjectName ASC`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getSubjectsCount:(callBack)=>{
        pool.query(
            `select count(*) as count from subject`,
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    
    creteSubject: (data, callBack) => {
        var sid = subjectId();
        pool.query(
            `INSERT INTO subject (subjectId,subjectName, subjectShortName,subjectDepartment, subjectScheme, subjectYear, subjectSemister, subjectAddedBy,subjectUnits, subjectCollege, subjectCode, subjectType) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                sid,
                data.subjectName,
                data.subjectShortName,
                data.subjectDepartment,
                data.subjectScheme,
                data.subjectYear,
                data.subjectSemister,
                data.subjectAddedBy,
                data.subjectUnits,
                data.subjectCollege,
                data.subjectCode,
                data.subjectType
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                module.exports.createSubjectFaculty(data,sid,(err)=>{
                    if(err){
                        return callBack(err);
                    }
                    return callBack(null, results);
                });
            }
        );
    },
    createSubjectFaculty: (data,sid,callBack) => {
        var faculties = data.subjectFaculty;
        var values = []
        faculties.forEach(faculty => {
            let v = [];
            v.push(sid);
            v.push(faculty);
            values.push(v);
        });
        pool.query(
            `INSERT INTO subjectfaculty (subjectId, userId) values ?`,
            [values],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null);
            }
        );
    },
    updateSubject:(data,callBack)=>{
        console.log(data)
        pool.query(
            `UPDATE subject SET subjectName = ?, subjectShortName = ?, subjectDepartment = ?, subjectScheme=?, subjectYear=?, subjectSemister=?, subjectUnits=?, subjectCode=?, subjectType=? WHERE subjectId = ?`,
            [
                data.subjectName,
                data.subjectShortName,
                data.subjectDepartment,
                data.subjectScheme,
                data.subjectYear,
                data.subjectSemister,
                data.subjectUnits,
                data.subjectCode,
                data.subjectType,
                data.subjectId
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                module.exports.deleteSubjectFaculty(data.subjectId,(error,result)=>{
                    if(error){
                        return callBack(error);
                    }
                    module.exports.createSubjectFaculty(data,data.subjectId,(error,result)=>{
                        if(error){
                            return callBack(error);
                        }
                        module.exports.getSubjectById(data.subjectId,(error,results)=>{
                            if(error){
                                return callBack(error);
                            }
                            return callBack(null, results);
                        })
                    });
                })
            }
        );
    },
    deleteSubjectFaculty:(id,callBack)=>{
        console.log(id)
        pool.query(
            `DELETE FROM subjectfaculty where subjectId = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null,"ok")
            }
        );
    },
    deleteSubject:(id, callBack)=>{
        pool.query(
            `DELETE FROM subject where subjectId = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                module.exports.getAllSubjects((error,results)=>{
                    return callBack(null, results);
                })
            }
        );
    }
}
const pool = require("../db/database");
const { subjectId } = require('../id_generator/idGenerator')

module.exports = {
    getAllSubjects: callBack => {
        pool.query(
            `SELECT s.subjectId,subjectName,subjectDegree,subjectScheme,subjectBranch,subjectYear,subjectSemister,questionCount,subjectStatus,subjectUnits,subjectCreatedAt,u1.userDisplayName as subjectAddedBy, group_concat(u.userDisplayName,"|",u.userId) as faculty FROM subjectfaculty as sf INNER JOIN users as u on sf.userId = u.userId INNER JOIN subject as s on sf.subjectId = s.subjectId INNER JOIN users as u1 on s.subjectAddedBy = u1.userId  GROUP BY sf.subjectId ORDER BY s.subjectCreatedAt DESC`,
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
            `SELECT s.subjectId,subjectName,subjectDegree,subjectScheme,subjectBranch,subjectYear,subjectSemister,subjectUnits, group_concat(u.userDisplayName,"|",u.userId) as faculty FROM subjectfaculty as sf INNER JOIN users as u on sf.userId = u.userId INNER JOIN subject as s on sf.subjectId = s.subjectId INNER JOIN users as u1 on s.subjectAddedBy = u1.userId WHERE sf.subjectId=?`,
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
            `SELECT s.subjectId, s.subjectName, s.subjectDegree, s.subjectScheme, s.subjectBranch,s.subjectYear, s.subjectSemister,s.subjectUnits from subjectfaculty as sf INNER JOIN subject as s on s.subjectId = sf.subjectId WHERE sf.userId=?`,
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
    getSubjectsCount:(callBack)=>{
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
    creteSubject: (data, callBack) => {
        var sid = subjectId();
        pool.query(
            `INSERT INTO subject (subjectId,subjectName, subjectDegree, subjectScheme, subjectBranch, subjectYear, subjectSemister, subjectAddedBy,subjectUnits) VALUES (?,?,?,?,?,?,?,?,?)`,
            [
                sid,
                data.subjectName,
                data.subjectDegree,
                data.subjectScheme,
                data.subjectBranch,
                data.subjectYear,
                data.subjectSemister,
                data.subjectAddedBy,
                data.subjectUnits
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
        pool.query(
            `UPDATE subject SET subjectName = ?, subjectDegree = ?, subjectScheme = ?, subjectBranch = ?, subjectYear = ?, subjectSemister = ?,subjectUnits = ? WHERE subjectId = ?`,
            [
                data.subjectName,
                data.subjectDegree,
                data.subjectScheme,
                data.subjectBranch,
                data.subjectYear,
                data.subjectSemister,
                data.subjectUnits,
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
                    callBack(error);
                }
                module.exports.getAllSubjects((error,results)=>{

                    return callBack(null, results);
                })
            }
        );
    }
}
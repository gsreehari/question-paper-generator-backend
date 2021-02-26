const {questionId} = require('../id_generator/idGenerator')
const pool = require("../db/database");

module.exports = {
    insertQuestionPaper:(data,callBack)=>{
        pool.query(
            "INSERT INTO questionpaper (questionPaperId,paper,subjectId,generatedBy,collegeId) VALUES(?,?,?,?,?)",
            [
                data.id,
                JSON.stringify(data.data),
                data.subject,
                data.user,
                data.collegeId
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null,"inserted");
            }
        )
    },
    getAllQuestionPapers:(callBack)=>{
        pool.query(
            'SELECT qp.paper,qp.questionPaperId,qp.generatedAt,u.userDisplayName,u.userId,s.subjectId,s.subjectName,s.subjectScheme,s.subjectBranch FROM questionpaper as qp inner join users as u on u.userId = qp.generatedBy inner join subject as s on s.subjectId = qp.subjectId ORDER BY qp.generatedAt DESC',
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null,results);
            }
        )
    },
    getQuestionPaperById:(id, callBack)=>{
        pool.query(
            'SELECT qp.paper,qp.questionPaperId,u.userName,u.userId,s.subjectId,s.subjectName,s.subjectScheme FROM questionpaper as qp inner join users as u on u.userId = qp.generatedBy inner join subject as s on s.subjectId = qp.subjectId WHERE qp.questionPaperId = ?',
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null,results[0]);
            }
        )
    },
    getQuestionPaperCount:(byId,id,callBack)=>{
        var id = id ? id : null
        var query = byId ? 'SELECT count(*) as count FROM questionpaper WHERE generatedBy = ?' : "SELECT count(*) as count FROM questionpaper"
        pool.query(
            query,
            byId ? [
                id
            ]: [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null,results[0])
            }
        )
    }
}
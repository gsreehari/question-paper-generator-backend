const {questionId} = require('../id_generator/idGenerator')
const pool = require("../db/database");

module.exports = {
    insertQuestionPaper:(data,callBack)=>{
        pool.query(
            "INSERT INTO questionpaper (questionPaperId,paper,questionPaperCode,questionPaperSessional,subjectId,generatedBy,collegeId) VALUES(?,?,?,?,?,?,?)",
            [
                data.id,
                JSON.stringify(data.data),
                data.data.paperId,
                data.data.headerSection.headerDetails.sessional,
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
            `SELECT qp.paper,qp.questionPaperCode,qp.questionPaperSessional,qp.questionPaperId,qp.generatedAt,u.userDisplayName,u.userId,s.subjectId,s.subjectName,s.subjectScheme,branch.branchName,branch.branchDegree 
            FROM questionpaper as qp 
            INNER JOIN users as u on u.userId = qp.generatedBy 
            INNER JOIN subject as s on s.subjectId = qp.subjectId 
            INNER JOIN branch on s.subjectDepartment = branch.branchId
            ORDER BY qp.generatedAt DESC
            `,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null,results);
            }
        )
    },
    getAllQuestionPapersByCollege:(collegeId,callBack)=>{
        pool.query(
            `SELECT qp.paper,qp.questionPaperCode,qp.questionPaperSessional,qp.questionPaperId,qp.generatedAt,u.userDisplayName,u.userId,s.subjectId,s.subjectName,s.subjectScheme,branch.branchName,branch.branchDegree 
            FROM questionpaper as qp 
            INNER JOIN users as u on u.userId = qp.generatedBy 
            INNER JOIN subject as s on s.subjectId = qp.subjectId 
            INNER JOIN branch on s.subjectDepartment = branch.branchId
            WHERE qp.collegeId = ?
            ORDER BY qp.generatedAt DESC
            `,
            [collegeId],
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
            'SELECT qp.paper,qp.questionPaperCode,qp.questionPaperSessional,qp.questionPaperId,u.userName,u.userId,s.subjectId,s.subjectName,s.subjectScheme FROM questionpaper as qp inner join users as u on u.userId = qp.generatedBy inner join subject as s on s.subjectId = qp.subjectId WHERE qp.questionPaperId = ?',
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null,results[0]);
            }
        )
    },
    getQuestionPaperByUserId:(id, callBack)=>{
        pool.query(
            'SELECT qp.paper,qp.questionPaperCode,qp.questionPaperSessional,qp.questionPaperId,u.userName,u.userId,s.subjectId,s.subjectName,s.subjectScheme FROM questionpaper as qp inner join users as u on u.userId = qp.generatedBy inner join subject as s on s.subjectId = qp.subjectId WHERE u.userId = ?',
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null,results);
            }
        )
    },
    getQuestionPapersCount:(id,callBack)=>{
        var query = id != null ? 'SELECT count(*) as count FROM questionpaper WHERE generatedBy = ?' : 'SELECT count(*) as count FROM questionpaper'
        pool.query(
            query,
            id != null ? [id] : [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null,results[0])
            }
        )
    },
    
}
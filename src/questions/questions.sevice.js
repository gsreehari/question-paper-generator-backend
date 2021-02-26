const {questionId} = require('../id_generator/idGenerator')
const pool = require("../db/database");

module.exports = {
    insertQuestion:(data,callBack)=>{
        var qid = questionId();
        pool.query(
            'INSERT into question (questionId,question,questionImage,questionMarks) values(?,?,?,?)',
            [
                qid,
                data.question,
                data.file,
                data.questionmarks,
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                var unit = Number(data.unit)
                pool.query(
                    'INSERT into questionsmap (userId,questionId,subjectId,unit,collegeId) values(?,?,?,?,?)',
                    [
                        data.userId,
                        qid,
                        data.subjectId,
                        unit,
                        data.collegeId
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callBack(error);
                        }
                        return callBack(null,"");
                    }
                )
            }
        )
    },
    insertQuestionsFromExcel:(data,callBack)=>{
        var question = [];
        var questionmap = [];
        data.forEach(element => {
            var a = [];
            var b = [];
            var id = questionId();
            a.push(id)
            a.push(element[0])
            a.push(element[3])
            a.push(element[2])
            question.push(a)
            b.push(element[5])
            b.push(id)
            b.push(element[4])
            b.push(element[1])
            questionmap.push(b)
            const date = Date.now();
            let currentDate = null;
            do {
                currentDate = Date.now();
            } while (currentDate - date < 100);
        });
        pool.query(
            'INSERT into question (questionId,question,questionImage,questionMarks) values ?',
            [
                question
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                var unit = Number(data.unit)
                pool.query(
                    'INSERT into questionsmap (userId,questionId,subjectId,unit) values ?',
                    [
                        questionmap
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callBack(error);
                        }
                        return callBack(null,"");
                    }
                )
            }
        )
    },
    getAllQuestions:(callBack)=>{
        pool.query(
            'SELECT q.questionId,question,questionImage,subjectName,subjectUnits,unit,questionMarks,u.userDisplayName as addedBy,u.userId as addedById FROM questionsmap AS qm INNER JOIN question as q ON q.questionId = qm.questionId INNER JOIN subject as s ON s.subjectId = qm.subjectId INNER JOIN users as u ON u.userId = qm.userId ORDER BY q.questionCreated DESC',
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null,results);
            }
        )
    },
    getQuestions:(subject,units,callBack)=>{
        pool.query(
            'SELECT q.question,q.questionImage as image, qm.unit,q.questionMarks as marks FROM questionsmap as qm INNER JOIN question as q on q.questionId = qm.questionId WHERE qm.subjectId = ? AND qm.unit IN (?) ORDER BY qm.unit ASC,q.questionMarks ASC',
            [
                subject,
                units
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null,results)
            }
        )
    },
    getSubjectUnits:(subject,callBack)=>{
        pool.query(
            'SELECT subjectUnits as units FROM subject WHERE subjectId = ?',
            [
                subject,
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null,results[0])
            }
        )
    },
    getQuestionById:(id,callBack)=>{
        pool.query(
            'SELECT q.questionId,question,questionImage,qm.unit as unit,subjectName,subjectUnits,subjectScheme,unit,questionMarks,u.userDisplayName as addedBy,u.userId as addedById FROM questionsmap AS qm INNER JOIN question as q ON q.questionId = qm.questionId INNER JOIN subject as s ON s.subjectId = qm.subjectId INNER JOIN users as u ON u.userId = qm.userId WHERE q.questionId = ?',
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null,results[0]);
            }
        )
    },
    getQuestionsCount:(byId,data,callBack)=>{
        var id = data.id
        var query = byId ? 'SELECT count(*) as count FROM questionsmap WHERE userId = ?' : "SELECT count(*) as count FROM questionsmap"
        pool.query(
            query,
            byId ?[
                id
            ]: [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null,results[0])
            }
        )
    },
    updateQuestion:(data,callBack)=>{
        console.log(data);
        pool.query(
            'UPDATE question as q INNER JOIN questionsmap as qm on qm.questionId = q.questionId SET q.question=?,q.questionImage=?,q.questionmarks=?, qm.unit=? WHERE q.questionId=?',
            [
                data.question,
                data.questionImage,
                data.questionMarks,
                data.questionUnit,
                data.questionId
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                if(results){
                    module.exports.getQuestionById(data.questionId,(error,result)=>{
                        if(error){
                            return callBack(error);
                        }
                        console.log(result);
                        return callBack(null,result);
                    })
                }
            }
        )
    },
    deleteQuestion:(id,callBack)=>{
        pool.query(
            'DELETE FROM question where questionId = ? ',
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                module.exports.getAllQuestions((error,results)=>{
                    return callBack(null, results);
                })
            }
        )
    }
}
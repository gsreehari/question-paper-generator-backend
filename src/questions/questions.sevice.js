const { questionId } = require('../id_generator/idGenerator')
const pool = require("../db/database");

module.exports = {
    insertQuestion: (data, callBack) => {
        var qid = questionId();
        pool.query(
            'INSERT into question (questionId,question,questionImage,questionMarks,questionUnit) values(?,?,?,?,?)', [
                qid,
                data.question,
                data.file,
                data.questionmarks,
                Number(data.unit),
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                pool.query(
                    'INSERT into questionsmap (userId,questionId,subjectId,collegeId) values(?,?,?,?)', [
                        data.userId,
                        qid,
                        data.subjectId,
                        data.collegeId
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callBack(error);
                        }
                        return callBack(null, "");
                    }
                )
            }
        )
    },
    insertQuestionsFromExcel: (data, callBack) => {
        var question = [];
        var questionmap = [];
        data.forEach(element => {
            var a = [];
            var b = [];
            var id = questionId();
            a.push(id)
            a.push(element[0]) // question
            a.push(element[3]) // question image
            a.push(element[2]) // question marks
            a.push(element[1]) // unit
            question.push(a)
            b.push(element[4]) // userId
            b.push(id)
            b.push(element[5]) // subjectId
            b.push(element[6]) // college Id
            questionmap.push(b)
            const date = Date.now();
            let currentDate = null;
            do {
                currentDate = Date.now();
            } while (currentDate - date < 100);
        });
        console.log(questionmap)
        pool.query(
            'INSERT into question (questionId,question,questionImage,questionMarks,questionUnit) values ?', [
                question
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                pool.query(
                    'INSERT into questionsmap (userId,questionId,subjectId,collegeId) values ?', [
                        questionmap
                    ],
                    (error, results, fields) => {
                        if (error) {
                            console.log(error)
                            return callBack(error);
                        }
                        return callBack(null, "");
                    }
                )
            }
        )
    },
    getAllQuestions: (callBack) => {
        pool.query(
            'SELECT q.questionId, question, questionImage, subjectName, questionUnit, questionMarks, q.questionCount, u.userDisplayName as addedBy,u.userId as addedById FROM questionsmap AS qm INNER JOIN question as q ON q.questionId = qm.questionId INNER JOIN subject as s ON s.subjectId = qm.subjectId INNER JOIN users as u ON u.userId = qm.userId ORDER BY q.questionCreated DESC',
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    getAllQuestionsBySubject: (subjects, callBack) => {
        pool.query(
            'SELECT q.questionId,question,questionImage,subjectName,questionUnit,questionMarks, q.questionCount,u.userDisplayName as addedBy,u.userId as addedById FROM questionsmap AS qm INNER JOIN question as q ON q.questionId = qm.questionId INNER JOIN subject as s ON s.subjectId = qm.subjectId INNER JOIN users as u ON u.userId = qm.userId WHERE qm.subjectId IN (?) ORDER BY q.questionCreated DESC', [subjects],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    getQuestions: (subject, units, callBack) => {
        pool.query(
            'SELECT q.questionId, q.question,q.questionImage as image, q.questionUnit as unit, q.questionCount, q.questionMarks as marks FROM questionsmap as qm INNER JOIN question as q on q.questionId = qm.questionId WHERE qm.subjectId = ? AND q.questionUnit IN (?) AND (q.questionCount = 0 AND q.questionCompleted = 0) ORDER BY q.questionUnit ASC,q.questionMarks ASC', [
                subject,
                units
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    getSubjectUnits: (subject, callBack) => {
        pool.query(
            'SELECT subjectUnits as units FROM subject WHERE subjectId = ?', [
                subject,
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0])
            }
        )
    },
    getQuestionById: (id, callBack) => {
        pool.query(
            'SELECT q.questionId,question,questionImage,questionUnit as unit,subjectName,subjectUnits,subjectScheme,questionMarks,u.userDisplayName as addedBy,u.userId as addedById FROM questionsmap AS qm INNER JOIN question as q ON q.questionId = qm.questionId INNER JOIN subject as s ON s.subjectId = qm.subjectId INNER JOIN users as u ON u.userId = qm.userId WHERE q.questionId = ?', [id],
            (error, results, fields) => {
                if (error) {
                    console.log(error)
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    getQuestionsCount: (byId, data, callBack) => {
        var id = data.id
        var query = byId ? 'SELECT count(*) as count FROM questionsmap WHERE userId = ?' : "SELECT count(*) as count FROM questionsmap"
        pool.query(
            query,
            byId ? [
                id
            ] : [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results[0])
            }
        )
    },
    updateQuestion: (data, callBack) => {
        pool.query(
            'UPDATE question SET question=?, questionImage=?, questionMarks=?, questionUnit=? WHERE questionId=?', [
                data.question,
                data.questionImage,
                data.questionMarks,
                data.unit,
                data.questionId,
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                if (results) {
                    module.exports.getQuestionById(data.questionId, (error, result) => {
                        if (error) {
                            return callBack(error);
                        }
                        return callBack(null, result);
                    })
                }
            }
        )
    },
    updateQuestionCount: (data, callBack) => {
        pool.query(
            'UPDATE question SET questionCompleted=1 WHERE questionId IN(?)', [
                data
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    deleteQuestion: (id, callBack) => {
        pool.query(
            'DELETE FROM question where questionId = ? ', [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                module.exports.getAllQuestions((error, results) => {
                    return callBack(null, results);
                })
            }
        )
    }
}
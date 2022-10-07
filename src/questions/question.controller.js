const path = require('path');
const {
    insertQuestion,
    insertQuestionsFromExcel,
    getAllQuestions,
    deleteQuestion,
    getQuestionById,
    updateQuestion,
    getQuestionsCount,
    getAllQuestionsBySubject
} = require('./questions.sevice');

module.exports = {
    insertQuestion: (req, res) => {
        var body = req.body;
        if (req.file) {
            body.file = req.file.filename
        }
        insertQuestion(body, (error, results) => {
            if (error) {
                return res.status(500).json({
                    status: "error",
                    code: "DBCE",
                    message: "Database connection error",
                    error: error
                });
            }
            return res.json({
                status: "success",
                code: "QAS",
                message: "Question added"
            });
        })
    },
    insertQuestionsFromExcel: (req, res) => {
        var body = req.body;
        if (req.file) {
            body.file = req.file.filename
        }
        console.log(body)
        insertQuestionsFromExcel(body, (error, results) => {
            if (error) {
                return res.status(500).json({
                    status: "error",
                    code: "DBCE",
                    message: "Database connection error",
                    error: error
                });
            }
            return res.json({
                status: "success",
                code: "QAS",
                message: "Questions added"
            });
        })
    },
    getAllQuestions: (req, res) => {
        getAllQuestions((error, results) => {
            if (error) {
                return res.status(500).json({
                    status: "error",
                    code: "DBCE",
                    message: "Database connection error"
                });
            }
            return res.json({
                status: "success",
                data: results
            });
        })
    },
    getAllQuestionsBySubject: (req, res) => {
        const subjectsQuery = req.query.subjects
        const subjects = subjectsQuery.split(',')
        getAllQuestionsBySubject(subjects, (error, results) => {
            if (error) {
                return res.status(500).json({
                    status: "error",
                    code: "DBCE",
                    message: "Database connection error",
                    error: error
                });
            }
            return res.json({
                status: "success",
                data: results
            });
        })
    },
    getQuestionById: (req, res) => {
        var id = req.params.questionId;
        getQuestionById(id, (error, results) => {
            if (error) {
                return res.status(500).json({
                    status: "error",
                    code: "DBCE",
                    message: "Database connection error"
                });
            }
            if (results) {
                return res.json({
                    status: "success",
                    data: results
                });
            } else {
                return res.json({
                    status: "error",
                    message: "No questions found"
                });
            }
        });
    },
    getQuestionsCountByUser: (req, res) => {
        var id = req.params.userId;
        getQuestionsCount(true, { id }, (error, results) => {
            if (error) {
                return res.status(500).json({
                    status: "error",
                    code: "DBCE",
                    message: "Database connection error"
                });
            }
            return res.json({
                status: "success",
                data: results
            });
        })
    },
    getQuestionsCount: (req, res) => {
        getQuestionsCount(false, {}, (error, results) => {
            if (error) {
                return res.status(500).json({
                    status: "error",
                    code: "DBCE",
                    message: "Database connection error",
                    error: error
                });
            }
            return res.json({
                status: "success",
                data: results
            });
        })
    },
    updateQuestion: (req, res) => {
        var data = req.body;
        if (data.questionImage === "null") {
            data.questionImage = req.file ? req.file.filename : null;
        }
        updateQuestion(data, (error, results) => {
            if (error) {
                return res.status(500).json({
                    status: "error",
                    code: "DBCE",
                    error: error,
                    message: "Database connection error"
                });
            }
            if (results) {
                return res.json({
                    status: "success",
                    message: "Question updated",
                    data: results
                });
            } else {
                return res.json({
                    status: "error",
                    message: "Error"
                });
            }
        })
    },
    deleteQuestion: (req, res) => {
        var id = req.params.id
        deleteQuestion(id, (error, results) => {
            if (error) {
                return res.status(500).json({
                    status: "error",
                    code: "DBCE",
                    message: "Database connection error"
                });
            }
            return res.json({
                status: "success",
                data: results
            });
        })
    }
}
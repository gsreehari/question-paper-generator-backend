const router = require("express").Router();
const { checkToken } = require("../db/token_validator");
const { upload } = require('../fileupload/fileuploader');
const { 
    insertQuestion,
    insertQuestionsFromExcel,
    getAllQuestions,
    getAllQuestionsBySubject,
    deleteQuestion,
    getQuestionById,
    updateQuestion,
    getQuestionsCountByUser,
    getQuestionsCount
} = require('./question.controller')

const { generateQuestionPaper } = require('../questionpaper/questionpapergenerator')


// router.get("/upload", upload.single('file'),uploadfile);
router.get('/getAllQuestions',checkToken,getAllQuestions);
router.get('/getAllQuestionsBySubject',checkToken,getAllQuestionsBySubject);
router.get('/getQuestionById/:questionId',checkToken,getQuestionById);
router.get('/getQuestionsCountByUser/:userId',checkToken,getQuestionsCountByUser);
router.get('/getQuestionsCount',checkToken,getQuestionsCount);
router.post("/addQuestion", checkToken, upload.single('file'),insertQuestion);
router.post("/addQuestionFromExcel", checkToken,insertQuestionsFromExcel);
router.delete('/deleteQuestion/:id',checkToken,deleteQuestion)
router.patch('/updateQuestion',checkToken,upload.single('file'),updateQuestion)


module.exports = router;
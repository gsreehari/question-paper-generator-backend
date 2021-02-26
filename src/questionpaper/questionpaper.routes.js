const router = require("express").Router();
const { checkToken } = require("../db/token_validator");
const { 
    getAllQuestionPapers,
    getQuestionPaperById,
    getQuestionPaperCount
} = require('./questionpaper.controller')

const { generateQuestionPaper } = require('./questionpapergenerator')

router.get('/generate',checkToken,generateQuestionPaper)
router.get('/getAllQuestionPapers',checkToken,getAllQuestionPapers)
router.get('/getQuestionPaperById/:questionPaperId',checkToken,getQuestionPaperById)
router.get('/getQuestionPaperCount/:userId',checkToken,getQuestionPaperCount)


module.exports = router;
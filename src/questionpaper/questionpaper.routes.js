const router = require("express").Router();
const { checkToken } = require("../db/token_validator");
const { 
    getAllQuestionPapers,
    getQuestionPaperById,
    getAllQuestionPapersByCollege,
    getQuestionPaperCount,
    getQuestionPaperByUserId,
    getQuestionPapersCount,
    
} = require('./questionpaper.controller')

const { generateQuestionPaper } = require('./questionpapergenerator')

router.get('/generate',checkToken,generateQuestionPaper)
router.get('/getAllQuestionPapers',checkToken,getAllQuestionPapers)
router.get('/getAllQuestionPapersByCollege/:collegeId',checkToken,getAllQuestionPapersByCollege)
router.get('/getQuestionPaperById/:questionPaperId',checkToken,getQuestionPaperById)
router.get('/getQuestionPaperByUserId/:userId',checkToken,getQuestionPaperByUserId)
router.get('/getQuestionPaperCountByUser/:userId',checkToken,getQuestionPapersCount)
router.get('/getQuestionPapersCount',checkToken,getQuestionPapersCount)



module.exports = router;
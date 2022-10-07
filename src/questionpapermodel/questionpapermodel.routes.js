const router = require("express").Router();
const { checkToken } = require("../db/token_validator");
const {
    getQuestionPaperModel
} = require('./questionpapermodel.controller')

router.get('/getQuestionPaperModel/:collegeId',checkToken,getQuestionPaperModel)

// router.get('/generate',checkToken,generateQuestionPaper)
// router.get('/getAllQuestionPapers',checkToken,getAllQuestionPapers)
// router.get('/getQuestionPaperById/:questionPaperId',checkToken,getQuestionPaperById)
// router.get('/getQuestionPaperByUserId/:userId',checkToken,getQuestionPaperByUserId)
// router.get('/getQuestionPaperCount/:userId',checkToken,getQuestionPaperCount)


module.exports = router;
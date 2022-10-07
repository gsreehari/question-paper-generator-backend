const {
    getQuestionPaperModel
} = require('./questionpapermodel.service')

module.exports = {
    getQuestionPaperModel:(req,res)=>{
        let collegeId = req.params.collegeId
        getQuestionPaperModel(collegeId,(error,results)=>{
            if(error){
                return res.status(500).json({
                    status:"error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:error
                });
            }
            return res.json({
                status:"success",
                data:result,
            });
        })
    } 
}
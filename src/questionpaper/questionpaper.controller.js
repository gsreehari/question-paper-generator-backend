const {
    insertQuestionPaper,
    getAllQuestionPapers,
    getQuestionPaperById,
    getQuestionPaperCount
} = require('./questionpaper.service');


module.exports = {
    insertQuestionPaper:(data,callBack)=>{
        insertQuestionPaper(data,(error,res)=>{
            if(error){
                return callBack(error);
            }
            return callBack(null,res);
        })
    },  
    getAllQuestionPapers:(req,res)=>{
        getAllQuestionPapers((error,results)=>{
            if(error){
                return res.status(500).json({
                    status:"error",
                    code:"DBCE",
                    message: "Database connection error"
                });
            }
            return res.json({
                status:"success",
                data:results,
            });
        })
    },
    getQuestionPaperById:(req,res)=>{
        var id = req.params.questionPaperId;
        getQuestionPaperById(id,(error,results)=>{
            if(error){
                return res.status(500).json({
                    status:"error",
                    code:"DBCE",
                    message: "Database connection error"
                });  
            }
            if(results){
                return res.json({
                    status:"success",
                    data: results
                });
            }else{
                return res.json({
                    status:"error",
                    message: "No question papers found"
                });  
            }
        })
    },
    getQuestionPaperCount:(req,res)=>{
        var id = req.params.userId !== "null" ? req.params.userId : null
        var byid = req.params.userId !== "null" ? true : false
        getQuestionPaperCount(byid,id,(error,result)=>{
            if(error){
                return res.status(500).json({
                    status:"error",
                    code:"DBCE",
                    message: "Database connection error"
                });
            }
            return res.json({
                status:"success",
                data:result,
            });
        })
    }
}
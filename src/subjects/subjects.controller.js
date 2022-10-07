const {
    getAllSubjects,
    getAllSubjectsByCollege,
    creteSubject,
    getSubjectById,
    deleteSubject,
    getSubjectsByUserId,
    updateSubject,
    getSubjectsCount,
    getSubjectsCountByBranch
} = require("./subjects.service");

module.exports = {
    getSubjects:(req,res)=>{
        getAllSubjects((err, results) => {
            if (err) {
                return res.status(500).json({
                    status : "error",
                    message: "database error",
                    error:err
                });
            }
            return res.json({
                status : "success",
                data: results
            });
        });
    },
    getAllSubjectsByCollege:(req,res)=>{
        getAllSubjectsByCollege(req.params.collegeId,(err, results) => {
            if (err) {
                return res.status(500).json({
                    status : "error",
                    message: "database error",
                    error:err
                });
            }
            return res.json({
                status : "success",
                data: results
            });
        });
    },
    getSubjectById:(req,res)=>{
        const id = req.params.id;
        getSubjectById(id,(err, results) => {
            if (err) {
                return res.status(500).json({
                    status : "error",
                    message: "database error",
                    error:err
                });
            }
            return res.json({
                status : "success",
                data: results,
            });
        });
    },
    getSubjectsCountByBranch:(req,res)=>{
        getSubjectsCountByBranch((error,results)=>{
            if (error) {
                return res.status(500).json({
                    status:"error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:error
                });
            }
            return res.json({
                status:"success",
                data: results
            });
        })
    },
    getSubjectsByUserId:(req,res)=>{
        const id = req.params.userId;
        getSubjectsByUserId(id,(error,results)=>{
            if (error) {
                return res.status(500).json({
                    status : "error",
                    message: "database error",
                    error:error
                });
            }
            return res.json({
                status : "success",
                data: results,
            });
        })
    },
    getSubjectsCount:(req,res)=>{
        getSubjectsCount((error, results)=>{
            if (error) {
                return res.status(500).json({
                    status:"error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:error
                });
            }
            return res.json({
                status:"success",
                data: results
            });
        })
    },
    createSubject:(req,res)=>{
        const body = req.body;
        creteSubject(body, (err, results) => {
            if (err) {
                return res.status(500).json({
                    status : "error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:err
                });
            }
            return res.status(200).json({
                status:"success",
                code:"SIS",
                data: results
            });
        });
    },
    updateSubject:(req,res)=>{
        updateSubject(req.body,(error,results)=>{
            if (error) {
                return res.status(500).json({
                    status : "error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:error
                });
            }
            return res.status(200).json({
                status:"success",
                data: results
            });
        })
    },
    deleteSubject:(req,res)=>{
        var id = req.params.id
        deleteSubject(id,(error,results)=>{
            if(error){
                return res.status(500).json({
                    status : "error",
                    code:"DBCE",
                    message: "Database connection error",
                    error:error
                });
            }
            return res.json({
                status : "success",
                data: results
            });
        })
    },
}
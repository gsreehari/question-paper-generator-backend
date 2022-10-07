const pool = require("../db/database");

module.exports = {
    createLog:(req,res)=>{
        let today = new Date();
        let logUser = req.decoded.result.userId
        let logOriginalUrl = req.originalUrl
        let logMethod = req.method
        let table = req.databaseTable
        let logText = `user ${logUser} performed ${logMethod} method on ${table} at ${today.toLocaleString()}`
        let logOrigin = req.headers.origin

        pool.query(
            'INSERT INTO logger (logText,logMethod,logUrl,logUser,logHost) values(?,?,?,?,?)',
            [
                logText,
                logMethod,
                logOriginalUrl,
                logUser,
                logOrigin
            ],
            (error, results)=>{
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
                    data: req.databaseResults
                });
            }
        )
    }
} 
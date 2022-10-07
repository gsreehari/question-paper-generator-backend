const pool = require("../db/database");

module.exports = {
    getQuestionPaperModel:(collegeId,callBack)=>{
        pool.query(
            `SELECT * FROM questionpapermodel as qpm WHERE qpm.collegeId = ?`
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null,results[0]);
            }
        )
    }
}
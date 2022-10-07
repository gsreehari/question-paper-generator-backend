const pool = require("../db/database");

module.exports={
    createBranch:(data,callBack)=>{
        pool.query(
            'INSERT INTO branch (branchName,branchDegree) values(?,?)',
            [
                data.branchName,
                data.branchDegree
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },

    getBranches:(callBack)=>{
        pool.query(
            'SELECT * FROM branch',
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                results = results.reduce(function (r, a) {
                    r[a.branchDegree] = r[a.branchDegree] || [];
                    r[a.branchDegree].push(a);
                    return r;
                }, Object.create(null))
                results = Object.entries(results)
                return callBack(null, results);
            }
        )
    }
}
const {
    createBranch,
    getBranches
} = require('./branch.service')

module.exports={
    createBranch:(req,res)=>{
        const body = req.body;
        createBranch(body, (error, results) => {
            if (error) {
                return res.status(500).json({
                    status : "error",
                    message: "Internal server error",
                    error:error
                });
            }
            return res.status(200).json({
                status:"success",
                message:"Branch added",
                data: results
            });
        });
    },  
    getBranches:(req,res)=>{
        const body = req.body;
        getBranches((error, results) => {
            if (error) {
                return res.status(500).json({
                    status : "error",
                    message: "Internal server error",
                    error:error
                });
            }
            return res.status(200).json({
                status:"success",
                data: results
            });
        })
    }
}
const jwt = require("jsonwebtoken");
module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            // Remove Bearer from string
            token = token.slice(7);
            jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
                if (err) {
                    return res.json({
                        status:"fail",
                        code: "IT",
                        message: "Invalid Token..."
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.json({
                status:"fail",
                code:"AD",
                message: "Access Denied! Unauthorized User"
            });
        }
    },
};
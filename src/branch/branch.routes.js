const router = require("express").Router();
const { checkToken } = require("../db/token_validator");
const {
    createBranch,
    getBranches
} = require('./branch.controller');

router.get("/getBranches", checkToken, getBranches);
router.post("/createBranch", checkToken, createBranch);


module.exports = router;
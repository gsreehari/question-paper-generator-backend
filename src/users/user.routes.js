
const router = require("express").Router();
const { checkToken } = require("../db/token_validator");
const {
    createUser,
    login,
    getUserByUserId,
    getUsers,
    updateUsersStatus,
    deleteUser,
    checkUserToken,
    getFacultyUsers,
    getUsersCount
} = require("./user.controller");
router.get("/getUsers", checkToken, getUsers);
router.get("/authenticateUser", checkToken, checkUserToken);
router.get("/getFacultyNames", checkToken, getFacultyUsers);
router.get("/getUser/:id", checkToken, getUserByUserId);
router.get("/getUsersCount", checkToken, getUsersCount);
router.post("/createUser", checkToken, createUser);
router.post("/login", login);
router.patch("/updateUsersStatus", checkToken, updateUsersStatus);
router.delete("/deleteUser", checkToken, deleteUser);

module.exports = router;
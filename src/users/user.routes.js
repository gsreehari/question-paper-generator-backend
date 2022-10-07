
const router = require("express").Router();
const { checkToken } = require("../db/token_validator");
const { profilePicupload } = require('../fileupload/fileuploader');
const { createLog } = require('../logger/logger')
const {
    createUser,
    login,
    getUserByUserId,
    getUsers,
    getUsersByCollege,
    updateUsersStatus,
    deleteUser,
    checkUserToken,
    getFacultyUsers,
    getUsersCount,
    updateUserProfilePic,
    getUsersCountByRoles,
    updateUserRoles,
    getFacultyByBranch
} = require("./user.controller");


router.get("/getUsers", checkToken, getUsers, createLog);
router.get("/getUsersByCollege/:collegeId", checkToken, getUsersByCollege, createLog);
router.get("/authenticateUser", checkToken, checkUserToken);
router.get("/getFacultyNames", checkToken, getFacultyUsers, createLog);
router.get("/getFacultyByBranch/:collegeId&:branchId", checkToken, getFacultyByBranch, createLog);
router.get("/getUser/:id", checkToken, getUserByUserId, createLog);
router.get("/getUsersCount", checkToken, getUsersCount, createLog);
router.get("/getUsersCountByRoles", checkToken, getUsersCountByRoles, createLog);
router.post("/createUser", createUser, createLog);
router.post("/login", login);
router.patch("/updateUsersStatus", checkToken, updateUsersStatus, createLog);
router.patch("/updateUserRoles", checkToken, updateUserRoles, createLog);
router.patch("/updateUserProfilePic", checkToken, profilePicupload.single('file'),updateUserProfilePic, createLog);
router.delete("/deleteUser/:id", checkToken, deleteUser, createLog);

module.exports = router;
const router = require("express").Router();
const { checkToken } = require("../db/token_validator");
const {
    getSubjects,
    getAllSubjectsByCollege,
    createSubject,
    getSubjectById,
    deleteSubject,
    getSubjectsByUserId,
    updateSubject,
    getSubjectsCountByBranch,
    getSubjectsCount
} = require("./subjects.controller");

router.get("/getSubjects", checkToken, getSubjects);
router.get("/getAllSubjectsByCollege/:collegeId", checkToken, getAllSubjectsByCollege);
router.get("/getSubjectsCount", checkToken, getSubjectsCount);
router.get("/getSubjectsCountByBranch", checkToken, getSubjectsCountByBranch);
router.get("/subject/:id", checkToken, getSubjectById);
router.get("/getSubjectByUserId/:userId", checkToken, getSubjectsByUserId);
router.post("/createSubject", checkToken, createSubject);
router.patch("/updateSubject", checkToken, updateSubject);
router.delete("/deleteSubject/:id", checkToken, deleteSubject);


module.exports = router;
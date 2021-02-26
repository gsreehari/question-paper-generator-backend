const router = require("express").Router();
const { checkToken } = require("../db/token_validator");
const {
    getSubjects,
    createSubject,
    getSubjectById,
    deleteSubject,
    getSubjectsByUserId,
    updateSubject,
    getSubjectsCount
} = require("./subjects.controller");

router.get("/getSubjects", checkToken, getSubjects);
router.get("/getSubjectsCount", checkToken, getSubjectsCount);
router.get("/subject/:id", checkToken, getSubjectById);
router.get("/getSubjectByUserId/:userId", checkToken, getSubjectsByUserId);
router.post("/createSubject", checkToken, createSubject);
router.patch("/updateSubject", checkToken, updateSubject);
router.delete("/deleteSubject/:id", checkToken, deleteSubject);


module.exports = router;
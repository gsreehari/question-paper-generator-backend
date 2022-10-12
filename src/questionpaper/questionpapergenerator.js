const fs = require('fs');
const path = require("path");
const pool = require("../db/database");
const {
    getSubjectUnits,
    getQuestions,
    updateQuestionCount
} = require('../questions/questions.sevice')
const {
    insertQuestionPaper
} = require('./questionpaper.controller')

const { questionPaperId } = require('../id_generator/idGenerator')
const { romanToInt } = require('./conversion')

module.exports = {
    generateQuestionPaper: (req, res) => {
        var reqQuery = req.query;
        const fullPath = path.join(__dirname, '../../paper models/GPREC-papermodel.json');
        fs.readFile(fullPath, (err, data) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    code: "NQM",
                    message: "Question paper model not found",
                    error: err
                });
            };
            let modelpaper = JSON.parse(data);
            var id = questionPaperId();
            var paper = reqQuery.type === "first internal" || reqQuery.type === "second internal" ? modelpaper.model[`scheme20${reqQuery.scheme}`].internal : modelpaper.model[`scheme20${reqQuery.scheme}`].external;

            paper.paperId = reqQuery.type === "external" ? `${reqQuery.scheme.slice(-2)}${romanToInt(reqQuery.sem)} ${reqQuery.subjectType.toUpperCase()} ${reqQuery.subjectCode.slice(-2)}` : ""
            paper.id = id;
            module.exports.generate(paper, reqQuery, (error, data) => {
                if (error) {
                    return res.json({
                        status: "fail",
                        message: error
                    })
                }
                insertQuestionPaper({ id, data, subject: reqQuery.subject.split('|')[1], user: reqQuery.user, collegeId: reqQuery.collegeId }, (error, result) => {
                    if (error) {
                        return res.json({
                            status: "fail",
                            message: error
                        })
                    }
                    return res.json({ status: "success", data })
                })
            });
        });
    },

    generate: async(paper, reqQuery, callBack) => {
        var header = paper.headerSection.headerDetails
        var sem = reqQuery.sem;

        header.subject = `${reqQuery.subject.split('|')[0]} (${reqQuery.subject.split('|')[2]})`
        header.department = `Department of ${reqQuery.branch}`
        header.sessional = `${reqQuery.type} examinations`
        header.examDetails = `${reqQuery.degree} ${sem} semister`
        header.scheme = `(scheme-${reqQuery.scheme})`

        paper.headerSection.examDetails.date = reqQuery.date;

        // paper.header = header;
        var qarray = {};
        var q;
        var totalUnits;
        getSubjectUnits(reqQuery.subject.split('|')[1], (error, res) => {
            if (error) {
                return callBack(error, null);
            }
            totalUnits = res.units;
            var unitsarray = reqQuery.type === "first internal" ? Array.from({ length: Math.ceil(totalUnits / 2) }, (v, k) => k + 1) : reqQuery.type === "second internal" ? Array.from({ length: Math.ceil(totalUnits / 2) }, (v, k) => Math.ceil(totalUnits / 2) + (k + 1)) : Array.from({ length: totalUnits + 1 }, (v, k) => k + 1)
            var isExternal = reqQuery.type === "external" ? true : false;
            getQuestions(reqQuery.subject.split('|')[1], unitsarray, (error, data) => {
                if (error) {
                    return callBack(error, null);
                }

                if (data.length == 0) {
                    return callBack("No questions", null);
                }


                for (let i = unitsarray[0]; i < unitsarray.length + unitsarray[0]; i++) {
                    var a = data.filter(item => item.unit === i);
                    var b = {}
                    if (isExternal) {
                        for (let j = 1; j < 11; j++) {
                            if (i > Math.ceil(totalUnits / 2) && i < Math.ceil(totalUnits / 2) + 2) {
                                a.filter(item => item.marks === j).forEach(item => {
                                    qarray[`unit${i - 1}`][`${j}marks`].push(item)
                                })

                                continue;
                            } else {
                                b[`${j}marks`] = a.filter(item => item.marks === j);
                            }
                        }
                        if (i > Math.ceil(totalUnits / 2) + 1) {
                            qarray[`unit${i - 1}`] = b;
                        } else {
                            qarray[`unit${i}`] = b;
                        }
                    } else {
                        for (let j = 1; j < 11; j++) {
                            b[`${j}marks`] = a.filter(item => item.marks === j);
                        }
                        qarray[`unit${i}`] = b;
                    }
                }

                // return callBack(null,qarray);
                let selectedQuestions = []
                var unit = reqQuery.type === "first internal" ? 1 : reqQuery.type === "second internal" ? Math.ceil(totalUnits / 2) + 1 : 1;

                try {
                    for (let i = 0; i < paper.questionsSection.sections.length; i++) {
                        var section = paper.questionsSection.sections[i];
                        var marksquestions = [];
                        if (section.type === "all") {
                            for (let j = unit; j < section.count + unit; j++) {
                                q = qarray[`unit${j}`][`${section.marks}marks`];
                                let selectedQuestion = q[Math.floor(Math.random() * q.length)]
                                if (selectedQuestion == null) {
                                    return callBack("cannot find questions");
                                }
                                marksquestions.push(selectedQuestion)
                                selectedQuestions.push(selectedQuestion)
                            }
                        } else if (section.type === "or") {
                            var mlist = section.marksList;
                            var smarks = section.marks;
                            for (let i = 0; i < 2; i++) {
                                while (true) {
                                    var sublist = [];
                                    var rmark = mlist[Math.floor(Math.random() * mlist.length)];
                                    var next = smarks - rmark;
                                    try {
                                        if (next === 0 && qarray[`unit${unit}`][`${rmark}marks`].length > 0) {
                                            q = qarray[`unit${unit}`][`${rmark}marks`];
                                            var num = Math.floor(Math.random() * q.length);
                                            if (q[num] == null) {
                                                return callBack("cannot find questions");
                                            }
                                            sublist.push(q[num])
                                            q.splice(num, 1);
                                            break;
                                        } else if (next !== 0) {
                                            if (qarray[`unit${unit}`][`${rmark}marks`].length !== 0 && qarray[`unit${unit}`][`${next}marks`].length !== 0) {
                                                q = qarray[`unit${unit}`][`${rmark}marks`];
                                                var num = Math.floor(Math.random() * q.length)
                                                if (q[num] == null) {
                                                    return callBack("cannot find questions");
                                                }
                                                sublist.push(q[num])
                                                q.splice(num, 1);

                                                q = qarray[`unit${unit}`][`${next}marks`];
                                                num = Math.floor(Math.random() * q.length)
                                                if (q[num] == null) {
                                                    return callBack("cannot find questions");
                                                }
                                                sublist.push(q[num])
                                                q.splice(num, 1);
                                                break;
                                            }
                                        }
                                    } catch (error) {
                                        return callBack("cannot find questions", null)
                                    }

                                }
                                marksquestions.push(sublist);
                                sublist.forEach((item) => {
                                    selectedQuestions.push(item)
                                })
                            }
                            unit++;
                        }
                        section['data'] = marksquestions;
                    }
                } catch (error) {
                    return callBack(error, null)
                }

                selectedQuestions = selectedQuestions.map((item) => {
                    return item ? item.questionId : null
                })

                updateQuestionCount(selectedQuestions, (error, results) => {
                    if (error) {
                        return callBack(error);
                    }
                    return callBack(null, paper);
                })

            })
        })
    },
}
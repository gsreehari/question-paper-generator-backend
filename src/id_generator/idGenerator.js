
module.exports = {
    userId : (clg,count)=>{
        var date = new Date();
        var dt = date.getTime();
        var year = date.getFullYear();
        year = `${year.toString().split('')[2]}${year.toString().split('')[3]}`
        var uid = `${year}${clg}${count+1}`
        return uid;
    },

    subjectId: ()=>{
        var date = new Date();
        var dt = date.getTime();
        var uuid = `xyxxyxxxxy`.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    },

    collegeId : (s)=>{
        return Math.floor(Math.random()*90000) + 10000;
    },
    questionId : ()=>{
        return String.fromCharCode(65 + Math.floor(Math.random() * 26))  + Date.now()
    },

    questionPaperId: ()=>{
        return Date.now()
    },

    branchId: (id)=>{
        return id+Date.now()
    },
}

module.exports = {
    userId : ()=>{
        var date = new Date();
        var dt = date.getTime();
        var uuid = `xxxxyxxxxxxxyxxx${date.getMonth()}${date.getFullYear()}`.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
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
        return s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)  //1766210230
    },
    questionId : ()=>{
        return String.fromCharCode(65 + Math.floor(Math.random() * 26))  + Date.now()
    },

    questionPaperId: ()=>{
        return Date.now()
    },

}
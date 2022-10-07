const nodemailer = require('nodemailer');

// <---------------- NODE MAILER  ----------------------->

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: "qpgo.service@gmail.com",
        pass: "rjgtzxmaymhhodhy"
    }
});

// <---------------- END NODE MAILER  ----------------------->


module.exports = {
    mailer : (data, callBack)=>{
        message = {
            from: "qpgo.service@gmail.com",
            to: data.email,
            subject: data.subject,
            html: data.message
        }
    
        transporter.sendMail(message, (err, info) => {
            if (err) {
                return callBack(err)
            } else {
                return callBack(null,info)
            }
        })
    }
}
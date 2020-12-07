const sgMail=require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeemail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'chiranjivee960@gmail.com',
        subject:'Thanks for joining in',
        text:`Welcome to the app,${name},Let me know about how u get along with the app`

    })
}

const sendgoingemail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'chiranjivee960@gmail.com',
        subject:'Thanks for joining in',
        text:`Goodbye from the app,${name},Let me know about how u get along with the app`

    })
}


module.exports={
    sendWelcomeemail,
    sendgoingemail
}
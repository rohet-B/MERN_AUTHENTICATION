import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // Here we will use brevo SMTP not google SMTP. Therefore go to brevo website

    host:process.env.SMTP_SERVER,
    port:587,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS,
    }
    // Now go to authController.js file and go to register function 
});

export default transporter;
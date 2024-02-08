import nodemailer from "nodemailer";

export function sendEmailText(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "clumbaeshop@gmail.com",
            pass: "xdej fxbw gslo iwnt",
        },
    });

    const mailOptions = {
        from: "clumbaeshop@gmail.com",
        to: [to],
        subject: subject,
        text: text
    };

    transporter
        .sendMail(mailOptions)
        .then((info) => {
            console.log("Email sent from sendEmailText:", info.response);
        })
        .catch((error) => {
            console.error("Error sending email from sendEmailText::", error);
        });
}
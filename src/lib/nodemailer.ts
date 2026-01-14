import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.APP_EMAIL || "lsobarexamteam@gmail.com",
        pass : process.env.APP_PASSWORD,
    }
});

export default transport;
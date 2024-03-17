var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "huy612739@gmail.com",
        pass: "huyga2k1",
    },
});
module.exports = transporter;
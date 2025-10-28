const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/user-model");
const Company = require("../models/company-model");

router.post("/", async (req, res) => {
  const { userEmail, companyId } = req.body;
  const companyDets = await Company.findOne({ _id : companyId })
  const companyEmail = companyDets.companyEmail ;

  const findUser = await User.findOne({ userEmail, userCompany: companyId });
  const password = findUser.userPassword;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "blinderspeaky1995@gmail.com",
      pass: "zsif luhl wvkc kphh",
    },
  });

  const mailOptions = {
    from: "YashXOdoo <blinderspeaky1995@gmail.com>",
    to: userEmail,
    subject: "Security Password for Your Account",
    text: "This is your Security password and Password Respectively. Please click on 'Forgot Password' on the login page, then use this password as your current password and enter a new password to confirm the change.",
    html: `
          <p><b>This is your Security password. ${password} , use the company email if required (${companyEmail}).</b></p>
          <p>Please click on <b>'Forgot Password'</b> on the login page, then use this password as your <b>current password</b> and enter a new password to confirm the change.</p>
          <br>
          <p>Thank you,<br>Team YashXOdoo</p>
      `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return res.send({ msg: "Sent" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return res.send({ msg: "Error" });
  }
});

module.exports = router;

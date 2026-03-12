import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
   host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, 
  auth: {

    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export const sendVerificationEmail = async (email, token) => {

  const verifyURL = `${process.env.BASE_URL}/api/auth/verify-email/${token}`

  const html = `
  <div style="font-family:Arial;padding:20px">

    <h2>Welcome to Houseofavo</h2>

    <p>Please verify your email address.</p>

    <a href="${verifyURL}" 
    style="
    padding:12px 20px;
    background:#4CAF50;
    color:white;
    text-decoration:none;
    border-radius:6px;
    font-weight:bold;
    ">
      Verify Email
    </a>

    <p>If button doesn't work copy this link:</p>

    <p>${verifyURL}</p>

  </div>
  `

  await transporter.sendMail({
    from: `"Houseofavo" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email",
    html
  })
}
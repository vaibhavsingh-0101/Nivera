import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email, token) => {

  const verifyURL = `${process.env.BASE_URL}/api/v1/auth/verify-email/${token}`

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
    font-weight:bold;">
      Verify Email
    </a>

    <p>If button doesn't work copy this link:</p>

    <p>${verifyURL}</p>
  </div>
  `

  await resend.emails.send({
    from: "Houseofavo <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email",
    html: html
  })
}
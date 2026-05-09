import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

<<<<<<< HEAD
const FROM = "Houseofavo <onboarding@resend.dev>"

export const sendVerificationEmail = async (email, token) => {
  const verifyURL = `${process.env.BASE_URL}/api/v1/auth/verify-email/${token}`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your email — Houseofavo",
    html: `
      <div style="font-family:Arial;padding:20px;max-width:500px">
        <h2>Welcome to Houseofavo</h2>
        <p>Please verify your email address to get started.</p>
        <a href="${verifyURL}" style="display:inline-block;padding:12px 24px;background:#4CAF50;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">
          Verify Email
        </a>
        <p style="margin-top:16px;color:#666;font-size:13px">Link expires in 10 minutes.<br>${verifyURL}</p>
      </div>
    `
  })
}


export const sendApplicationEmail = async (workerEmail, jobTitle, companyName) => {
  await resend.emails.send({
    from: FROM,
    to: workerEmail,
    subject: `Application received — ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family:Arial;padding:20px;max-width:500px">
        <h2>Application received!</h2>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been received.</p>
        <p>We'll notify you when the employer reviews your application.</p>
      </div>
    `
  })
}


export const sendStatusUpdateEmail = async (workerEmail, jobTitle, status) => {
  const messages = {
    viewed: "Your application has been viewed by the employer.",
    shortlisted: "Great news! You've been shortlisted for this role.",
    rejected: "Unfortunately your application was not selected at this time.",
    hired: "Congratulations! You've been selected for this role!"
  }

  await resend.emails.send({
    from: FROM,
    to: workerEmail,
    subject: `Application update — ${jobTitle}`,
    html: `
      <div style="font-family:Arial;padding:20px;max-width:500px">
        <h2>Application update</h2>
        <p>${messages[status] || `Your application status changed to: ${status}`}</p>
      </div>
    `
=======
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
>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
  })
}
import twilio from "twilio"

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export const sendPhoneOTP = async (phone) => {
  const verification = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_ID)
    .verifications.create({ to: phone, channel: "sms" })
  return verification
}

export const verifyPhoneOTP = async (phone, code) => {
  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_ID)
      .verificationChecks.create({ to: phone, code })
    return check.status === "approved"
  } catch {
    return false
  }
}
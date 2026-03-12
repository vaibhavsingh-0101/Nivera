import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// SEND OTP
export const sendPhoneOTP = async (phone) => {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_ID)
      .verifications.create({
        to: phone,          
        channel: "sms"
      });

    return verification;
  } catch (error) {
    console.error("Twilio send OTP error:", error.message);
    throw new Error("Failed to send phone OTP");
  }
};

// VERIFY OTP
export const verifyPhoneOTP = async (phone, code) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_ID)
      .verificationChecks.create({
        to: phone,
        code: code
      });

    return verificationCheck.status === "approved";
  } catch (error) {
    console.error("OTP verification error:", error.message);
    return false;
  }
};
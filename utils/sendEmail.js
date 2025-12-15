const SibApiV3Sdk = require('sib-api-v3-sdk');

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SMTP;

const emailAPI = new SibApiV3Sdk.TransactionalEmailsApi();

const sendResetEmail = async (userEmail) => {
  try {
    const resetLink = "http://localhost:3000/resetpassword";

    const message = {
      to: [
        {
          email: userEmail,
          name: "User"
        }
      ],
      sender: {
        name: "Harshitha",
        email: process.env.SENDER_EMAIL 
      },
      subject: "Password Reset Link",
      htmlContent: `
        <p>Hello,</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `
    };

    const response = await emailAPI.sendTransacEmail(message);

    console.log("Reset email sent:", response);
    return response;

  } catch (err) {
    console.error("Error sending email:");
    console.error(err.response?.body || err.message);
    throw err;
  }
};


module.exports = sendResetEmail;
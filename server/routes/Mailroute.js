import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();
const MailRouter = express.Router();

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});


MailRouter.post("/send-email", async (req, res) => {
  const { ownerUid, senderEmail, itemDetails, title } = req.body;

  try {
    // Fetch the owner's email from Firebase Auth
    const ownerRecord = await admin.auth().getUser(ownerUid);
    const ownerEmail = ownerRecord.email;

    
    const mailOptions = {
      from: senderEmail, 
      to: ownerEmail, 
      subject: `Lost & Found: Inquiry about "${title}"`,
      text: `Dear User,

              We hope this message finds you well.

              We are reaching out regarding a report submitted to our Lost & Found system about an item that may match something you’ve reported as missing.

              Item Details:
              ${itemDetails}

              If this item seems to be yours, we kindly ask you to get in touch with the person who found it to confirm ownership and arrange for its return.

              Please reply directly to the following email address to proceed:
              ${senderEmail}

              In your response, please include any relevant identifying details that can help verify the item belongs to you (e.g., serial number, custom stickers, or other unique characteristics).

              Thank you for using our Lost & Found service.

              Best regards,
              Lost & Found Support Team
              ReturnIt`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default MailRouter;
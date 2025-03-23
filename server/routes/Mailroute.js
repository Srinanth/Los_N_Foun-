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
      text: `Hello, I'm interested in your item:\n\n${itemDetails}\n\nPlease reply to: ${senderEmail}.`,
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
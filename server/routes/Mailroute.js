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

👋 We hope this message finds you well.

We are reaching out through our Lost & Found service regarding an item that may match something you’ve reported as missing.

📦 Item Details:
${itemDetails}

If this item appears to be yours, we kindly request you to contact the person who found it in order to verify ownership and arrange for its return.

📧 Please reply directly to the following email address:
${senderEmail}

To help confirm ownership, please include any identifying details you may have (e.g., serial number, stickers, scratches, or unique features).

🙏 We appreciate your cooperation and hope you’re reunited with your lost item soon.

Warm regards,  
Lost & Found Support Team  
🔁 ReturnIt
`,
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
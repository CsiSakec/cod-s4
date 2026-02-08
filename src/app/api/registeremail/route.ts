import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  // Receive exactly what the frontend sends
  const { to, subject, html, qrCodeBase64 } = await request.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const attachments = [];

  if (qrCodeBase64) {
    // This cleans the Base64 string so Nodemailer can read it
    const base64Content = qrCodeBase64.split(",")[1]; 
    
    attachments.push({
      filename: "event-qr.png",
      content: base64Content,
      encoding: "base64",
      cid: "qr-code" // This matches the 'src' in your frontend HTML
    });
  }

  const mailOptions = {
    from: `"CSI-SAKEC TEAM" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html, // We send your HTML exactly as it came from the frontend
    attachments, 
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
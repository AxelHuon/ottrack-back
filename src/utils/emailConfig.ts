import * as process from 'node:process';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
});

export default transporter;

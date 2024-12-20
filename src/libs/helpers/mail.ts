import { HttpStatus, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { HandleResponse } from '../services/handleResponse';
import { ResponseData } from '../utils/constants/response';
dotenv.config();

const transporter: any = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const emailSend = async (obj: any) => {
  const { email, firstName, lastName, phone, messageContent } = obj;
  let mailDetail: any = null;

  if (email && messageContent) {
    mailDetail = {
      to: email,
      subject: 'Inquiry received',
      html: `
       <p>Dear ${firstName} ${lastName},</p>
      <p>Thank you for your inquiry! We have received the following details:</p>
      <ul>
        <li><strong>Name:</strong> ${firstName} ${lastName}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Message:</strong> ${messageContent}</li>
      </ul>
      <p>Our team will get back to you shortly.</p>
      <p>Best regards,</p>
      <p>CUENTISTA</p>
      `,
    };
  }

  try {
    const info = await transporter.sendMail(mailDetail);
    Logger.log('Email sent: ' + info.response);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      'Email sent: ' + info.response
    );
  } catch (error) {
    Logger.error('Failed to send email: ' + error.message);
    throw new Error('Email sending failed');
  }
};

module.exports = { emailSend };

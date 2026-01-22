// src/mail/mail.service.ts
import * as nodemailer from 'nodemailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendResetPassword(email: string, resetLink: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Reset your password',
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>The link will expire in 15 minutes.</p>
        `,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendInvitation(email: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'You are invited to join a project',
      html: `
        <p>You have been invited to join a project.</p>
        <a href="${link}">Join</a>
      `,
    });
  }
}

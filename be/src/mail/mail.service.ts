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
        subject: 'Reset mật khẩu',
        html: `
          <h2>Yêu cầu đặt lại mật khẩu</h2>
          <p>Click vào link bên dưới để đổi mật khẩu:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Link sẽ hết hạn sau 15 phút.</p>
        `,
      });
    } catch (error) {
      throw new InternalServerErrorException('Không thể gửi email');
    }
  }

  async sendInvitation(email: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Bạn được mời tham gia dự án',
      html: `
        <p>Bạn được mời tham gia project.</p>
        <a href="${link}">Tham gia</a>
      `,
    });
  }
}

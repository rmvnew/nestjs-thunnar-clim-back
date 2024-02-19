import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { CodeRecoverInterface, DefaultMailInterface } from 'src/common/interfaces/email.interface';

@Injectable()
export class MailService {

  private readonly logger = new Logger(MailService.name)

  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });


  }



  sendMail(codeRecover: CodeRecoverInterface) {


    const mailOptions: DefaultMailInterface = {
      to: codeRecover.email,
      from: 'Thunnar <thunnar@outlook.com>',
      subject: 'Código para Redefinição de Senha!!',
      html: `
              <div style="font-family: Arial, sans-serif; border: 1px solid #e0e0e0; padding: 20px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
                  <h2 style="color: #333;">Redefinição de Senha</h2>
                  <p>Olá, ${codeRecover.name}!!</p>
                  <p>Você solicitou a redefinição da sua senha. Abaixo está o código para prosseguir com o processo:</p>
                  <h3 style="background-color: #e6f7ff; padding: 10px; border: 1px solid #b3e0ff; text-align: center; color: #333;">${codeRecover.code}</h3>
                  <p>Se você não solicitou essa redefinição, ignore este e-mail e, por precaução, altere sua senha.</p>
                  <p>Atenciosamente,</p>
                  <p>Equipe do Thunnar</p>
              </div>
            `
    };

    this.sendCurrentMail(mailOptions)

  }


  async generalMail(general_mail: DefaultMailInterface) {

    const current_mail: DefaultMailInterface = {
      to: general_mail.to,
      from: process.env.MAIL_USER,
      subject: general_mail.subject,
      html: general_mail.html
    }

    this.sendCurrentMail(current_mail)

  }



  async sendCurrentMail(mail_options: DefaultMailInterface) {

    this.transporter.sendMail(mail_options, (error, info) => {
      if (error) {
        this.logger.error('Error sending email:', error);
      } else {
        this.logger.log('Email sent:', info.response);
      }
    });

  }


}



import * as travettoMail from '@travetto/email';
import { Injectable } from '@travetto/di';

import { User } from '../model/user';

type MailTemplateOptions = travettoMail.MailTemplateOptions;

@Injectable()
export class EmailService {

  constructor(private email: travettoMail.EmailService) { }

  async sendEmail(contexts: MailTemplateOptions | MailTemplateOptions[], base?: MailTemplateOptions) {
    return this.email.sendTemplatedEmail(contexts, base);
  }

  async sendUserEmail(user: User, subject: string, template: string, context: any) {
    context.user = user;
    return await this.email.sendTemplatedEmail({
      to: `"${user.firstName} ${user.lastName}" <${user.email}>`,
      subject,
      template,
      context
    });
  }
}

import { ModelService } from '@encore2/model';
import * as encoreMail from '@encore2/email';
import { User } from '../model/user';
import { UserService } from './user';
import { Injectable } from '@encore2/di';

@Injectable()
export class EmailService {
  sendEmail: any;
  template: any;

  constructor(private email: encoreMail.EmailService, private userService: UserService) {
    this.sendEmail = email.sendEmail;
    this.template = email.template
  }

  async sendUserEmail(user: User, subject: string, template: string, context: any) {
    context.user = user;
    return await this.email.sendEmail({
      to: `"${user.firstName} ${user.lastName}" <${user.email}>`,
      subject,
      template,
      context
    });
  }

  async sendActiveUserEmail(subject: string, template: string, context: any) {
    return await this.sendUserEmail(this.userService.getActiveUser(),
      subject, template, context);
  }
}

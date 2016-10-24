import { ModelService } from '@encore/model';
import { EmailService as service } from '@encore/email';
import { User } from '../model/user';
import { UserService } from './user';


export class EmailService {
  static async sendUserEmail(user: User, subject: string, template: string, context: any) {
    context.user = user;
    return await service.sendEmail(`"${user.firstName} ${user.lastName}" <${user.email}>`,
      subject, template, context);
  }

  static async sendActiveUserEmail(subject: string, template: string, context: any) {
    return await EmailService.sendUserEmail(UserService.getActiveUser(),
      subject, template, context);
  }

  static sendEmail = service.sendEmail;
  static template = service.template
} 
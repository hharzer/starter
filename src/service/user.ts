import '@encore/auth';

import { ModelService } from '@encore2/model';
import { Context } from '@encore2/context';
import { ModelStrategy } from '@encore2/auth/opt/model';
import { User } from '../model/user';
import { AppConfig } from '../config';
import { Injectable } from '@encore2/di';
import { EmailService } from './email';

@Injectable()
export class UserService {
  constructor(
    private config: AppConfig,
    private strategy: ModelStrategy<User>,
    private email: EmailService,
    private model: ModelService,
    private context: Context
  ) {

  }

  async get(userId: string) {
    let user = await this.model.getById(User, userId);
    return user;
  }

  getActiveUser() {
    return this.context.get().user;
  }

  getActiveUserId() {
    return this.getActiveUser()._id;
  }

  getActiveUseAccesType() {
    return this.getActiveUser().accessType;
  }

  async register(user: User) {
    user = await this.strategy.register(user, user.password!);

    await this.email.sendActiveUserEmail('Welcome to Sample App', `
Welcome ${user.firstName},

You are now signed up!
    `, {})
    return user;
  }

  async changePassword(email: string, newPassword: string, oldPassword: string) {
    return await this.strategy.changePassword(email, newPassword, oldPassword);
  }

  async resetPassword(email: string, newPassword: string, resetToken: string) {
    let user = await this.model.getByQuery(User, { email, resetToken });
    user = await this.strategy.changePassword(email, newPassword, resetToken);
    // Clear token,
    // TODO: FIX
    // delete user.resetExpires;
    // delete user.resetToken;
    return await this.model.update(User, user);
  }

  async resetPasswordStart(email: string) {
    let user = await this.strategy.generateResetToken(email);
    await this.email.sendUserEmail(user, 'Password Reset for Sample App', `
Hi ${user.firstName},

Please follow click [reset password](${this.config.baseUrl}/auth/reset/${user.resetToken})!
    `, {})
    return;
  }
}
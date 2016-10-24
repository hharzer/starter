import '@encore/auth';

import { ModelService } from '@encore/model';
import { Context } from '@encore/context';
import { MongoStrategy } from '@encore/auth/ext/mongo';
import { User, UserStatus, AccessType } from '../model/user';
import Config from '../config';

const Strategy = MongoStrategy(User, {
  usernameField: 'email',
  passwordField: 'password',
  hashField: 'hash',
  saltField: 'salt',
  resetTokenField: 'resetToken',
  resetExpiresField: 'resetExpires',
});

export class UserService {
  static async get(userId: string) {
    let user = await ModelService.getById(User, userId);
    return user;
  }

  static getActiveUser() {
    return Context.get().user;
  }

  static getActiveUserId() {
    return UserService.getActiveUser()._id;
  }

  static getActiveUseAccesType() {
    return UserService.getActiveUser().accessType;
  }

  static async register(user: User) {
    user.accessType = AccessType[AccessType.user];
    user.status = UserStatus[UserStatus.Active];
    user = await Strategy.register(user, user.password);

    await EmailService.sendActiveUserEmail('Welcome to Sample App', `
Welcome ${user.firstName},

You are now signed up!
    `, {})
    return user;
  }

  static async changePassword(email: string, newPassword: string, oldPassword: string) {
    return await Strategy.changePassword(email, newPassword, oldPassword);
  }

  static async resetPassword(email: string, newPassword: string, resetToken: string) {
    let user = await ModelService.findOne(User, { email, resetToken });
    user = await Strategy.changePassword(email, newPassword, resetToken);
    //Clear token
    delete user.resetExpires;
    delete user.resetToken;
    return await ModelService.update(user);
  }

  static async resetPasswordStart(email: string) {
    let user = await Strategy.generateResetToken(email);
    await EmailService.sendUserEmail(user, 'Password Reset for Sample App', `
Hi ${user.firstName},

Please follow click [reset password](${Config.baseUrl}/auth/reset/${user.resetToken})!
    `, {})
    return;
  }
}
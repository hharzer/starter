import { Request, Response } from 'express';
import {
  Get, Post,
  Controller,
  Redirect,
  TypedRequest
} from '@travetto/express';
import { SchemaBody } from '@travetto/express/support/extension.schema';
import { Authenticate, Authenticated, Unauthenticated } from '@travetto/auth-express';
import { User } from '../model/user';
import { UserService } from '../service/user';
import { AUTH } from '../config';

@Controller('/auth')
class Auth {

  constructor(private userService: UserService) { }

  @Unauthenticated()
  @Post('/register')
  @SchemaBody(User)
  async register(req: TypedRequest<User>, res: Response, next: Function) {
    const user = await this.userService.register(req.body);
    return user;
  }

  @Unauthenticated()
  @Post('/reset/:email')
  async resetPasswordStart(req: Request, res: Response, next: Function) {
    return await this.userService.resetPasswordStart(req.params.email);
  }

  @Unauthenticated()
  @Post('/reset')
  async resetPassword(req: Request, res: Response, next: Function) {
    return await this.userService.resetPassword(req.body.email, req.body.password, req.body.token);
  }

  @Get('/checkToken')
  async checkToken(req: Request) {
    if (req.auth.unauthenticated) {
      throw { message: 'You are not logged in', statusCode: 401 };
    }
    return req.auth.context;
  }

  @Get('/logout')
  @Authenticated()
  async logout(req: Request): Promise<Redirect | {}> {
    await req.auth.logout();

    if ((req.headers.accept as any as string[] || []).includes('text/html')) {
      return new Redirect('/?message=Successfully Logged Out');
    } else {
      return { acknowledged: true };
    }
  }

  @Post('/login')
  @Unauthenticated()
  @Authenticate(AUTH)
  async login(req: Request): Promise<any> {
    return this.userService.getActiveUser();
  }
}
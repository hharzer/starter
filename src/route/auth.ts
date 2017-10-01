import * as util from 'util';
import { Request, Response } from 'express';
import {
  Get, Post, Put, Delete,
  Controller,
  Redirect,
  Cache,
  TypedRequest
} from '@travetto/express';
// import { ModelBody } from '@travetto/model/opt/express';
import { Authenticate, Authenticated, Unauthenticated } from '@travetto/auth';
import { User } from '../model/user';
import { UserService } from '../service/user';

@Controller('/auth')
class Auth {

  constructor(private userService: UserService) { }

  @Unauthenticated()
  @Post('/register')
  // @ModelBody(User)
  // TODO: Need to fix
  async register(req: TypedRequest<User>, res: Response, next: Function) {
    let user = await this.userService.register(req.body);
    await util.promisify(req.login).call(req, user);
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
    if (req.isUnauthenticated()) {
      throw { message: 'You are not logged in', statusCode: 401 };
    }
    return req.principal;
  }

  @Get('/logout')
  @Authenticated()
  async logout(req: Request): Promise<Redirect | {}> {
    await req.doLogout();

    if ((req.headers.accept as string[] || []).includes('text/html')) {
      return new Redirect('/?message=Successfully Logged Out');
    } else {
      return { acknowledged: true };
    }
  }

  @Post('/login')
  @Unauthenticated()
  @Authenticate('local')
  async login(req: Request): Promise<any> {
    return this.userService.getActiveUser();
  }
}
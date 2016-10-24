import { Request, Response } from "express";
import {
  Get, Post, Put, Delete,
  Controller,
  Redirect,
  Cache,
  TypedRequest,
  canAccept
} from '@encore/express';
import { ModelBody } from '@encore/model/ext/express';
import { Authenticate, Authenticated, Unauthenticated } from '@encore/auth';
import { nodeToPromise } from '@encore/util';
import { User } from '../model/user';
import { UserService } from '../service/user';
import * as passport from "passport";

@Controller('/auth')
class Auth {

  @Unauthenticated()
  @Post('/register')
  @ModelBody(User)
  async register(req: TypedRequest<User>, res: Response, next: Function) {
    let user = await UserService.register(req.body);
    await nodeToPromise<User>(req, req.login, user);
    return user;
  }

  @Unauthenticated()
  @Post('/reset/:email')
  async resetPasswordStart(req: Request, res: Response, next: Function) {
    return await UserService.resetPasswordStart(req.params.email);
  }

  @Unauthenticated()
  @Post('/reset')
  async resetPassword(req: Request, res: Response, next: Function) {
    return await UserService.resetPassword(req.body.email, req.body.password, req.body.token);
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

    if (canAccept(req, 'text/html')) {
      return new Redirect('/?message=Successfully Logged Out');
    } else {
      return { acknowledged: true };
    }
  }

  @Post('/login')
  @Unauthenticated()
  @Authenticate('local')
  async login(req: Request): Promise<any> {
    return UserService.getActiveUser();
  }
}
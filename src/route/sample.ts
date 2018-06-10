import { Request, Response } from 'express';
import { Get, Post, Controller, Cache } from '@travetto/express';
import { Injectable, Inject } from '@travetto/di';

@Injectable()
class UserService {
  private count = 0;

  getMessage(): any {
    return {
      message: 'Hello world',
      count: this.count++
    };
  }
}

@Controller('/sample')
class SampleRoute {

  constructor(private service: UserService) { }

  @Get('/hello')
  async get(req: Request) {
    const res = await this.service.getMessage();
    return res;
  }

  @Post('/')
  async echo(req: Request) {
    return req.body;
  }
}
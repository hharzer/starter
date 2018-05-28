import { Request, Response } from 'express';
import { Get, Post, Controller, Cache } from '@travetto/express';
import { Injectable, Inject } from '@travetto/di';

@Injectable()
class UserService {
  getMessage() {
    return { message: 'Hellob' };
  }
}

@Controller('/sample')
class SampleRoute {

  private count = 0;

  constructor(private service: UserService) { }

  @Get('/hello')
  async get(req: Request) {
    this.count++;
    const res = await this.service.getMessage() as any;
    res.count = this.count;
    return res;
  }

  @Post('/')
  async echo(req: Request) {
    return req.body;
  }
}
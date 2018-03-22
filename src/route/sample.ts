import { Request, Response } from 'express';
import { Get, Post, Controller, Cache } from '@travetto/express';

@Controller('/sample')
class SampleRoute {

  @Get('/hello')
  async get(req: Request) {
    return await { message: 'Hellod' };
  }

  @Post('/')
  async echo(req: Request) {
    return req.body;
  }
}
import { Request, Response } from 'express';
import { Get, Post, Controller, Cache } from '@encore2/express';

@Controller('/sample')
class SampleRoute {

  @Get('/')
  async get(req: Request) {
    return await { message: 'Hello' };
  }

  @Post('/')
  async echo(req: Request) {
    return req.body;
  }
}
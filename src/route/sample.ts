import { Request, Response } from 'express';
import { Get, Post, Controller, Cache } from '@encore2/express';

@Controller('/sample')
class SampleRoute {

  @Get('/hello')
  async get(req: Request) {
    return await { message: 'Hellos' };
  }

  @Post('/')
  async echo(req: Request) {
    return req.body;
  }
}
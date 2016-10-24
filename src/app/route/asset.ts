import { Request, Response } from "express";
import { Get, Post, Controller, Cache } from '@encore/express';
import { AssetService, ImageService, Upload, File } from '@encore/asset';

@Controller("/asset")
class AssetRoute {

  @Cache(1, "year")
  @Get(/(.*).(png|jpg|jpeg|gif|bmp)/i)
  async getImage(req: Request) {
    return await ImageService.getImage(req.path, req.query);
  }

  @Cache(1, "year")
  @Get(/(.*)/)
  async get(req: Request) {
    return await AssetService.get(req.path);
  }

  @Post("/")
  @Upload()
  async upload(req: Request) {
    let file = ObjectUtil.values(req.files)[0] as File;
    file = await AssetService.upload(file);
    return Object.assign({}, file);
  }
}
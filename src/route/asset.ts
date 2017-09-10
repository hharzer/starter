import { Request, Response } from 'express';
import { Get, Post, Controller, Cache } from '@encore2/express';
import { AssetService, ImageService, AssetFile, AssetUtil } from '@encore2/asset';
import { AssetUpload } from '@encore2/asset-express';
import { Inject } from '@encore2/di';

@Controller('/asset')
class AssetRoute {

  @Inject()
  image: ImageService;

  @Inject()
  asset: AssetService;

  @Cache(1, 'year')
  @Get(/(.*).(png|jpg|jpeg|gif|bmp)/i)
  async getImage(req: Request) {
    return await this.image.getImage(req.path, req.query);
  }

  @Cache(1, 'year')
  @Get(/(.*)/)
  async get(req: Request) {
    return await this.asset.get(req.path);
  }

  @Post('/')
  @AssetUpload()
  async upload(req: Request) {
    let file = Object.values((req as any).files)[0] as AssetFile;
    let res = await this.asset.save(AssetUtil.fileToAsset(file));
    return Object.assign({}, res);
  }
}
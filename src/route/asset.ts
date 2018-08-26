import { Get, Post, Controller, Cache, Request, TypedQuery, ResponseType } from '@travetto/rest';
import { AssetService, ImageService, AssetFile, AssetUtil } from '@travetto/asset';
import { AssetUpload } from '@travetto/asset-rest';
import { Inject } from '@travetto/di';

@Controller('/asset')
class AssetRoute {

  @Inject()
  image: ImageService;

  @Inject()
  asset: AssetService;

  @Cache(1, 'y')
  @Get(/(.*).(png|jpg|jpeg|gif|bmp)/i)
  @ResponseType({ mime: 'image/*', type: 'file' })
  async getImage(req: TypedQuery<{ w?: number, h?: number }>) {
    return await this.image.getImage(req.path, req.query);
  }

  @Cache(1, 'y')
  @Get(/(.*)/)
  @ResponseType({ mime: 'application/octet-stream', type: 'file' })
  async get(req: Request) {
    return await this.asset.get(req.path);
  }

  @Post('/')
  @AssetUpload()
  async upload(req: Request) {
    const file = Object.values((req as any).files)[0] as AssetFile;
    const res = await this.asset.save(AssetUtil.fileToAsset(file));
    return { ...res };
  }
}
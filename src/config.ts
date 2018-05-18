import { Config } from '@travetto/config';
import { InjectableFactory, Inject } from '@travetto/di';
import { AuthModelSource, AuthModelConfig } from '@travetto/auth/src/source/model';
import { ModelService, ModelSource } from '@travetto/model';
import { ModelMongoConfig, ModelMongoSource } from '@travetto/model-mongo';
import { QueryVerifierService } from '@travetto/model/src/service/query';
import { AssetSource } from '@travetto/asset';
import { AssetMongoSource, AssetMongoConfig } from '@travetto/asset-mongo';
import { AuthSource } from '@travetto/auth/src/source';

require('@travetto/express/support/extension.context');

@Config('app')
export class AppConfig {
  baseUrl = 'http://localhost/rest'
}

export const AUTH = Symbol('auth');

@Config('auth.mongo')
class AuthMongo extends ModelMongoConfig { }

@Config('auth.strategy')
class AuthConf extends AuthModelConfig { }

class AssetConfig {
  @InjectableFactory()
  static getAssetSource(config: AssetMongoConfig): AssetSource {
    return new AssetMongoSource(config);
  }
}

class AuthConfig {

  @InjectableFactory(AUTH)
  static getAuthMongo(config: AuthMongo): ModelSource {
    return new ModelMongoSource(config);
  }

  @InjectableFactory()
  static getAuthSource(config: AuthConf, @Inject(AUTH) src: ModelSource, qsvc: QueryVerifierService): AuthSource<any, any> {
    return new AuthModelSource(config, new ModelService(src, qsvc));
  }

  @InjectableFactory()
  static getSource(config: ModelMongoConfig, ): ModelSource {
    return new ModelMongoSource(config);
  }
}
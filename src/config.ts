import { Config } from '@travetto/config';
import { InjectableFactory, Inject } from '@travetto/di';
import { ModelStrategyConfig, ModelStrategy } from '@travetto/auth/src/strategy/model';
import { ModelService, ModelSource } from '@travetto/model';
import { BaseStrategy } from '@travetto/auth';
import { ModelMongoConfig, ModelMongoSource } from '@travetto/model-mongo';
import { QueryVerifierService } from '@travetto/model/src/service/query';
import { AssetSource } from '@travetto/asset';
import { AssetMongoSource, AssetMongoConfig } from '@travetto/asset-mongo';

require('@travetto/express/src/extension/context');

@Config('app')
export class AppConfig {
  baseUrl = 'http://localhost/rest'
}

export const AUTH = Symbol('auth');

@Config('auth.mongo')
class AuthMongo extends ModelMongoConfig { }

@Config('auth.strategy')
class AuthModelStrategy extends ModelStrategyConfig { }

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
  static getStrategy(config: AuthModelStrategy, @Inject(AUTH) src: ModelSource, qsvc: QueryVerifierService): ModelStrategy<any> {
    return new ModelStrategy(config, new ModelService(src, qsvc));
  }

  @InjectableFactory()
  static getSource(config: ModelMongoConfig, ): ModelSource {
    return new ModelMongoSource(config);
  }
}
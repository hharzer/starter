import { Config } from '@travetto/config';
import { InjectableFactory, Inject } from '@travetto/di';
import { ModelStrategyConfig, ModelStrategy } from '@travetto/auth/src/strategy/model';
import { ModelService, ModelSource } from '@travetto/model';
import { BaseStrategy } from '@travetto/auth';
import { ModelMongoConfig, ModelMongoSource } from '@travetto/model-mongo';
import { QueryVerifierService } from '@travetto/model/src/service/query';

@Config('app')
export class AppConfig {
  baseUrl = 'http://localhost/rest'
}

export const AUTH_MODEL = Symbol('auth');

class AuthConfig {

  @InjectableFactory({ class: ModelSource as any })
  static getAuthMongo(@Inject() config: ModelMongoConfig) {
    return new ModelMongoSource(config);
  }

  @InjectableFactory({ class: ModelStrategy })
  static getStrategy(config: ModelStrategyConfig, @Inject() src: ModelSource, qsvc: QueryVerifierService) {
    return new ModelStrategy(config, new ModelService(src, qsvc));
  }

  @InjectableFactory({ class: ModelSource as any, qualifier: AUTH_MODEL })
  static getSource(config: ModelMongoConfig) {
    return new ModelMongoSource(config);
  }
}
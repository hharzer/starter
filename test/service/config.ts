import { InjectableFactory, Inject } from '@travetto/di';
import { ModelMongoConfig, ModelMongoSource } from '@travetto/model-mongo';
import { ModelSource, ModelService, BaseModel } from '@travetto/model';
import { QueryVerifierService } from '@travetto/model/src/service/query';
import { UserService } from '../../src/service/user';
import { AuthSource } from '@travetto/auth/src/source';
import { AuthModelConfig, AuthModelSource } from '@travetto/auth/src/source/model';
import { AuthStrategy } from '@travetto/auth';

export const TEST = Symbol();

class Config {
  @InjectableFactory(TEST)
  static getModelSource(config: ModelMongoConfig): ModelSource {
    return new ModelMongoSource(config);
  }

  @InjectableFactory(TEST)
  static getModelSsvc(@Inject(TEST) src: ModelSource, qvs: QueryVerifierService): ModelService {
    return new ModelService(src, qvs);
  }

  @InjectableFactory(TEST)
  static getAuthSource<T extends BaseModel>(cfg: AuthModelConfig, svc: ModelService): AuthSource<T, AuthModelConfig> {
    return new AuthModelSource(cfg, svc);
  }

  @InjectableFactory(TEST)
  static getAuthStrategy<T extends BaseModel>(src: AuthSource<T>): AuthStrategy<T> {
    return new AuthStrategy(src);
  }

  @InjectableFactory(TEST)
  static getUserSvc(@Inject(TEST) svc: ModelService, @Inject(TEST) strat: AuthStrategy<any>): UserService {
    const out = new UserService();
    out.model = svc;
    out.strategy = strat;
    return out;
  }
}

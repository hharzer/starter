import { InjectableFactory, Inject } from '@travetto/di';
import { ModelMongoConfig, ModelMongoSource } from '@travetto/model-mongo';
import { ModelSource, ModelService, BaseModel } from '@travetto/model';
import { QueryVerifierService } from '@travetto/model/src/service/query';
import { ModelStrategyConfig, ModelStrategy } from '@travetto/auth/src/strategy/model';
import { UserService } from '../../src/service/user';

export const TEST = Symbol()

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
  static getModelStrategy<T extends BaseModel>(cfg: ModelStrategyConfig, svc: ModelService): ModelStrategy<T> {
    return new ModelStrategy(cfg, svc);
  }

  @InjectableFactory(TEST)
  static getUserSvc(@Inject(TEST) svc: ModelService, @Inject(TEST) strat: ModelStrategy<any>): UserService {
    const out = new UserService();
    out.model = svc;
    out.strategy = strat;
    return out;
  }
}

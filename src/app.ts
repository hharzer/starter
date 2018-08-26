import { InjectableFactory, Inject, Application } from '@travetto/di';

import { AssetSource } from '@travetto/asset';
import { AssetMongoConfig, AssetMongoSource } from '@travetto/asset-mongo';

import { ModelSource, ModelService } from '@travetto/model';
import { QueryVerifierService } from '@travetto/model/src/service/query';
import { ModelMongoSource, ModelMongoConfig } from '@travetto/model-mongo';

import { AuthModelService, RegisteredPrincipalConfig } from '@travetto/auth-model';
import { AuthProvider } from '@travetto/auth-rest';
import { AuthPassportInterceptor } from '@travetto/auth-passport';
import { AuthModelProvider } from '@travetto/auth-model/extension/auth.rest';

import { RestApp, RestAppProvider } from '@travetto/rest';
import { ContextInterceptor } from '@travetto/rest/extension/context';
import { ExpressAppProvider } from '@travetto/rest-express';

import { AuthMongo, AUTH } from './config';
import { User } from './model/user';

@Application('sample')
export class SampleApp {

  @InjectableFactory()
  static getAssetSource(config: AssetMongoConfig): AssetSource {
    return new AssetMongoSource(config);
  }

  @InjectableFactory(AUTH)
  static getModelSource(conf: AuthMongo): ModelSource {
    return new ModelMongoSource(conf);
  }

  @InjectableFactory()
  static getAuthModelService(@Inject(AUTH) src: ModelSource, qsvc: QueryVerifierService): AuthModelService<User> {
    return new AuthModelService(
      new ModelService(src, qsvc),
      new RegisteredPrincipalConfig(User, {
        id: 'email',
        password: 'password',
        salt: 'salt',
        hash: 'hash',
        resetExpires: 'resetExpires',
        resetToken: 'resetToken',
        permissions: 'permissions'
      })
    );
  }

  @InjectableFactory(AUTH)
  static getProvider(svc: AuthModelService<User>): AuthProvider<User> {
    return new AuthModelProvider(svc);
  }

  @InjectableFactory()
  static getSource(config: ModelMongoConfig): ModelSource {
    return new ModelMongoSource(config);
  }

  @InjectableFactory()
  static getAppProvider(): RestAppProvider {
    return new ExpressAppProvider();
  }

  @Inject()
  private contextOp: ContextInterceptor;

  @Inject()
  private passport: AuthPassportInterceptor;

  @Inject()
  private express: RestApp;

  run() {
    this.express.run();
  }
}
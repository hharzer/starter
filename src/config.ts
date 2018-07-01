import { Config } from '@travetto/config';
import { InjectableFactory, Inject } from '@travetto/di';
import { ModelService, ModelSource } from '@travetto/model';
import { ModelMongoConfig, ModelMongoSource } from '@travetto/model-mongo';
import { QueryVerifierService } from '@travetto/model/src/service/query';
import { AssetSource } from '@travetto/asset';
import { AssetMongoSource, AssetMongoConfig } from '@travetto/asset-mongo';
import { AuthModelService, RegisteredPrincipalConfig } from '@travetto/auth-model';
import { AuthProvider } from '@travetto/auth-express';
import { AuthModelProvider } from '@travetto/auth-model/support/auth.express';
import { User } from './model/user';

require('@travetto/express/support/extension.context');

@Config('app')
export class AppConfig {
  baseUrl = 'http://localhost/rest';
}

export const AUTH = Symbol('auth');

@Config('auth.mongo')
class AuthMongo extends ModelMongoConfig { }

class AssetConfig {
  @InjectableFactory()
  static getAssetSource(config: AssetMongoConfig): AssetSource {
    return new AssetMongoSource(config);
  }
}

class AuthConfig {

  @InjectableFactory(AUTH)
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
  static getProvider(@Inject(AUTH) svc: AuthModelService<User>): AuthProvider<User> {
    return new AuthModelProvider(svc);
  }

  @InjectableFactory()
  static getSource(config: ModelMongoConfig, ): ModelSource {
    return new ModelMongoSource(config);
  }
}
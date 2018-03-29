import * as moment from 'moment';
import * as assert from 'assert';

import { ModelService, ModelRegistry, ModelSource } from '@travetto/model';
import { ModelMongoSource, ModelMongoConfig } from '@travetto/model-mongo';
import { DependencyRegistry, Injectable, InjectableFactory } from '@travetto/di';
import { Test, Suite, BeforeAll } from '@travetto/test';

import { User, Address } from '../../src/model/user';
import { UserService } from '../../src/service/user';
import { RootRegistry } from '@travetto/registry';
import { Context, WithContext } from '@travetto/context';
import { Schema, SchemaRegistry, SchemaValidator } from '@travetto/schema';

class Config {
  @InjectableFactory({ class: ModelSource as any })
  static getModelSource(config: ModelMongoConfig) {
    return new ModelMongoSource(config);
  }
}

@Suite('User Service')
class UserServiceTest {

  context!: Context;

  @BeforeAll()
  async init() {
    await RootRegistry.init();
    const svc = await DependencyRegistry.getInstance(ModelService);
    this.context = await DependencyRegistry.getInstance(Context);
    const db = (svc as any).source as ModelMongoSource;
    await db.resetDatabase();
  }

  @Test('Register a user')
  @WithContext({
    user: {
      firstName: 'bob',
      email: 'bob@bob.com'
    }
  })
  async register() {
    const userService = await DependencyRegistry.getInstance(UserService);

    const user: User = User.from({
      firstName: 'Test',
      lastName: 'User',
      email: 'ops@eaiti.com',
      password: 'testpw',
      phone: '5713064683',
      address: {
        street1: '1945 Old Gallows RD',
        street2: 'STE 133',
        city: 'Vienna',
        zip: '22182',
        stateOrProvince: 'VA',
        country: 'USA'
      }
    });

    const emptyUser: User = new User();
    const ctx = await DependencyRegistry.getInstance(Context);

    const res = await userService.register(user);

    assert(res.id !== null);
    delete res.id;
    assert.deepEqual(user, res);
    assert(user.id === undefined);

    try {
      const res2 = await userService.register(emptyUser);
      assert(res2 === null);
    } catch (e) {
      assert(e.message === 'That email is already taken.');
    }
  }
}
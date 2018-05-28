import * as assert from 'assert';

import { ModelService, ModelRegistry, ModelSource, BaseModel } from '@travetto/model';
import { ModelMongoSource, ModelMongoConfig } from '@travetto/model-mongo';
import { DependencyRegistry, Injectable, InjectableFactory, Inject } from '@travetto/di';
import { Test, Suite, BeforeAll } from '@travetto/test';

import { User, Address } from '../../src/model/user';
import { UserService } from '../../src/service/user';
import { RootRegistry } from '@travetto/registry';
import { Context, WithContext } from '@travetto/context';
import { Schema, SchemaRegistry, SchemaValidator } from '@travetto/schema';
import { TEST } from './config';

@Suite('User Services')
class UserServiceTest {

  context: Context;

  @BeforeAll()
  async init() {
    await RootRegistry.init();
    const svc = await DependencyRegistry.getInstance(ModelService, TEST);
    this.context = await DependencyRegistry.getInstance(Context);
    const db = (svc as any).source as ModelMongoSource;
    await db.resetDatabase();
  }

  @Test('Delete a user')
  async removeUser() {
    assert(true);
  }

  @Test('Register a user')
  @WithContext({
    user: {
      firstName: 'bob',
      email: 'bob@bob.com'
    }
  })
  async register() {
    const userService = await DependencyRegistry.getInstance(UserService, TEST);

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
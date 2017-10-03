import * as moment from 'moment';
import * as assert from 'assert';

import { ModelService, ModelRegistry, ModelSource } from '@travetto/model';
import { MongoModelSource, ModelMongoConfig } from '@travetto/model-mongo';
import { DependencyRegistry, Injectable } from '@travetto/di';
import { Test, Suite, BeforeAll } from '@travetto/test';

import { User, Address } from '../../src/model/user';
import { UserService } from '../../src/service/user';
import { RootRegistry } from '@travetto/registry';

// TODO: Figure out why startup is so slow

@Injectable({ target: ModelMongoConfig })
class Conf extends ModelMongoConfig {

}

@Suite('User Service')
class UserServiceTest {

  @BeforeAll()
  async init() {
    await RootRegistry.init();
  }

  @Test('Register a user')
  async register() {
    let userService = await DependencyRegistry.getInstance(UserService);
    let user: User = User.from({
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
    try {

      let emptyUser: User = new User();
      let res = await userService.register(user);

      assert(res.id !== null);
      delete res.id;
      assert.deepEqual(res, user);

      let res2 = await userService.register(emptyUser);
      assert(res2 === null);
    } catch (e) {
      console.debug(e);
      assert(e instanceof Error);
    }
  }
}
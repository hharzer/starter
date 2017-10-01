import * as moment from 'moment';
import * as assert from 'assert';

import { ModelService } from '@travetto/model';
import { DependencyRegistry } from '@travetto/di';
import { Test, Suite } from '@travetto/test';

import { User, Address } from '../../src/model/user';
import { UserService } from '../../src/service/user';

// TODO: Figure out why startup is so slow

@Suite('User Service')
class UserServiceTest {

  @Test('Register a user')
  async register() {
    await DependencyRegistry.init();
    let userService = await DependencyRegistry.getInstance(UserService);
    let user: User = User.from({
      firstName: 'Test',
      lastName: 'User',
      email: 'ops@eaiti.com',
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
    let emptyUser: User = new User();
    let res = await userService.register(user);

    assert(res.id !== null);
    delete res.id;
    assert.deepEqual(res, user);

    try {
      let res2 = await userService.register(emptyUser);
      assert(res2 === null);
    } catch (e) {
      assert(e.instanceof(Error));
    }
  }
}
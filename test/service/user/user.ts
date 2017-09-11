import { User, Address } from '../../../src/model/user';
import { UserService } from '../../../src/service/user';
import { ModelService } from '@encore2/model';
import * as moment from 'moment';
import { expect } from 'chai';
import { DependencyRegistry } from '@encore2/di';

describe('User Service', () => {

  it('Register a user', async () => {
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

    expect(res.id).not.equals(null);
    delete res.id;
    expect(res).deep.equal(user);

    try {
      let res2 = await userService.register(emptyUser);
      expect(res2).equals(null);
    } catch (e) {
      expect(e).instanceof(Error);
    }
  });
});
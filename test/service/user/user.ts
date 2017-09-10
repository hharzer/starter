import { User, Address } from '../../../app/model/user';
import { UserService } from '../../../app/service/user';
import { ModelService } from '@encore/model';
import * as moment from "moment";
import { expect } from "chai";

describe("User Service", () => {

  it("Register a user", async () => {
    let application = await getApplication();

    let user: User = new User({
      firstName: "Test",
      lastName: "User",
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
    let res = await UserService.register(user);
    expect(res._id).not.equals(null);
    delete res._id;
    expect(res).deep.equal(user);

    try {
      let res = await UserService.register(emptyUser);
      expect(res).equals(null);
    } catch (e) {
      expect(e).instanceof(Error);
    }
  });

});
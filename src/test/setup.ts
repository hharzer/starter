import { beforeAll, beforeTest, afterTest } from '@encore/test';
import { MongoService } from '@encore/mongo';
import { Ready } from '@encore/init'
import { setDefault } from '@encore/context/src/ext/test';

let user = {
  _id: "0123456789abcdef01234567",
  email: "test@test.com",
  accessType: 'user'
};

setDefault({ user })

beforeAll(async () => {
  await Ready.onReadyPromise();
  await MongoService.resetDatabase();
});
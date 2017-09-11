import { beforeAll, beforeTest, afterTest } from '@encore2/test';
import { MongoModelSource } from '@encore2/model-mongo';
import { RootRegistry } from '@encore2/registry';
import { DependencyRegistry } from '@encore2/di';
import { Context } from '@encore2/context';

// TODO: what here?

let user = {
  id: '0123456789abcdef01234567',
  email: 'test@test.com',
  accessType: 'user'
};


beforeAll(async () => {
  await RootRegistry.init();
  // setDefault({ user })
  let source = await DependencyRegistry.getInstance(MongoModelSource);
  await source.resetDatabase();
  let context = await DependencyRegistry.getInstance(Context);

  context.get().set('user', user);
});

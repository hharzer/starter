import { EmailService } from '../../src/service/email';
import { expect } from 'chai';
import { DependencyRegistry } from '@encore2/di';

let body = `<style>
  strong { color: orange }
</style>
**{{name}}**`;
let context = { name: 'Brad' };

describe('Email Service', () => {
  it('Verify Templating', async () => {
    let service = await DependencyRegistry.getInstance(EmailService);
    let result = service.template(body, context);

    expect(result).equals(
      `<p>
<strong style="color: orange;">Brad</strong></p>
`
    );
  });

  it('Send email', async () => {
    let service = await DependencyRegistry.getInstance(EmailService);
    await service.sendEmail('tim@eaiti.com', 'Test', body, context);
  })
});
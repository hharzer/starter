import { EmailService } from '../../src/service/email';
import { DependencyRegistry } from '@encore2/di';
import { Test, Suite } from '@encore2/test';
import * as assert from 'assert';

let body = `<style>
  strong { color: orange }
</style>
**{{name}}**`;

let context = { name: 'Brad' };

@Suite('Email Service')
class EmailServiceTest {
  @Test('Verify Templating')
  async templating() {
    let service = await DependencyRegistry.getInstance(EmailService);
    let result = service.template(body, context);

    assert(result ===
      `<p>
<strong style="color: orange;">Brad</strong></p>
`
    );
  }

  @Test('Send email')
  async sendEmail() {
    let service = await DependencyRegistry.getInstance(EmailService);
    await service.sendEmail('tim@eaiti.com', 'Test', body, context);
  }
}
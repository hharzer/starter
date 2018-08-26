import * as assert from 'assert';

import { DependencyRegistry, InjectableFactory } from '@travetto/di';
import { Test, Suite, BeforeAll } from '@travetto/test';

import { MailTemplateEngine, MailTransport, NullTransport } from '@travetto/email';
import { DefaultMailTemplateEngine } from '@travetto/email-template';
import { EmailService } from '../../src/service/email';

class Config {
  @InjectableFactory()
  static getTransport(): MailTransport {
    return new NullTransport();
  }
}

DefaultMailTemplateEngine.name;
EmailService.name;

const body = `<style>
  strong { color: orange }
</style>
<strong>{{name}}</strong>`;

const context = { name: 'Brad' };

@Suite('Email Service')
class EmailServiceTest {
  @BeforeAll()
  async init() {
    await DependencyRegistry.init();
  }

  @Test('Verify Templating')
  async templating() {
    const tplr = await DependencyRegistry.getInstance(MailTemplateEngine);
    const result = (await tplr.template(body, context)).html;

    assert(/<strong>\s*Brad\s*<\/strong>/.test(result));
  }

  @Test('Send email')
  async sendEmail() {
    const service = await DependencyRegistry.getInstance(EmailService);
    await service.sendEmail([], { to: 'tim@eaiti.com', subject: 'Test', template: body, context });
    assert(true);
  }
}
import { EmailService } from '../../src/service/email';
import { DependencyRegistry, Injectable } from '@travetto/di';
import { Test, Suite, BeforeAll } from '@travetto/test';
import { RootRegistry } from '@travetto/registry';

import * as assert from 'assert';
import { MailConfig } from '@travetto/email/src/config';

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
    const service = await DependencyRegistry.getInstance(EmailService);
    const result = service.template(body, context);

    assert(/<strong style="color: orange;">\s*Brad\s*<\/strong>/.test(result));
  }

  @Test('Send email')
  async sendEmail() {
    const service = await DependencyRegistry.getInstance(EmailService);
    await service.sendEmail([], { to: 'tim@eaiti.com', subject: 'Test', body, context });
    assert(true);
  }
}
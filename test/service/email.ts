import { EmailService } from '../../src/service/email';
import { DependencyRegistry, Injectable } from '@travetto/di';
import { Test, Suite, BeforeAll } from '@travetto/test';
import { RootRegistry } from '@travetto/registry';

import * as assert from 'assert';
import { MailConfig } from '@travetto/email/src/config';

let body = `<style>
  strong { color: orange }
</style>
<strong>{{name}}</strong>`;

let context = { name: 'Brad' };


@Suite('Email Service')
class EmailServiceTest {
  @BeforeAll()
  async init() {
    await RootRegistry.init();
  }

  @Test('Verify Templating')
  async templating() {
    let service = await DependencyRegistry.getInstance(EmailService);
    let result = service.template(body, context);

    assert(/<strong style="color: orange;">\s*Brad\s*<\/strong>/.test(result));
  }

  @Test('Send email')
  async sendEmail() {
    let service = await DependencyRegistry.getInstance(EmailService);
    await service.sendEmail([], { to: 'tim@eaiti.com', subject: 'Test', body, context });
  }
}
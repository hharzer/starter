import { EmailService } from '../../app/service/email';
import { expect } from "chai";

let body = `<style>
  strong { color: orange }
</style>
**{{name}}**`;
let context = { name: 'Brad' };

describe("Email Service", () => {
  it("Verify Templating", () => {
    let result = EmailService.template(body, context);

    expect(result).equals(
      `<p>
<strong style="color: orange;">Brad</strong></p>
`
    );
  });

  it("Send email", async () => {
    await EmailService.sendEmail("tim@eaiti.com", "Test", body, context);
  })
});
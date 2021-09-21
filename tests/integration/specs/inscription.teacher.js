const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const register = require('../opensteam/register');

const MailSlurp = require("mailslurp-client").default;
const apiKey = "f40a859a0a668b43e7b6d2bd30ca9477488992aec04ee891f8836aaee402f8bf";
const mailslurp = new MailSlurp({ apiKey });
let inbox;
let href;
describe("Teacher try to subscribe", () => {
    it("Click login on first page", async () => {
        await page.open('login.php');
        await page.clickButtonWhenDisplayed(await selector.buttonConnexionFirstPage);
    });

    it("Click Register on portal page", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonRegisterSecondPage);
    });

    it("Complete formular", async () => {
        inbox = await mailslurp.createInbox();
        await register.completeFormular("Cabri" + page.randomNumberBetween1to100(), "Log" + page.randomNumberBetween1to100(), "Temporary", inbox.emailAddress, "Azerty@" + page.randomNumberBetween1to100());
    });

    it("Confirm email", async () => {
        const email = await mailslurp.waitForLatestEmail(inbox.id);
        const pattern = /<a[^>]*href=["']([^"']*)["']/g;
        href = pattern.exec(email.body)[1];
        await browser.url(href);
    });

    it("Login with your account", async () => {
        await login.login(register.email, register.password);
        const isDisplayed = page.waitElementDisplayed(await selector.accessibilityButton);
        expect(isDisplayed).toBeTruthy();
    });
});



const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');
const activities = require('../opensteam/activities');

describe("Learner join class with invitation link", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Create class", async () => {
        await classes.createClass();
    });

    it("Click on classes", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
    });

    it("Open classroom", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonOpenClass);
        await page.clickButtonWhenDisplayed(await selector.copyLinkButton);
        const urlCopySpan = await selector.urlCopySpan;
        const urlSpans = await urlCopySpan.$$("span");
        const text = await urlSpans[0].getText();
        console.log("testzz ", text);
    });


/*    it("Delete class", async () => {
        await classes.deleteClass();
    });*/
});

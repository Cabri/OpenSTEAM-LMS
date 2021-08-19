const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');

describe("Creation of activity", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Click on activity button", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonMyActivities);
    });

    it("Click on create activity button", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonCreateActivities);
    });

    it("Complete title of activity", async () => {
        const input = await selector.inputTitleActivity;
        const activityTitle = "Made circle" + page.randomNumberBetween1to100();
        await page.input(input, activityTitle);
    });

    it("Open modal insert boor url", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonInsertBook);
    });

    it("Insert book url", async () => {
        const input = await selector.inputBookURL;
        const link = "https://cabricloud.com/cabriexpress/";
        await page.input(input, link);
        await page.clickButtonWhenDisplayed(await selector.buttonSaveURL);
    });

    it("Save and validate creation of activities", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonValidateCreationActivity);
    });

    it("Activities was created", async () => {
        await classes.checkSuccess();
    });

/*    it("delete class was created", async () => {
        await classes.deleteClass();
    });*/
});

const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');
const activities = require('../opensteam/activities');

describe("Delete activity", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Create class", async () => {
        await activities.createActivity();
    });

    it("Click on my activity button", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonMyActivities);
    })

    it("Click on delete button", async () => {
        await page.defineConfirm(); // stay here to works
        const settingsDropdownDeleteActivityButton = await selector.settingsDropdownDeleteActivityButton;
        const settingsButtonOnActivityCard = await selector.settingsButtonOnActivityCard;
        await page.waitForExist(settingsButtonOnActivityCard);
        await page.clickButtonWhenDisplayed(settingsButtonOnActivityCard);
        await page.waitForExist(settingsDropdownDeleteActivityButton);
        await page.clickButtonWhenDisplayed(settingsDropdownDeleteActivityButton);
    });

    it("Check class was deleted", async () => {
        await classes.checkSuccess();
    });
});

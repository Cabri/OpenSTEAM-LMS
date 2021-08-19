const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');
const activities = require('../opensteam/activities');

describe("Sort activity", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Create class 1", async () => {
        await activities.createActivity();
    });

    it("Create class 2", async () => {
        await activities.createActivity();
    });

    it("Click on button class", async () => {
        const buttonMyActivities = await selector.buttonMyActivities;
        await page.waitForExist(buttonMyActivities);
        await page.clickButtonWhenDisplayed(buttonMyActivities);

        const lastActivity = await selector.lastActivity;
        activities.filter.beforeFilterLastActivity = await lastActivity.getText();
    });

    it("Filter from newest to oldest", async () => {
        const filterList = await selector.filterActivitiesSelect;
        await filterList.selectByIndex(1);

        const firstActivity = await selector.firstActivity;
        activities.filter.afterFilterFirstActivity = await firstActivity.getText();
        await activities.checkFilter();
    });

    it("delete all class", async () => {
        await activities.deleteActivity();
        await activities.deleteActivity();
    });
});

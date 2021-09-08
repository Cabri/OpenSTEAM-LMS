const selector = require("../opensteam/selector");
const page = require("../opensteam/page");
const classes = require("../opensteam/classes");

class Activities {
    constructor() {
        this.title = "Activity Name";
        this.bookUrl = "https://cabricloud.com/cabriexpress/";
        this.filter = {
            beforeFilterLastActivity: [],
            afterFilterFirstActivity: []
        }
/* TODO : if bug with settings button
this.settings = {
            attribute: async function () {
                await browser.execute(() => {
                    document.querySelector("#list-activities-teacher .dropdown .dropdown-menu li:nth-child(1)").click();
                });
            },
            duplicate: async function () {
                await browser.execute(() => {
                    document.querySelector("#list-activities-teacher .dropdown .dropdown-menu li:nth-child(2)").click();
                });
            },
            modify: async function () {
                await browser.execute(() => {
                    document.querySelector("#list-activities-teacher .dropdown .dropdown-menu li:nth-child(3)").click();
                });
            },
            delete: async function () {
                await browser.execute(() => {
                    document.querySelector("#list-activities-teacher .dropdown .dropdown-menu li:nth-child(4)").click();
                });
            },
        }*/
    }
    async checkFilter () {
        const isFilterWorks = this.filter.beforeFilterLastActivity === this.filter.afterFilterFirstActivity;
        expect(isFilterWorks).toBeTruthy();
    }

    async createActivity (check = true) {
        await page.clickButtonWhenDisplayed(await selector.buttonMyActivities);
        if (check) expect(!await this.isActivityExist()).toBeTruthy();

        await page.clickButtonWhenDisplayed(await selector.buttonCreateActivities);

        const inputTitle = await selector.inputTitleActivity;
        const activityTitle = this.title + page.randomNumberBetween1to100();
        await page.input(inputTitle, activityTitle);

        await page.clickButtonWhenDisplayed(await selector.buttonInsertBook);

        const inputUrl = await selector.inputBookURL;
        const link = this.bookUrl;
        await page.input(inputUrl, link);
        await page.clickButtonWhenDisplayed(await selector.buttonSaveURL);

        await page.clickButtonWhenDisplayed(await selector.buttonValidateCreationActivity);

        await classes.checkSuccess();

        await page.clickButtonWhenDisplayed(await selector.buttonMyActivities);
        if (check) expect(await this.isActivityExistAndWaitDisplay()).toBeTruthy();
    }

    async deleteActivity (check = true) {
        await page.clickButtonWhenDisplayed(await selector.buttonMyActivities);
        if (check) expect(await this.isActivityExistAndWaitDisplay()).toBeTruthy();

        await page.defineConfirm(); // stay here to works
        const settingsDropdownDeleteActivityButton = await selector.settingsDropdownDeleteActivityButton;
        const settingsButtonOnActivityCard = await selector.settingsButtonOnActivityCard;
        await page.waitForExist(settingsButtonOnActivityCard);
        await page.clickButtonWhenDisplayed(settingsButtonOnActivityCard);
        await page.waitForExist(settingsDropdownDeleteActivityButton);
        await page.clickButtonWhenDisplayed(settingsDropdownDeleteActivityButton);

        await classes.checkSuccess();

        await page.clickButtonWhenDisplayed(await selector.buttonMyActivities);
        if (check) expect(!await this.isActivityExist()).toBeTruthy();
    }

    async clickSettingsButton (action) {
        const settingsButtonOnActivityCard = await selector.settingsButtonOnActivityCard;
        await page.waitElementDisplayed(settingsButtonOnActivityCard);
        await action();
    }

    async isActivityExist () {
        const firstActivityCreated = await selector.firstActivityCreated;
        return await firstActivityCreated.isExisting();
    }

    async isActivityExistAndWaitDisplay () {
        const firstActivityCreated = await selector.firstActivityCreated;
        await page.waitElementDisplayed(firstActivityCreated);
        return await firstActivityCreated.isExisting();
    }

    async isAttributeActivityExist () {
        const firstAttributedActivity = await selector.firstAttributedActivity;
        return await firstAttributedActivity.isExisting();
    }
}

module.exports = new Activities();
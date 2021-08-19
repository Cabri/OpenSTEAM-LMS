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
    }
    async checkFilter () {
        console.log("filterZZ", this.filter);
        const isFilterWorks = this.filter.beforeFilterLastActivity === this.filter.afterFilterFirstActivity;
        expect(isFilterWorks).toBeTruthy();
    }
    async createActivity () {
        await page.clickButtonWhenDisplayed(await selector.buttonMyActivities);

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
    }

    async deleteActivity () {
        await page.clickButtonWhenDisplayed(await selector.buttonMyActivities);

        await page.defineConfirm(); // stay here to works
        const settingsDropdownDeleteActivityButton = await selector.settingsDropdownDeleteActivityButton;
        const settingsButtonOnActivityCard = await selector.settingsButtonOnActivityCard;
        await page.waitForExist(settingsButtonOnActivityCard);
        await page.clickButtonWhenDisplayed(settingsButtonOnActivityCard);
        await page.waitForExist(settingsDropdownDeleteActivityButton);
        await page.clickButtonWhenDisplayed(settingsDropdownDeleteActivityButton);

        await classes.checkSuccess();
    }
}

module.exports = new Activities();
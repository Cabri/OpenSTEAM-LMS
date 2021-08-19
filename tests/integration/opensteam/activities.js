const selector = require("../opensteam/selector");
const page = require("../opensteam/page");
const classes = require("../opensteam/classes");

class Activities {
    constructor() {
        this.title = "Activity Name";
        this.bookUrl = "https://cabricloud.com/cabriexpress/";
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
    // TODO : delete acticity
  /*  async deleteActvity () {
        await page.defineConfirm(true);

        const buttonProfile = await selector.buttonProfile;
        const buttonClasses = await selector.buttonClasses;
        const settingsButtonOnClassCard = await selector.settingsButtonOnClassCard;
        const settingsDropdownDeleteButton = await selector.settingsDropdownDeleteButton;

        await page.waitForExist(buttonProfile);
        await page.clickButtonWhenDisplayed(buttonProfile);

        await page.waitForExist(buttonClasses);
        await page.clickButtonWhenDisplayed(buttonClasses);

        await page.waitForExist(settingsButtonOnClassCard);
        await page.clickButtonWhenDisplayed(settingsButtonOnClassCard);

        await page.waitForExist(settingsDropdownDeleteButton);
        await page.clickButtonWhenDisplayed(settingsDropdownDeleteButton);

        await this.checkSuccess();
    }*/
}

module.exports = new Activities();
const selector = require("../opensteam/selector");
const page = require("../opensteam/page");
const login = require("../opensteam/login");

class Classes {
    constructor() {
        this.className = "";
        this.schoolName = "";
    }

    async inputInForm (className, schoolName) {
        this.className = className;
        this.schoolName = schoolName;

        await page.input(await selector.inputClassName, className);
        await page.input(await selector.inputSchoolName, schoolName);
    }

    async addLearner(learnerName) {
        await page.clickButtonWhenDisplayed(await selector.buttonAddLearner);
        await page.input(await selector.inputLearnerName, learnerName);
        await page.clickButtonWhenDisplayed(await selector.buttonAddLearnerInModal);

    }
    // TODO : move in page.js
    async checkSuccess () {
        const success = /status-success/g;
        let notifOfUpdateInformation = await selector.notifOfUpdateInformation;

        await page.waitElementDisplayed(notifOfUpdateInformation);

        let classAttrsOfNotif = await notifOfUpdateInformation.getAttribute('class');
        if (classAttrsOfNotif.match(success) === null) {
            expect(false).toBeTruthy();
        } else {
            expect(true).toBeTruthy();
        }
    }

    async createClass () {
        const buttonClasses = await selector.buttonClasses;
        const buttonCreateClass = await selector.buttonCreateClass;
        const buttonSaveClass = await selector.buttonSaveClass;

        await page.clickButtonWhenDisplayed(buttonClasses);
        await page.clickButtonWhenDisplayed(buttonCreateClass);

        const className = "Class " + page.randomNumberBetween1to100();
        const schoolName = "UTBM" + page.randomNumberBetween1to100();
        await this.inputInForm(className, schoolName);

        await page.clickButtonWhenDisplayed(buttonSaveClass);

        await this.checkSuccess();
    }

    async deleteClass () {
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
    }


}

module.exports = new Classes();
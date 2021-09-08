const selector = require("../opensteam/selector");
const page = require("../opensteam/page");
const login = require("../opensteam/login");

class Classes {
    constructor() {
        this.className = "";
        this.schoolName = "";
        this.settings = {
            modify: async function () {
                await browser.execute(() => {
                    document.querySelector("#classroom-dashboard-classes-panel-teacher .dropdown .dropdown-menu li:nth-child(1)").click();
                });
            },
            delete: async function () {
                await browser.execute(() => {
                    document.querySelector("#classroom-dashboard-classes-panel-teacher .dropdown .dropdown-menu li:nth-child(2)").click();
                });
            },
        }
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
        expect(!await this.isClassExist()).toBeTruthy();
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

        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
        expect(await this.isClassExist()).toBeTruthy();
    }

    async deleteClass () {
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
        expect(await this.isClassExist()).toBeTruthy();
        await page.defineConfirm(true);

        const buttonProfile = await selector.buttonProfile;
        const buttonClasses = await selector.buttonClasses;

        await page.defineConfirm();

        await page.waitForExist(buttonProfile);
        await page.clickButtonWhenDisplayed(buttonProfile);

        await page.waitForExist(buttonClasses);
        await page.clickButtonWhenDisplayed(buttonClasses);

        await this.clickSettingsButton(this.settings.delete);

        await this.checkSuccess();

        // tricks to refresh classes
        await page.clickButtonWhenDisplayed(await selector.buttonProfile);
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);

        expect(!await this.isClassExist()).toBeTruthy();
    }

    async clickSettingsButton (action) {
        const settingsButtonOnClassCard = await selector.settingsButtonOnClassCard;
        await page.waitElementDisplayed(settingsButtonOnClassCard);
        await action();
    }

    async isClassExist () {
        const classNameOnClassCard = await selector.classNameOnClassCard;
        return await classNameOnClassCard.isExisting();
    }

}

module.exports = new Classes();
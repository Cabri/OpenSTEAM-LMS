require('dotenv').config({ path: '../../.env' });
require('dotenv').config({ path: '../.env' });

const selector = require("../opensteam/selector");
const page = require("../opensteam/page");

class Login {
    constructor() {
        this.email = process.env.ADMIN_EMAIL;
        this.password = process.env.ADMIN_PASSWORD;
    }

    async inputEmailAndPassword (email, password) {
        expect(selector.emailInput).toBeDisplayed();
        expect(selector.passwordInput).toBeDisplayed();
        expect(selector.buttonConnexionThirdPage).toBeDisplayed();

        expect(selector.buttonConnexionThirdPage).toBeDisabled();

        let emailInput = await selector.emailInput;
        let passwordInput = await selector.passwordInput;

        await emailInput.setValue(email);
        await passwordInput.setValue(password);

        expect(selector.buttonConnexionThirdPage).toBeEnabled();
    }

    async login (email, password) {
        let buttonConnexionFirstPage = await selector.buttonConnexionFirstPage;
        await page.clickButtonWhenDisplayed(buttonConnexionFirstPage);

        let buttonConnexionSecondPage = await selector.buttonConnexionSecondPage;
        await page.clickButtonWhenDisplayed(buttonConnexionSecondPage);

        let buttonConnexionThirdPage = await selector.buttonConnexionThirdPage;
        await page.waitElementDisplayed(buttonConnexionThirdPage);
        await this.inputEmailAndPassword(email, password);
        await page.clickOnButton(buttonConnexionThirdPage);
    }

    async logout () {
        await page.clickButtonWhenDisplayed(await selector.buttonProfile);
        await page.clickButtonWhenDisplayed(await selector.logoutButton);
    }
}

module.exports = new Login();
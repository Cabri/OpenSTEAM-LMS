const selector = require("../opensteam/selector");
const page = require("../opensteam/page");
const login = require("../opensteam/login");

class Register {
    constructor() {
        this.firstname = "";
        this.lastname = "";
        this.nickname = "";
        this.email = "";
        this.password = "";
    }

    async inputFirstName (firstname) {
        let formInputFirstName = await selector.formInputFirstName;

        expect(formInputFirstName).toBeDisplayed();

        await formInputFirstName.setValue(firstname);
    }

    async inputLastName (lastname) {
        let formInputLastName = await selector.formInputLastName;

        expect(formInputLastName).toBeDisplayed();

        await formInputLastName.setValue(lastname);
    }

    async inputNickname (lastname) {
        let formInputNickname = await selector.formInputNickname;

        expect(formInputNickname).toBeDisplayed();

        await formInputNickname.setValue(lastname);
    }

    async inputEmail (email) {
        let formInputEmail = await selector.formInputEmail;

        expect(formInputEmail).toBeDisplayed();

        await formInputEmail.setValue(email);
    }

    async inputPasswords (password) {
        let formInputPassword = await selector.formInputPassword;
        let formInputConfirmPassword = await selector.formInputConfirmPassword;

        expect(formInputPassword).toBeDisplayed();
        expect(formInputConfirmPassword).toBeDisplayed();

        await formInputPassword.setValue(password);
        await formInputConfirmPassword.setValue(password);
    }

    async inputInForm (firstname, lastname, nickname, email, password) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.nickname = nickname;
        this.email = email;
        this.password = password;
        if(firstname)
            await this.inputFirstName(firstname);
        if(lastname)
            await this.inputLastName(lastname);
        if(nickname)
            await this.inputNickname(nickname);
        if(email)
            await this.inputEmail(email);
        if(password)
            await this.inputPasswords(password);
    }

    async completeFormular (firstname, lastname, nickname, email, password) {
        await this.inputInForm(firstname, lastname, nickname, email, password);
        await page.clickButtonWhenDisplayed(await selector.formButtonRegister);
    }

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
}

module.exports = new Register();
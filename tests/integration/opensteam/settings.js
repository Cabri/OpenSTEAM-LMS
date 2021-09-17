const selector = require("../opensteam/selector");
const page = require("../opensteam/page");
const login = require("../opensteam/login");

class Settings {
    constructor() {
        this.formInformations = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
        };
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

    async inputInForm (firstname, lastname, email, password) {
        this.formInformations.firstname = firstname;
        this.formInformations.lastname = lastname;
        this.formInformations.email = email;
        this.formInformations.password = password;
        if(firstname)
            await this.inputFirstName(firstname);
        if(lastname)
            await this.inputLastName(lastname);
        if(email)
            await this.inputEmail(email);
        if(password)
            await this.inputPasswords(password);
    }

    async completeFormular (firstname, lastname, email, password) {
        await this.inputInForm(firstname, lastname, email, password);
        await page.clickButtonWhenDisplayed(await selector.formButtonUpdate);
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

    async checkTeacherName () {
        let teacherName = await selector.teacherName;

        await page.waitElementDisplayed(teacherName);

        let textOfTeacherName = await teacherName.getText();
        const pieceOfTeacherName = textOfTeacherName.split(' ');

        const isRightName = pieceOfTeacherName[0] === this.formInformations.firstname
            && pieceOfTeacherName[1] === this.formInformations.lastname;

        if(!isRightName)
            console.log("bad update of teacher name");

        expect(isRightName).toBeTruthy();
    }

    async modifyProfileTeacher(email, password) {
        await login.login(this.formInformations.email, this.formInformations.password);
        const isDisplayed = page.waitElementDisplayed(await selector.accessibilityButton);
        expect(isDisplayed).toBeTruthy();
        await page.clickButtonWhenDisplayed(await selector.buttonProfile);
        await page.clickButtonWhenDisplayed(await selector.buttonSettings);
        // the popup
        await page.clickButtonWhenDisplayed(await selector.buttonGoToProfile);
        await this.completeFormular("Cabri", "Log", email, password);
        await this.checkSuccess();
    }
}

module.exports = new Settings();
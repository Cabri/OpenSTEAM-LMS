const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');

describe("Update of classroom", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Create class", async () => {
        await classes.createClass();
    });

    it("Click on modify button", async () => {
        await classes.clickSettingsButton(classes.settings.modify);
    });

    it("Change name of class and school", async () => {
        const className = "Class " + page.randomNumberBetween1to100();
        const schoolName = "UTBM" + page.randomNumberBetween1to100();
        await classes.inputInForm(className, schoolName);
    });

    it("Save class", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonSaveClass);
    });

    it("Notification - Class was modified", async () => {
        await classes.checkSuccess();
    });

    it("Class was modified", async () => {
        // tricks to refresh classes
        await page.clickButtonWhenDisplayed(await selector.buttonProfile);
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);

        const classNameOnClassCard = await selector.classNameOnClassCard;
        const className = await classNameOnClassCard.getText();

        expect(classes.className.toLowerCase() === className.toLowerCase()).toBeTruthy();
    });

    it("delete class was created", async () => {
        await classes.deleteClass();
    });

});

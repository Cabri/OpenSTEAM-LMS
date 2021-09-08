const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');

describe("Delete of classroom", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Create class", async () => {
        await classes.createClass();
    });

    it("Click on delete button", async () => {
        await page.defineConfirm(); // stay here to works
        await classes.clickSettingsButton(classes.settings.delete);
    });

    it("Notification - Check class was deleted", async () => {
        await classes.checkSuccess();
    });

    it("Check class was deleted", async () => {
        // tricks to refresh classes panel
        await page.clickButtonWhenDisplayed(await selector.buttonProfile);
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);

        expect(!await classes.isClassExist()).toBeTruthy();
    });
});

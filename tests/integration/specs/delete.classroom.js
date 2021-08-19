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

    it("Click on classes button", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
    });

    it("Click on delete button", async () => {
        await page.defineConfirm(); // stay here to works
        const settingsButtonOnClassCard = await selector.settingsButtonOnClassCard;
        const settingsDropdownDeleteButton = await selector.settingsDropdownDeleteButton;
        await page.waitForExist(settingsButtonOnClassCard);
        await page.clickButtonWhenDisplayed(settingsButtonOnClassCard);
        await page.waitForExist(settingsDropdownDeleteButton);
        await page.clickButtonWhenDisplayed(settingsDropdownDeleteButton);
    });

    it("Check class was deleted", async () => {
        await classes.checkSuccess();
    });
});

const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');

describe("Add a learner in class", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Create class", async () => {
        await classes.createClass();
    });

    it("Click on classes", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
    });

    it("Open classroom", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonOpenClass);
    });

    it("Click on add learner", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonAddLearnerInClass);
    });

    it("Input learner name", async () => {
        const input = await selector.inputLearnerName;
        const name = "Imad";
        await page.input(input, name);
        await page.clickButtonWhenDisplayed(await selector.buttonAddLearnerInModal);
    });

    it("Activities was created", async () => {
        await classes.checkSuccess();
    });

    it("delete class was created", async () => {
        await classes.deleteClass();
    });
});

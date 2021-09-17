const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');

const name = "Imad";

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
        await page.input(input, name);
        await page.clickButtonWhenDisplayed(await selector.buttonAddLearnerInModal);
    });

    it("Notification - learner was added", async () => {
        await classes.checkSuccess();
    });

    it("Reopen classroom", async () => {
        // allow to refresh added learner
        await page.clickButtonWhenDisplayed(await selector.buttonProfile);
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
        await page.clickButtonWhenDisplayed(await selector.buttonOpenClass);
    });

    it("learner was added", async () => {
        const firstLearnerInClass = await selector.firstLearnerInClass;
        const learnerName = await firstLearnerInClass.getText();
        console.log("learner: " + learnerName + " " + name);
        expect(name.toLowerCase() === learnerName.toLowerCase()).toBeTruthy();
    });

    it("delete class was created", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonProfile);
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
        await classes.deleteClass();
    });
});

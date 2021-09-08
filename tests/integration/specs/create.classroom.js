const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');

describe("Creation of classroom", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Click on classes button", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
    });

    it("Click on create class button", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonCreateClass);
    });

    it("Complete name of class and school", async () => {
        const className = "Class " + page.randomNumberBetween1to100();
        const schoolName = "UTBM" + page.randomNumberBetween1to100();
        await classes.inputInForm(className, schoolName);
    });

    it("Add two learner", async () => {
        await classes.addLearner("Paul");
        await classes.addLearner("Seif");
        await page.waitForExist(await selector.secondLearnerInTable);
        await page.checkNumberOfElements(await selector.tableLearner, 2);
    });

    it("Remove one learner", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonRemoveLearner);
        await page.waitForNotExist(await selector.secondLearnerInTable);
        await page.checkNumberOfElements(await selector.tableLearner, 1);
    });

    it("Save class", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonSaveClass);
    });

    it("Notification - Class was created", async () => {
        await classes.checkSuccess();
    });

    it("Class was created", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);

        const classNameOnClassCard = await selector.classNameOnClassCard;
        const className = await classNameOnClassCard.getText();

        expect(classes.className.toLowerCase() === className.toLowerCase()).toBeTruthy();
    });

    it("delete class", async () => {
        await classes.deleteClass();
    });
});

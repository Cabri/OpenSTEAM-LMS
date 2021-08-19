const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');
const activities = require('../opensteam/activities');

describe("Attribute an activity", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Create class", async () => {
        await classes.createClass();
    });

    it("Create activity", async () => {
        await activities.createActivity();
    });

    it("Click on my activity button", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonMyActivities);
    })

    it("Click on attribute button button", async () => {
        const settingsDropdownAttributeButton = await selector.settingsDropdownAttributeActivityButton;
        const settingsButtonOnActivityCard = await selector.settingsButtonOnActivityCard;
        await page.waitForExist(settingsButtonOnActivityCard);
        await page.clickButtonWhenDisplayed(settingsButtonOnActivityCard);
        await page.waitForExist(settingsDropdownAttributeButton);
        await page.clickButtonWhenDisplayed(settingsDropdownAttributeButton);
    });

    it("Select the learners", async () => {
        const selectLearnersButton = await selector.selectLearnersButton;
        await page.clickOnButton(selectLearnersButton);
        const checkBoxClassModal = await selector.checkBoxClassModal;
        await page.clickButtonWhenDisplayed(checkBoxClassModal);
        const validateSelectClassModal = await selector.validateSelectClassModal;
        await page.clickButtonWhenDisplayed(validateSelectClassModal);
    });

    it("Enter specific instructions", async () => {
        const specificInstructionForTheseLearners = await selector.specificInstructionForTheseLearners;
        const instructions = "Exercice one draw a cricle \n and a cube";
        await page.input(specificInstructionForTheseLearners, instructions);
    });

    // TODO : remove activity

    it("Delete class", async () => {
        await classes.deleteClass();
    });

    it("Activities was created", async () => {
        await classes.checkSuccess();
    });

/*    it("delete class was created", async () => {
        await classes.deleteClass();
    });*/
});

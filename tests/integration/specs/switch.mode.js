const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');
const activities = require('../opensteam/activities');

describe("Switch learner/teacher", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Create class", async () => {
        await classes.createClass();
    });

    it("Click on my profils button", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonProfile);
    });

    it("From teacher to learner", async () => {
        await page.clickButtonWhenDisplayed(await selector.panelTeacherSwitchButton);
        await page.clickButtonWhenDisplayed(await selector.selectClassRadioButton);
        await page.clickButtonWhenDisplayed(await selector.validateSwitchLearnerMode);
        expect(await page.waitElementDisplayed(await selector.panelLearner)).toBeTruthy();
    });

    it("From learner to teacher", async () => {
        await page.clickButtonWhenDisplayed(await selector.panelLearnerSwitchButton);
        expect(await page.waitElementDisplayed(await selector.panelTeacher)).toBeTruthy();
    });

    it("Delete class", async () => {
        await classes.deleteClass();
    });
});

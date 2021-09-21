const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');

const nameOfLearner = "Marine";
let urlText = "";

describe("Learner join class with invitation link", () => {
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

    it("Copy link to join classroom", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonOpenClass);
        await page.clickButtonWhenDisplayed(await selector.copyLinkButton);
        const urlCopySpan = await selector.urlCopySpan;
        const urlHTML = await urlCopySpan.getHTML();
        urlText = urlHTML.replace(/<(?:.|\n)*?>/gm, '');
    });

    it("Logout from the teacher mode", async () => {
        await login.logout();
        await page.waitElementDisplayed(await selector.mainCabriCom);
    });

    it("Join class", async () => {
        let cookies = await browser.deleteCookies();

        await page.open("/login.php")
        await page.clickButtonWhenDisplayed(await selector.buttonConnexionFirstPage)

        await page.input(await selector.learnerNameInput, nameOfLearner);
        await page.clickButtonWhenDisplayed(await selector.confirmJoinButton);

        expect(await page.waitElementDisplayed(await selector.panelLearner)).toBeTruthy();
    });

    it("Logout from learner", async () => {
        const logoutButtonLearner = await selector.panelLearner.$(".btn:last-child")
        await page.clickButtonWhenDisplayed(await logoutButtonLearner);
        expect(await page.waitElementDisplayed(await selector.mainCabriCom)).toBeTruthy();
    });

    it("switch window dans login to teacher account", async () => {
        const handles = await browser.getWindowHandles();

        await browser.closeWindow()
        await browser.switchToWindow(handles[0])
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Learner has joined", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
        await page.clickButtonWhenDisplayed(await selector.buttonOpenClass);
        const firstLearnerInClass = await selector.firstLearnerInClass;
        const learnerName = await firstLearnerInClass.getText();
        console.log("learnerName" + nameOfLearner + " " + learnerName)
        expect(nameOfLearner.toLowerCase() === learnerName.toLowerCase()).toBeTruthy();
    });


    it("Delete class", async () => {
        await classes.deleteClass();
    });
});

const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const settings = require('../opensteam/settings');




describe("Teacher login on OpenSTEAM LMS", () => {
    it("login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
        const isDisplayed = page.waitElementDisplayed(await selector.accessibilityButton);
        expect(isDisplayed).toBeTruthy();
    });

    it("Go to the profile page", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonProfile);
    });

    it("Go to settings", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonSettings);
        // the popup
        await page.clickButtonWhenDisplayed(await selector.buttonGoToProfile);
    });

    it("Modify profile informations", async () => {
        await settings.completeFormular("Cabri" + page.randomNumberBetween1to100(), "Log" + page.randomNumberBetween1to100(), "cabri@cabri.com", "newPassword123@");
        await settings.checkSuccess();
    });

    it("Logout", async () => {
        page.clickOnButton(await selector.buttonProfile);
        await page.clickButtonWhenDisplayed(await selector.logoutButton);
    });

    it("Login with new informations", async () => {
        await page.open('login.php');
        await login.login(settings.formInformations.email, settings.formInformations.password);
        let isDiplayed = await page.waitElementDisplayed(await selector.accessibilityButton);
        expect(isDiplayed).toBeTruthy();
    });

    it("Check profile update", async () => {
        page.clickOnButton(await selector.buttonProfile);
        await settings.checkTeacherName();
    });

    it("Restore email and password", async () => {
        page.clickOnButton(await selector.buttonProfile);
        page.clickOnButton(await selector.logoutButton);
        await settings.modifyProfileTeacher(login.email, login.password);
    });
});



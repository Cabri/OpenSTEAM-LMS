const { alertIsPresent } = require('wdio-wait-for');

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    open (path) {
        return browser.url(`/classroom/` + path)
    }

    // important to accept a Alert pop-up
    async defineAlert() {
        await browser.execute(() => {
            window.alert = () => {
                return true;
            }
        });
    }

    // important to accept a confirm pop-up
    async defineConfirm() {
        await browser.execute(() => {
           window.confirm = () => {
               return true;
           }
        });
        return true;
    }

    clickOnButton (button) {
        button.scrollIntoView();
        expect(button).toBeDisplayedInViewport();
        button.click();
    }

    async waitElementDisplayed (selector) {
        return await browser.waitUntil(async () => {
            return await (selector).isDisplayedInViewport();
        },{
            timeout: 35000,
            timeoutMsg: "Element never appear"
        });
    }

    async clickButtonWhenDisplayed(selector) {
        selector.scrollIntoView();
        let isDisplay = await this.waitElementDisplayed(selector);
        this.clickOnButton(selector);
        expect(isDisplay).toBeTruthy();
    }

    async checkNumberOfElements(selector, wantedNumber) {
        const number = selector.length;
        expect(number === wantedNumber).toBeTruthy();
    }

    randomNumberBetween1to100() {
        return Math.floor(Math.random() * 100);
    }

    waitForExist(selector) {
        selector.waitForExist({timeout: 30000});
    }

    waitForNotExist(selector) {
        selector.waitForExist({timeout: 30000, reverse: true});
    }

    async waitAlertOpen () {
        return await browser.waitUntil(alertIsPresent(),
            { timeout: 5000,
                timeoutMsg: 'Failed, after waiting for the alert to be present'
            })
    }

    async input (selector, input) {
        if(input) {
            expect(selector).toBeDisplayed();
            await selector.setValue(input);
        } else {
            expect(false).toBeTruthy();
        }
    }
}

module.exports = new Page();
import { Builder, By, Key, until } from 'selenium-webdriver';
import secret from './secrets.js';
async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
class TinderBot {

    constructor() {
        this.driver = new Builder().forBrowser('chrome').build();
    }

    async login() {
        try {
            await this.driver.get('https://tinder.com');
            await sleep(5000);
            await (await this.driver.findElement(By.xpath('//*[@id="modal-manager"]/div/div/div/div/div[3]/div[2]/button'))).click();
            await sleep(2000);
            let parent = await this.driver.getWindowHandle();
            let windows = await this.driver.getAllWindowHandles();
            await this.driver.switchTo().window(windows[1]);
            await sleep(1000);
            await (await this.driver.findElement(By.xpath('//*[@id="email"]'))).sendKeys(secret.email);
            await (await this.driver.findElement(By.xpath('//*[@id="pass"]'))).sendKeys(secret.password);
            await (await this.driver.findElement(By.xpath('//*[@id="u_0_0"]'))).click();
            await this.driver.switchTo().window(windows[0]);
            await sleep(2000);
            await (await this.driver.findElement(By.xpath('//*[@id="modal-manager"]/div/div/div/div/div[3]/button[1]'))).click();
            await sleep(2000);
            await (await this.driver.findElement(By.xpath('//*[@id="modal-manager"]/div/div/div/div/div[3]/button[1]'))).click();
        } catch (err) {
            console.error(err);
        }

    }

    async like() {
        await (await this.driver.findElement(By.xpath('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/button[3]'))).click();
    }

    async dislike() {
        await (await this.driver.findElement(By.xpath('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/button[1]'))).click();
    }

    async close_popup() {
        await (await this.driver.findElement(By.xpath('//*[@id="modal-manager"]/div/div/div[2]/button[2]'))).click();
    }

    async close_match() {
        await (await this.driver.findElement(By.xpath('//*[@id="modal-manager-canvas"]/div/div/div[1]/div/div[3]/a'))).click();
    }

    async auto_swipe() {
        let swipe = true;
        while (swipe) {
            await sleep(1000);
            try {
                await this.like();
            } catch (err) {
                try {
                    await this.close_popup();
                } catch (err) {
                    try {
                        await this.close_match();
                    } catch (err) {
                        process.exit(1);
                    }

                }
            }
        }
    }

}

(async() => {
    const bot = new TinderBot();
    await bot.login();
    for (const [index, arg] of process.argv.entries()) {
        if (arg === "--auto_swipe") {
            if (process.argv[index + 1] === "true") {
                console.log("auto swipe");
                try {
                    await bot.auto_swipe();
                } catch (err) {
                    process.exit(1);
                }

            }
        }
    }
})();
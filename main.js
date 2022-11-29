import assert from "node:assert/strict";
import { setTimeout } from "timers/promises";
import { Builder, By } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";

const options = new Options()
  .addArguments([
    // "--no-sandbox",
    // "--disable-dev-shm-usage",
    // "--remote-debugging-port=9222",
    // "--ignore-certificate-errors",
    // "--use-fake-device-for-media-stream",
    // "--use-fake-ui-for-media-stream",
    // "--disable-web-security",
    // "--disable-site-isolation-trials",
  ])
  .headless();
const driver = new Builder()
  .withCapabilities({
    browserName: "chrome",
    acceptInsecureCerts: true,
    unhandledPromptBehavior: "ignore",
  })
  .setChromeOptions(options)
  .usingServer("http://localhost:9515")
  .build();

(async () => {
  await driver.get("https://autifyhq.github.io/chromedriver-issue-close-tab/");

  const firstPageHandle = await driver.getWindowHandle();

  await driver.findElement(By.linkText("Open a new tab")).click();

  const handles = await driver.getAllWindowHandles();
  const newHandle = handles.find((handle) => handle !== firstPageHandle);
  assert(newHandle);

  await driver.switchTo().window(newHandle);
  await driver.findElement(By.name("close")).click();

  let count = 0;
  while (count < 100) {
    count++;

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Attemp to take screenshot: ${count} OK`);

    await driver.takeScreenshot().catch((e) => {
      if (
        !e.message.startsWith("no such window: target window already closed")
      ) {
        throw e;
      }
    });
  }
})().finally(() => {
  driver.quit();
});

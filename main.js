import assert from "node:assert/strict";
import { Builder, By, Browser } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";

const driver = new Builder()
  .forBrowser(Browser.CHROME)
  .setChromeOptions(new Options().headless())
  .usingServer("http://localhost:9515")
  .build();

(async () => {
  await driver.get("https://autifyhq.github.io/chromedriver-issue-close-tab/");

  const mainHandle = await driver.getWindowHandle();

  let attempt = 0;
  while (attempt < 10) {
    attempt++;
    await main(mainHandle, attempt);
  }
})().finally(() => {
  driver.quit();
});

async function main(mainHandle, attempt) {
  console.log(`Attempt ${attempt}`);

  await driver.switchTo().window(mainHandle);
  await driver.findElement(By.linkText("Open a new tab")).click();

  const handles = await driver.getAllWindowHandles();
  const newHandle = handles.find((handle) => handle !== mainHandle);
  assert(newHandle);

  await driver.switchTo().window(newHandle);
  await driver.findElement(By.name("close")).click();
  const timestamp = Date.now();

  let count = 0;
  while (count < 100) {
    count++;

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Take screenshot: ${count}`);

    await driver.takeScreenshot().catch((e) => {
      if (
        !e.message.startsWith("no such window: target window already closed")
      ) {
        process.stdout.write("\n");
        console.log(
          `${Date.now() - timestamp} ms after clicking the close button.`
        );
        throw e;
      }
    });
  }

  process.stdout.write("\n");
}

/**
 * @jest-environment node
 */
const puppeteer = require('puppeteer');
const full4s = require("@suvelocity/tester");

const path = "file://" + __dirname + "/src/index.html";
let page;
let browser;

  const projectName = "pre.Todo App";

  jest.setTimeout(15000);

describe(projectName, () => {
beforeAll(async () => {
  browser = await puppeteer.launch({
      // headless: false,
      args: ["--disable-web-security"],
      // slowMo: 50
  });
  page = await browser.newPage();
});

afterEach(async () => {
    await full4s.afterEach(page);
  });

  afterAll(async () => {
    await full4s.afterAll(projectName);
    await browser.close();
  });

  test("Add multiple Items seperated by ','", async () => {
  const multipleText = 'first, second, third';

  await page.goto(path);
  await page.waitForSelector('body #text-input');
  // await page.waitFor(250);
  const firstContainerText = await page.$$('.todo-text');
  expect(firstContainerText.length).toBe(0);
  await page.click('body #text-input');
  await page.type('#text-input', multipleText, {delay: 50});
  await page.select('body #priority-selector', '3');
  await page.waitForSelector('body #add-button');
  await page.click('body #add-button');
  await page.waitFor(500);
  
  await page.waitFor(10000);
  const tasks = await page.$$('.todo-text');
  const first = await (await tasks[0].getProperty("innerText")).jsonValue();
  const second = await (await tasks[1].innerText).jsonValue();
  await page.waitFor(1000);
  const third = await (await tasks[2].getProperty("innerText")).jsonValue();
  expect(first).toBe("first");
  expect(second).toBe("second");
  expect(third).toBe("third");

});

test("Has menu", async () => {
  const multipleText = 'first, second, third';

  await page.goto(path);
  await page.waitForSelector('body #text-input');
  const menu = await page.$$('#menu');
  expect(menu.length).toBe(1);

});

test("'important-tasks' link in the menu", async () => {
  await page.goto(path);
  await page.waitForSelector('body #text-input');
  const importantTasksLink = await page.$$('#important-tasks');
  const menu = await importantTasksLink[0].getProperty('parentElement');
  const menuId = await ( await menu.getProperty('id')).jsonValue();

  expect(menuId).toBe('menu');

});

test("'completed-tasks' link in the menu", async () => {
  await page.goto(path);
  await page.waitForSelector('body #text-input');
  const completedTasksLink = await page.$$('#completed-tasks');
  const menu = await completedTasksLink[0].getProperty('parentElement');
  const menuId = await ( await menu.getProperty('id')).jsonValue();

  expect(menuId).toBe('menu');

});

test("delete buttons for each container", async () => {
  await page.goto(path);
  await page.waitForSelector('#text-input');
  await page.waitFor(1000);
  await page.click('body #text-input');
  await page.type('#text-input', 'some text', {delay: 50});
  await page.select('body #priority-selector', '2');
  await page.click('body #add-button');
  const deleteButtons = await page.$$('.delete-button');
  const containers = await page.$$('.todo-container');
  const deleteButtonParent = await (await (await deleteButtons[0].getProperty('parentElement')).getProperty('className')).jsonValue();

  expect(deleteButtonParent).toBe('todo-container');
  expect(containers.length).toBe(deleteButtons.length);

});
});
import { Browser, Page } from 'playwright';
import { exampleProjectTests, initUserTest } from './utils';
import fetch from 'node-fetch';

exampleProjectTests('basic', browserType => {
  let browser: Browser = undefined as any;
  let page: Page = undefined as any;
  beforeAll(async () => {
    browser = await browserType.launch();
    page = await browser.newPage();
    page.goto('http://localhost:3000');
  });
  initUserTest(() => page);
  test('sign out and sign in', async () => {
    await page.click('[aria-label="Links and signout"]');
    await Promise.all([page.waitForNavigation(), page.click('button:has-text("Sign out")')]);
    await page.fill('[placeholder="Email Address"]', 'admin@keystonejs.com');
    await page.fill('[placeholder="password"]', 'password');
    await Promise.all([page.waitForNavigation(), page.click('button:has-text("Sign In")')]);
  });
  test('update user', async () => {
    await Promise.all([page.waitForNavigation(), page.click('h3:has-text("Users")')]);
    await Promise.all([page.waitForNavigation(), page.click('a:has-text("Admin")')]);
    await page.type('label:has-text("Name") >> .. >> input', '1');
    await page.click('button:has-text("Save changes")');
    await page.waitForSelector('text=No changes');
  });

  test('can see users', async () => {
    const usersResponse = await fetch('http://localhost:3000/api/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
          query {
            allUsers {
              id
              name
            }
          }
        `,
      }),
    }).then(res => res.json());
    expect(usersResponse).toEqual({
      data: {
        allUsers: [{ id: expect.stringMatching(/\d+/), name: 'Admin1' }],
      },
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
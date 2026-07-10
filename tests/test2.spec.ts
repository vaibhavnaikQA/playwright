import { test, expect } from '@playwright/test';

test("second test", async function ({page}) {
    await page.goto("https://demoqa.com/")
    await expect(page).toHaveTitle("demosite")
})
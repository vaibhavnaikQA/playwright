import { test, expect } from '@playwright/test';

test("Login" ,async function({page}){
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    await page.getByPlaceholder("Username").fill("Admin")
    await page.getByPlaceholder("Password").fill("admin123")
    await page.locator("//button[@type='submit']").click()
    await expect(page).toHaveURL(/dashboard/) 
})

test("logout" ,async function({page}){
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    await page.getByPlaceholder("Username").fill("Admin")
    await page.getByPlaceholder("Password").fill("admin123")
    await page.locator("//button[@type='submit']").click()
    await expect(page).toHaveURL(/dashboard/) 
    await page.getByAltText("profile picture").click() 
    await page.getByText("Logout").click()
    await expect(page).toHaveURL(/login/) 
})

test("Invalid Login" ,async function({page}){
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    await page.getByPlaceholder("Username").fill("Admin")
    await page.getByPlaceholder("Password").fill("admin123wrong")
    await page.locator("//button[@type='submit']").click()
    const errormessage = await page.locator("//p[contains(@class, 'oxd-alert-content-text')]").textContent()
    console.log(errormessage)
    expect(errormessage?.includes("vaibhav")).toBeFalsy()
})

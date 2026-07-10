import { test, expect } from '@playwright/test';

test("first test" ,async function({page}){
    console.log("first test")
    await page.goto("https://demoqa.com/")
    expect(await page.title()).toBe("demosite")
})

test("Second test" ,async function({page}){
    console.log("Second test")
    await page.goto("https://demoqa.com/")
    expect(await page.title()).toBe("demosite")
})

test("Third test" ,async function({page}){
    console.log("Third test")
    await page.goto("https://demoqa.com/")
    expect(await page.title()).toBe("demosite")
})

test("Fourth test" ,async function({page}){
    console.log("Fourth test")
    await page.goto("https://demoqa.com/")
    expect(await page.title()).toContain("demo")
})

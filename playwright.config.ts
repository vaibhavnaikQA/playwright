import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean((globalThis as any).process?.env?.CI);
export default defineConfig({
  testDir: './tests',
  // timeout: 4* 1000,
  // expect:{
  //   timeout: 3000
  // },
  fullyParallel: true,
  forbidOnly: isCI,
  // retries:2,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
      viewport:{width:1280,height:585},
      screenshot:"on",
      video:"on",
      trace:"on"
       },  
    },
  ],
});

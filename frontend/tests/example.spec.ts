import { test, expect } from '@playwright/test';

test('TutorFlow application opens successfully', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await expect(page).toHaveURL(/localhost:5173/);
});
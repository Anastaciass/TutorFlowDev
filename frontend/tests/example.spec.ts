import { test, expect } from '@playwright/test';

test('TutorFlow application opens successfully', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('body')).toBeVisible();
});
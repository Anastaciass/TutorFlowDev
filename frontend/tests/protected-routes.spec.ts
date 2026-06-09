import { test, expect } from '@playwright/test';

test('student dashboard cannot be opened without login', async ({ page }) => {
    await page.goto('/student-dashboard');

    await expect(page).toHaveURL(/login/, {
        timeout: 30000,
    });
});
import { test, expect } from '@playwright/test';
import { loginAsStudent } from './helpers/authHelper';

test('student can open dashboard after login', async ({ page }) => {
    test.setTimeout(180000);

    await loginAsStudent(page);

    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/student-dashboard/);
});
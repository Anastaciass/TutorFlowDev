import { test, expect } from '@playwright/test';
import { loginAsStudent } from './helpers/authHelper';

test('user can log in successfully', async ({ page }) => {
    test.setTimeout(180000);

    await loginAsStudent(page);

    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));

    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
});
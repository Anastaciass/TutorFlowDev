import { test, expect } from '@playwright/test';

test('user can log in successfully', async ({ page }) => {
    test.setTimeout(180000);

    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('Sign in to your account')).toBeVisible({
        timeout: 60000,
    });

    await page.getByPlaceholder('you@example.com').fill('studenttest@gmail.com');
    await page.locator('input[type="password"]').fill('student1');

    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/student-dashboard|tutor-dashboard/, {
        timeout: 120000,
    });

    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));

    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
});
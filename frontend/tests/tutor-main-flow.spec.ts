import { test, expect } from '@playwright/test';
import { loginAsTutor } from './helpers/authHelper';

test('tutor can create a lesson slot', async ({ page }) => {
    test.setTimeout(180000);

    await loginAsTutor(page);

    const uniqueSubject = `E2E Slot ${Date.now()}`;

    await page.getByRole('button', { name: /create time slot/i }).click();

    await expect(page.getByRole('heading', { name: /create time slot/i })).toBeVisible({
        timeout: 60000,
    });

    await page.getByPlaceholder('e.g., Mathematics, Physics').fill(uniqueSubject);

    await page.locator('input[type="date"]').fill('2026-06-30');
    await page.locator('input[type="time"]').first().fill('18:00');
    await page.locator('input[type="time"]').last().fill('19:00');

    await page.getByRole('button', { name: /^create slot$/i }).click();

    await expect(page.getByText(/time slot created successfully/i)).toBeVisible({
        timeout: 60000,
    });
});

test('tutor can accept a booking request', async ({ page }) => {
    test.setTimeout(180000);

    await loginAsTutor(page);

    await page.getByRole('button', { name: /booking requests/i }).click();

    const confirmButton = page.getByRole('button', { name: /confirm/i }).first();

    await expect(confirmButton).toBeVisible({
        timeout: 60000,
    });

    await confirmButton.click();

    await expect(page.locator('body')).toContainText(/upcoming lessons|booking requests|confirmed/i, {
        timeout: 60000,
    });
});

test('tutor can decline a booking request', async ({ page }) => {
    test.setTimeout(180000);

    await loginAsTutor(page);

    await page.getByRole('button', { name: /booking requests/i }).click();

    const declineButton = page.getByRole('button', { name: /decline/i }).first();

    await expect(declineButton).toBeVisible({
        timeout: 60000,
    });

    await declineButton.click();

    await expect(page.locator('body')).toContainText(/booking requests|pending requests|declined/i, {
        timeout: 60000,
    });
});
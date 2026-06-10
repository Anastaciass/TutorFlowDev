import { Page, expect } from '@playwright/test';

const studentEmail = process.env.E2E_STUDENT_EMAIL;
const studentPassword = process.env.E2E_STUDENT_PASSWORD;
const tutorEmail = process.env.E2E_TUTOR_EMAIL;
const tutorPassword = process.env.E2E_TUTOR_PASSWORD;

export async function loginAsStudent(page: Page) {
    if (!studentEmail || !studentPassword) {
        throw new Error('Missing student E2E credentials in .env');
    }

    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('Sign in to your account')).toBeVisible({
        timeout: 60000,
    });

    await page.getByPlaceholder('you@example.com').fill(studentEmail);
    await page.locator('input[type="password"]').fill(studentPassword);

    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/student-dashboard/, {
        timeout: 120000,
    });
}

export async function loginAsTutor(page: Page) {
    if (!tutorEmail || !tutorPassword) {
        throw new Error('Missing tutor E2E credentials in .env');
    }

    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('Sign in to your account')).toBeVisible({
        timeout: 60000,
    });

    await page.getByPlaceholder('you@example.com').fill(tutorEmail);
    await page.locator('input[type="password"]').fill(tutorPassword);

    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/tutor-dashboard/, {
        timeout: 120000,
    });
}
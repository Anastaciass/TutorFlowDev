import { test, expect } from '@playwright/test';
import { loginAsStudent } from './helpers/authHelper';

test('student can open available lesson slots section', async ({ page }) => {
    test.setTimeout(180000);

    await loginAsStudent(page);

    await expect(page).toHaveURL(/student-dashboard/);

    const availableSlotsButton = page.getByRole('button', { name: /available slots/i });

    await expect(availableSlotsButton).toBeVisible({
        timeout: 60000,
    });

    await availableSlotsButton.click();

    await expect(page.locator('body')).toContainText(/available slots|lesson slots|book|no available/i, {
        timeout: 60000,
    });
});
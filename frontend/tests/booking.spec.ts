import { test, expect } from '@playwright/test';
import { loginAsStudent } from './helpers/authHelper';

function extractNumber(text: string): number {
    const match = text.match(/\d+/);
    return match ? Number(match[0]) : 0;
}

test('student can book an available lesson slot', async ({ page }) => {
    test.setTimeout(180000);

    await loginAsStudent(page);

    const availableSlotsButton = page.getByRole('button', { name: /available slots/i });
    const upcomingLessonsButton = page.getByRole('button', { name: /my lessons|upcoming lessons/i });

    await expect(availableSlotsButton).toBeVisible({
        timeout: 60000,
    });

    const upcomingBeforeText = await upcomingLessonsButton.innerText();
    const upcomingBefore = extractNumber(upcomingBeforeText);

    await availableSlotsButton.click();

    const bookButton = page.getByRole('button', { name: /book this slot|book/i }).first();

    await expect(bookButton).toBeVisible({
        timeout: 60000,
    });

    await bookButton.click();

    await expect.poll(async () => {
        const upcomingAfterText = await upcomingLessonsButton.innerText();
        return extractNumber(upcomingAfterText);
    }, {
        timeout: 60000,
    }).toBeGreaterThan(upcomingBefore);
});
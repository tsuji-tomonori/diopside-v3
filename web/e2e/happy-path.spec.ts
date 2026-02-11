import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shotsDir = path.resolve(__dirname, '../../docs/screenshots');

function shotPath(projectName: string, name: string): string {
  if (!fs.existsSync(shotsDir)) fs.mkdirSync(shotsDir, { recursive: true });
  return path.join(shotsDir, `${projectName}-${name}`);
}

test('happy path (with screenshots)', async ({ page }, testInfo) => {
  const projectName = testInfo.project.name;

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'アーカイブタグ検索' })).toBeVisible();
  await page.waitForSelector('#pill');

  await page.screenshot({ path: shotPath(projectName, '01-home.png') });

  await page.getByRole('button', { name: 'Filters' }).click();
  await expect(page.getByRole('dialog', { name: 'Filters Drawer' })).toBeVisible();
  await page.screenshot({ path: shotPath(projectName, '02-filters-open.png') });

  // Tag search in drawer and select a tag
  // Search for a tag that exists in the new data format
  await page.getByPlaceholder('例: 雑談 / ホラー / コラボ').fill('雑談');

  // Find the tag category for '大分類' (exact match) and open it if needed
  // Use getByRole to find the summary with exact text match
  const majorCategorySummary = page.locator('details.tagCategory > summary').filter({ hasText: /^大分類から選ぶ/ });
  await majorCategorySummary.click();

  // Now select the tag
  const tagButton = page.locator('.tagRow', { hasText: '雑談' }).first();
  await expect(tagButton).toBeVisible();
  await tagButton.click();

  await page.screenshot({ path: shotPath(projectName, '03-tag-selected.png') });

  // Close drawer
  await page.getByRole('button', { name: '閉じる' }).first().click();

  // Wait for the filtered results to appear
  await page.waitForTimeout(500);

  // Verify that cards are displayed after tag filter
  const firstCard = page.locator('.grid .card').first();
  await expect(firstCard).toBeVisible({ timeout: 15000 });
  await page.screenshot({ path: shotPath(projectName, '04-filtered.png') });

  // Open first card
  await firstCard.click();

  // Dialog is a native <dialog>, so role might differ depending on browser;
  // ensure iframe is present.
  await expect(page.locator('#player')).toBeVisible();
  await page.screenshot({ path: shotPath(projectName, '05-modal.png') });

  // Open YouTube in new tab/popup
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'YouTubeで開く' }).click(),
  ]);
  await expect(popup).toHaveURL(/youtube\.com\/watch\?v=/);
  await popup.close();

  // Close modal
  await page.getByRole('button', { name: '閉じる' }).first().click();

  // Clear all
  await page.getByRole('button', { name: 'クリア' }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: shotPath(projectName, '06-cleared.png') });
});

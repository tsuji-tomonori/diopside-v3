import { test, expect, Page } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shotsDir = path.resolve(__dirname, '../../docs/screenshots');

function shotPath(name: string): string {
  if (!fs.existsSync(shotsDir)) fs.mkdirSync(shotsDir, { recursive: true });
  return path.join(shotsDir, name);
}

// Helper to wait for data to load
async function waitForDataLoad(page: Page) {
  await page.waitForSelector('#pill');
  await expect(page.locator('.grid .card').first()).toBeVisible({ timeout: 15000 });
}

// Helper to open filters drawer
async function openFiltersDrawer(page: Page) {
  await page.getByRole('button', { name: 'Filters' }).click();
  await expect(page.getByRole('dialog', { name: 'Filters Drawer' })).toBeVisible();
}

// Helper to close filters drawer
async function closeFiltersDrawer(page: Page) {
  await page.getByRole('button', { name: '閉じる' }).first().click();
  await page.waitForTimeout(300);
}

// Helper to select a tag by opening its category
async function selectTag(page: Page, categoryPattern: RegExp, tagName: string) {
  const categorySummary = page.locator('details.tagCategory > summary').filter({ hasText: categoryPattern });
  await categorySummary.click();
  await page.waitForTimeout(200);
  const tagButton = page.locator('.tagRow', { hasText: tagName }).first();
  await expect(tagButton).toBeVisible();
  await tagButton.click();
}

test.describe('Keyword Search', () => {
  test('search by keyword filters results', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);
    await page.screenshot({ path: shotPath('search-01-initial.png') });

    // Get initial count
    const pillText = await page.locator('#pill').textContent();
    const initialCount = parseInt(pillText?.split('/')[0].trim() ?? '0');

    // Enter search keyword
    const searchInput = page.locator('#q');
    await searchInput.fill('麻雀');
    await page.waitForTimeout(500);
    await page.screenshot({ path: shotPath('search-02-keyword-entered.png') });

    // Verify results are filtered
    const newPillText = await page.locator('#pill').textContent();
    const filteredCount = parseInt(newPillText?.split('/')[0].trim() ?? '0');
    expect(filteredCount).toBeLessThan(initialCount);

    // Verify cards contain the keyword
    const firstCardTitle = await page.locator('.grid .card .title').first().textContent();
    expect(firstCardTitle?.toLowerCase()).toContain('麻雀');
    await page.screenshot({ path: shotPath('search-03-results.png') });

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(300);
    await page.screenshot({ path: shotPath('search-04-cleared.png') });
  });

  test('search with no results shows empty state', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);

    // Search for something that doesn't exist
    const searchInput = page.locator('#q');
    await searchInput.fill('xyznonexistent12345');
    await page.waitForTimeout(500);
    await page.screenshot({ path: shotPath('search-05-no-results.png') });

    // Verify no cards or empty message
    const emptyMsg = page.locator('#empty');
    await expect(emptyMsg).toBeVisible();
  });
});

test.describe('Multiple Tags Filter', () => {
  test('AND mode - filters by all selected tags', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);
    await page.screenshot({ path: shotPath('tags-and-01-initial.png') });

    await openFiltersDrawer(page);

    // Select first tag (ゲーム) from 大分類
    await selectTag(page, /^大分類から選ぶ/, 'ゲーム');
    await page.screenshot({ path: shotPath('tags-and-02-first-tag.png') });

    // Get count after first tag
    const firstPillText = await page.locator('#pill').textContent();
    const firstCount = parseInt(firstPillText?.split('/')[0].trim() ?? '0');

    // Verify AND mode is selected (default)
    const tagModeSelect = page.locator('select').first();
    await expect(tagModeSelect).toHaveValue('AND');
    await page.screenshot({ path: shotPath('tags-and-03-and-mode.png') });

    await closeFiltersDrawer(page);
    await page.screenshot({ path: shotPath('tags-and-04-filtered.png') });

    // Now switch to OR mode and add another tag
    await openFiltersDrawer(page);
    await page.locator('select').first().selectOption('OR');
    await page.screenshot({ path: shotPath('tags-and-05-or-mode.png') });

    await closeFiltersDrawer(page);
    await page.waitForTimeout(300);
    await page.screenshot({ path: shotPath('tags-and-06-or-filtered.png') });
  });
});

test.describe('Year Filter', () => {
  test('filter by year using histogram', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);
    await page.screenshot({ path: shotPath('year-01-initial.png') });

    await openFiltersDrawer(page);
    await page.screenshot({ path: shotPath('year-02-drawer-open.png') });

    // Click on a year bar (2024 or any visible year)
    const yearBar = page.locator('.barItem').first();
    await expect(yearBar).toBeVisible();
    const yearText = await yearBar.textContent();
    await yearBar.click();
    await page.screenshot({ path: shotPath('year-03-year-selected.png') });

    // Verify the year is highlighted
    await expect(yearBar).toHaveAttribute('data-on', 'true');

    await closeFiltersDrawer(page);
    await page.screenshot({ path: shotPath('year-04-filtered.png') });

    // Verify results are from selected year
    const pillText = await page.locator('#pill').textContent();
    const filteredCount = parseInt(pillText?.split('/')[0].trim() ?? '0');
    expect(filteredCount).toBeGreaterThan(0);
  });
});

test.describe('Date Range Filter', () => {
  test('filter by today', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);
    await page.screenshot({ path: shotPath('date-01-initial.png') });

    await openFiltersDrawer(page);

    // Click "今日" button in Date Range section
    const todayButton = page.locator('.dateTop').getByRole('button', { name: '今日' });
    await todayButton.click();
    await page.screenshot({ path: shotPath('date-02-today-selected.png') });

    await closeFiltersDrawer(page);
    await page.screenshot({ path: shotPath('date-03-today-filtered.png') });

    // Clear date filter
    await openFiltersDrawer(page);
    const clearDateButton = page.locator('.dateTop').getByRole('button', { name: 'クリア' });
    await clearDateButton.click();
    await page.screenshot({ path: shotPath('date-04-cleared.png') });
    await closeFiltersDrawer(page);
  });

  test('filter by date range using calendar', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);

    await openFiltersDrawer(page);

    // Verify calendar is visible
    const calendarHeader = page.locator('.calHeader');
    await expect(calendarHeader).toBeVisible();
    await page.screenshot({ path: shotPath('date-05-calendar-initial.png') });

    // Navigate to previous month
    await page.locator('.calHeader .btn').first().click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: shotPath('date-06-prev-month.png') });

    // Click on a date that has videos (has 'hasVideo' class)
    const dateWithVideo = page.locator('.calGrid .day.hasVideo').first();
    if (await dateWithVideo.isVisible()) {
      await dateWithVideo.click();
      await page.screenshot({ path: shotPath('date-07-start-date.png') });

      // Click another date for range
      const secondDate = page.locator('.calGrid .day.hasVideo').nth(2);
      if (await secondDate.isVisible()) {
        await secondDate.click();
        await page.screenshot({ path: shotPath('date-08-end-date.png') });
      }
    }

    await closeFiltersDrawer(page);
    await page.screenshot({ path: shotPath('date-09-range-filtered.png') });
  });
});

test.describe('Duration Filter', () => {
  test('filter by duration range', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);
    await page.screenshot({ path: shotPath('duration-01-initial.png') });

    await openFiltersDrawer(page);

    // Find duration sliders in the rangeGrid
    const minSlider = page.locator('.rangeGrid input[type="range"]').first();
    const maxSlider = page.locator('.rangeGrid input[type="range"]').nth(1);

    // Set minimum duration to 60 minutes
    await minSlider.fill('60');
    await page.screenshot({ path: shotPath('duration-02-min-set.png') });

    // Set maximum duration to 180 minutes
    await maxSlider.fill('180');
    await page.screenshot({ path: shotPath('duration-03-max-set.png') });

    await closeFiltersDrawer(page);
    await page.screenshot({ path: shotPath('duration-04-filtered.png') });

    // Reset duration filter
    await openFiltersDrawer(page);
    await page.locator('.rangeRow .btn').click();
    await page.screenshot({ path: shotPath('duration-05-reset.png') });
    await closeFiltersDrawer(page);
  });
});

test.describe('Sort Order', () => {
  test('toggle sort order between newest and oldest', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);

    // Default should be newest first (desc)
    const descButton = page.getByRole('button', { name: '↓ 新しい順' });
    await expect(descButton).toHaveClass(/active/);
    await page.screenshot({ path: shotPath('sort-01-newest-first.png') });

    // Switch to oldest first
    await page.getByRole('button', { name: '↑ 古い順' }).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: shotPath('sort-02-oldest-first.png') });

    // Verify the button state changed
    const ascButton = page.getByRole('button', { name: '↑ 古い順' });
    await expect(ascButton).toHaveClass(/active/);
    await page.screenshot({ path: shotPath('sort-03-sorted.png') });

    // Switch back to newest
    await descButton.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: shotPath('sort-04-back-to-newest.png') });
  });
});

test.describe('Clear All Filters', () => {
  test('clear button resets all filters', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);

    // Wait for all data to load (archive pages)
    await page.waitForTimeout(2000);

    // Get initial total count after full load
    const initialPillText = await page.locator('#pill').textContent();
    const [initialFiltered, totalStr] = initialPillText?.split('/') ?? ['0', '0'];
    const totalCount = parseInt(totalStr.trim());
    const initialCount = parseInt(initialFiltered.trim());
    await page.screenshot({ path: shotPath('clear-01-initial.png') });

    // Apply filter: add a tag
    await openFiltersDrawer(page);
    await selectTag(page, /^大分類から選ぶ/, '雑談');
    await closeFiltersDrawer(page);
    await page.waitForTimeout(300);
    await page.screenshot({ path: shotPath('clear-02-filter-applied.png') });

    // Verify filters are applied (count should be less than total)
    const filteredPillText = await page.locator('#pill').textContent();
    const filteredCount = parseInt(filteredPillText?.split('/')[0].trim() ?? '0');
    expect(filteredCount).toBeLessThan(totalCount);

    // Change sort order
    await page.getByRole('button', { name: '↑ 古い順' }).click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: shotPath('clear-03-sort-changed.png') });

    // Click clear button
    await page.getByRole('button', { name: 'クリア' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: shotPath('clear-04-after-clear.png') });

    // Verify sort is back to default (newest first)
    await expect(page.getByRole('button', { name: '↓ 新しい順' })).toHaveClass(/active/);

    // Verify count is back to total (filtered count equals total count)
    const clearedPillText = await page.locator('#pill').textContent();
    const clearedCount = parseInt(clearedPillText?.split('/')[0].trim() ?? '0');
    expect(clearedCount).toBe(totalCount);
  });
});

test.describe('Video Modal', () => {
  test('open modal and interact with video details', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);
    await page.screenshot({ path: shotPath('modal-01-initial.png') });

    // Click first card
    const firstCard = page.locator('.grid .card').first();
    const cardTitle = await firstCard.locator('.title').textContent();
    await firstCard.click();
    await page.screenshot({ path: shotPath('modal-02-opened.png') });

    // Verify modal content - use #dlgTitle for title
    await expect(page.locator('#player')).toBeVisible();
    await expect(page.locator('#dlgTitle')).toContainText(cardTitle?.slice(0, 20) ?? '');

    // Check tags in modal
    const modalTags = page.locator('.modalTags .chip');
    const tagCount = await modalTags.count();
    expect(tagCount).toBeGreaterThan(0);
    await page.screenshot({ path: shotPath('modal-03-with-tags.png') });

    // Click a tag in modal (should add to filter)
    if (tagCount > 0) {
      const firstTag = modalTags.first();
      await firstTag.click();
      await page.screenshot({ path: shotPath('modal-04-tag-clicked.png') });
    }

    // Copy URL button
    const copyButton = page.getByRole('button', { name: 'URLコピー' });
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    await page.screenshot({ path: shotPath('modal-05-url-copied.png') });

    // Close modal
    await page.locator('#dlg').getByRole('button', { name: '閉じる' }).click();
    await page.screenshot({ path: shotPath('modal-06-closed.png') });
  });
});

test.describe('Scroll and Load More', () => {
  test('scroll to bottom shows scroll to top button', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);
    await page.screenshot({ path: shotPath('scroll-01-top.png') });

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    await page.screenshot({ path: shotPath('scroll-02-scrolled.png') });

    // Check if scroll-to-top button appears
    const scrollTopBtn = page.locator('#scrollTopBtn');
    await expect(scrollTopBtn).toBeVisible();
    await page.screenshot({ path: shotPath('scroll-03-scroll-btn-visible.png') });

    // Click scroll to top
    await scrollTopBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: shotPath('scroll-04-back-to-top.png') });
  });

  test('load more button loads additional items', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);

    // Get initial card count
    const initialCards = await page.locator('.grid .card').count();
    await page.screenshot({ path: shotPath('loadmore-01-initial.png') });

    // Scroll to load more button if it exists
    const loadMoreBtn = page.locator('#moreBtn');
    if (await loadMoreBtn.isVisible()) {
      await loadMoreBtn.scrollIntoViewIfNeeded();
      await page.screenshot({ path: shotPath('loadmore-02-button-visible.png') });

      await loadMoreBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: shotPath('loadmore-03-more-loaded.png') });

      // Verify more cards are loaded
      const newCardCount = await page.locator('.grid .card').count();
      expect(newCardCount).toBeGreaterThan(initialCards);
    }
  });
});

test.describe('Selected Tags Display', () => {
  test('selected tags appear below search bar', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);
    await page.screenshot({ path: shotPath('selected-01-initial.png') });

    // Open drawer and select a tag
    await openFiltersDrawer(page);
    await selectTag(page, /^大分類から選ぶ/, 'ゲーム');
    await page.screenshot({ path: shotPath('selected-02-tag-selected.png') });
    await closeFiltersDrawer(page);
    await page.waitForTimeout(300);

    // Verify tag appears in selected tags section (#topTags)
    const selectedTagsSection = page.locator('#topTags');
    await expect(selectedTagsSection).toBeVisible();
    await expect(selectedTagsSection.locator('.chip', { hasText: 'ゲーム' })).toBeVisible();
    await page.screenshot({ path: shotPath('selected-03-tag-displayed.png') });

    // Click the tag to remove it
    await selectedTagsSection.locator('.chip', { hasText: 'ゲーム' }).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: shotPath('selected-04-tag-removed.png') });
  });
});

test.describe('Tag Search in Drawer', () => {
  test('search filters tags in drawer', async ({ page }) => {
    await page.goto('/');
    await waitForDataLoad(page);

    await openFiltersDrawer(page);
    await page.screenshot({ path: shotPath('tagsearch-01-drawer-open.png') });

    // Enter tag search
    const tagSearchInput = page.getByPlaceholder('例: 雑談 / ホラー / コラボ');
    await tagSearchInput.fill('ゲーム');
    await page.waitForTimeout(300);
    await page.screenshot({ path: shotPath('tagsearch-02-searched.png') });

    // Verify only matching tags are shown
    const visibleTags = page.locator('.tagRow:visible');
    const count = await visibleTags.count();
    expect(count).toBeGreaterThan(0);

    // Clear search
    await tagSearchInput.fill('');
    await page.waitForTimeout(200);
    await page.screenshot({ path: shotPath('tagsearch-03-cleared.png') });

    await closeFiltersDrawer(page);
  });
});

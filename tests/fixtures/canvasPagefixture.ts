/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';
export { expect } from '@playwright/test';
import { CanvasPage } from '../pages/CanvasPage';

type MyFixtures = {
  canvasPage: CanvasPage;
};

export const test = base.extend<MyFixtures>({
  canvasPage: async ({ page }, use) => {
    const canvasPage = new CanvasPage(page);
    await canvasPage.navigate();

    await use(canvasPage);
  },
});


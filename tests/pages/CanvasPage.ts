import { type Locator, type Page, expect } from '@playwright/test';

export class CanvasPage {
  readonly page: Page;
  readonly showButton: Locator;
  readonly appRoot: Locator;
  readonly canvas: Locator;

  constructor(page: Page) {
    this.page = page;
    this.showButton = page.locator('[data-testid="show-btn"]');
    this.appRoot = page.locator('[data-testid="app-root"]');
    this.canvas = page.locator('[data-testid="canvas-element"]');
  }

  async navigate() {
    await this.page.goto('/');
    await this.canvas.waitFor({ state: 'visible' });
  }

  async getShapeDetails() {
    const type = await this.appRoot.getAttribute('data-shape-type');
    const color = await this.appRoot.getAttribute('data-shape-color');
    return { type: type || 'none', color: color || 'none' };
  }

  async clickToggleButton() {
    await this.showButton.click();
  }

  async ensureShapeIsHidden() {
    const { type } = await this.getShapeDetails();
    if (type !== 'none') {
      await this.clickToggleButton();
      await expect(this.appRoot).toHaveAttribute('data-shape-type', 'none', { timeout: 3000 });
    }
  }

  async waitForShapeToLoad() {
    await expect(async () => {
      const { type } = await this.getShapeDetails();
      expect(type, 'Фигура не отобразилась').not.toBe('none');
    }).toPass({ timeout: 1000 });
  }

  async verifyCanvasScreenshot(screenshotName: string) {
  await expect(this.canvas).toHaveScreenshot(screenshotName, { 
    maxDiffPixels: 20,     
    threshold: 0.2,        
    animations: 'disabled' 
  });
}
}

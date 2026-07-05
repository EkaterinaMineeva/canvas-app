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
    const sizeAttr = await this.canvas.getAttribute('data-shape-size');
    const shapeSize = parseInt(sizeAttr || '0', 10);

    const maskDiameter = (shapeSize * 0.30) + 10;

    await this.page.evaluate(([size]) => {
      document.getElementById('playwright-canvas-mask')?.remove();

      const maskEl = document.createElement('div');
      maskEl.id = 'playwright-canvas-mask';

      maskEl.setAttribute(
        'style',
        `position: fixed; 
         top: 50%; 
         left: 50%; 
         width: ${size}px; 
         height: ${size}px; 
         transform: translate(-50%, -50%); 
         border-radius: 50%; 
         background-color: #000000; 
         z-index: 99999; 
         pointer-events: none;`
      );

      document.body.appendChild(maskEl);
    }, [maskDiameter]);

    const virtualMaskLocator = this.page.locator('#playwright-canvas-mask');

    await expect(this.canvas).toHaveScreenshot(screenshotName, { 
      maxDiffPixels: 150,
      threshold: 0.2,        
      animations: 'disabled',
      mask: [virtualMaskLocator],
      maskColor: '#121212'
    });

    await this.page.evaluate(() => document.getElementById('playwright-canvas-mask')?.remove());
  }
}

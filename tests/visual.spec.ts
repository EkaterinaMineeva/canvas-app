import { test, expect } from './fixtures/canvasPagefixture';

const SHAPE_SNAPSHOTS: Record<string, string> = {
  'circle-#ff0000': 'red-circle.png',
  'square-#0000ff': 'blue-square.png',
  'triangle-#00ff00': 'green-triangle.png',
};

const ALLOWED_SNAPSHOTS = new Set(['circle-ff0000.png', 'square-0000ff.png', 'triangle-00ff00.png']);

const MAX_ATTEMPTS = 15;

test.describe('Проверка эталонных фигур на Canvas', () => {
  
  test(`Проверка на сходство с эталонными фигурами за ${MAX_ATTEMPTS} попыток`, async ({ canvasPage }) => {
    let targetSnapshot: string | null = null;
    let detectedShapeInfo = '';

    await test.step('Поиск эталонной фигуры через клики по кнопке', async () => {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        await canvasPage.ensureShapeIsHidden();
        await canvasPage.clickToggleButton();
        await canvasPage.waitForShapeToLoad();

        const { type, color } = await canvasPage.getShapeDetails();
        const lookupKey = `${type}-${color}`;

        if (SHAPE_SNAPSHOTS[lookupKey]) {
          targetSnapshot = SHAPE_SNAPSHOTS[lookupKey];
          detectedShapeInfo = `${type} (${color})`;
          break;
        }
      }

      expect(targetSnapshot, `Ни одина из эталоных фигур не выпала за ${MAX_ATTEMPTS} кликов`).not.toBeNull();
    });

    if (targetSnapshot) {
      await test.step(`Сравнение фигуры ${detectedShapeInfo} с эталоном ${targetSnapshot}`, () => 
        canvasPage.verifyCanvasScreenshot(targetSnapshot!)
      );
    }
  });

  test('Проверка на сходство с эталонными фигурами за 1 попытку', async ({ canvasPage }) => {

    await test.step('Настраиваем пустое состояние страницы', async () => {
        await canvasPage.ensureShapeIsHidden();
    });

    await test.step('Нажимаем на кнопку Show', async () => {
        await canvasPage.clickToggleButton();
        await canvasPage.waitForShapeToLoad();
    });

  await test.step('Проверка фигуры по эталонному скриншоту', async () => {
    const { type, color } = await canvasPage.getShapeDetails();
    const screenshotName = `${type}-${color.replace('#', '')}.png`;

    if (!ALLOWED_SNAPSHOTS.has(screenshotName)) {
      test.fail(true, 'Сгенерирована фигура вне списка поддерживаемых эталонов');
      return;
    }

    await canvasPage.verifyCanvasScreenshot(screenshotName);
  });
});

});

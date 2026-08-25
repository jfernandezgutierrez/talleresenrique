import { chromium } from 'file:///C:/Users/javiu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const outDir = 'D:/CLAUDE/taller/DOCUMENTACIÓN/03_Revisión_web/capturas_web';
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
await page.goto('https://leafy-pothos-1afe57.netlify.app/#/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);

const captures = [
  ['01_cabecera_hero.jpg', 0],
  ['02_quienes_somos.jpg', 820],
  ['03_servicios_parte_1.jpg', 1360],
  ['04_servicios_parte_2.jpg', 1900],
];
for (const [name, y] of captures) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(250);
  await page.screenshot({ path: outDir + '/' + name, type: 'jpeg', quality: 58 });
}
await page.locator('.cta-strip').screenshot({ path: outDir + '/05_llamada_a_la_accion.jpg', type: 'jpeg', quality: 65 });
await page.locator('footer').screenshot({ path: outDir + '/06_pie_de_pagina.jpg', type: 'jpeg', quality: 65 });
await browser.close();

import { chromium } from 'file:///C:/Users/javier.fernandez/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const outDir = 'C:/Desarrollo/TTT/GIT/talleresenrique/DOCUMENTACIÓN/05_Manual_admin/capturas'
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
})
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 })
await page.goto('https://tallerenriqueadmin.netlify.app/#/admin', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.getByLabel('Correo', { exact: true }).fill('mayteruca@hotmail.com')
await page.getByLabel('Contraseña', { exact: true }).fill('taenrique05*')
await page.getByRole('button', { name: 'Entrar al panel' }).click()
await page.waitForURL('**/#/admin', { timeout: 30000 })
await page.waitForTimeout(1200)

async function shot(name) {
  await page.screenshot({ path: `${outDir}/${name}`, type: 'png', animations: 'disabled' })
}
async function tab(title) {
  await page.locator(`.nav-btn[title="${title}"]`).click()
  await page.waitForTimeout(350)
}
async function closeModal() {
  await page.locator('.close-btn').click()
  await page.locator('.overlay').waitFor({ state: 'hidden' })
}

await shot('01-piezas.png')
await page.getByRole('button', { name: '+ Nueva pieza' }).click(); await shot('02-nueva-pieza.png'); await closeModal()
await tab('Categorías'); await shot('03-categorias.png')
await page.getByRole('button', { name: '+ Nueva categoría' }).click(); await shot('04-nueva-categoria.png'); await closeModal()
await tab('Servicios'); await shot('05-servicios.png')
await page.getByRole('button', { name: '+ Nuevo servicio' }).click(); await shot('06-nuevo-servicio.png'); await closeModal()
await tab('Páginas'); await shot('07-paginas.png')
await tab('Configuración')
const main = page.locator('.admin-main')
for (const [name, top] of [
  ['08-configuracion-contacto.png', 0],
  ['09-configuracion-portada.png', 1150],
  ['10-configuracion-textos.png', 2350],
  ['11-configuracion-legales.png', 3500],
  ['12-configuracion-whatsapp-banner.png', 4700],
]) {
  await main.evaluate((element, scrollTop) => { element.scrollTop = scrollTop }, top)
  await page.waitForTimeout(250)
  await shot(name)
}
await browser.close()

import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

function createTempPngFile() {
  const pngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+Xb3kAAAAASUVORK5CYII='

  const tmpDir = path.join(process.cwd(), 'test-results', 'e2e-fixtures')
  fs.mkdirSync(tmpDir, { recursive: true })

  const filePath = path.join(tmpDir, `fixture-${Date.now()}.png`)
  fs.writeFileSync(filePath, Buffer.from(pngBase64, 'base64'))
  return filePath
}

test.describe('E2E - Painel (CRUD)', () => {
  test('publicar e remover peça no painel', async ({ page }) => {
    const productName = 'Vaso de Argila Pintado'
    const productDescription = 'Descrição de exemplo para teste E2E'

    const initialState = {
      profileById: {
        'user-mock': {
          id: 'user-mock',
          nome: 'Artesão Mock',
          especialidade: 'ARGILA E CERÂMICA',
          biografia: 'Bio mock',
          whatsapp: '85999991111',
          email: 'artesao@mock.com',
          foto_perfil: null,
        },
      },
      productsByArtesaoId: {
        'user-mock': [],
      },
    }

    const supabaseSetupScript = fs.readFileSync(new URL('./setup.js', import.meta.url), 'utf8')

    await page.addInitScript({
      content: `
        window.__SUPABASE_TEST_USER__ = { id: 'user-mock' };
        window.__SUPABASE_MOCK_INITIAL_STATE__ = ${JSON.stringify(initialState)};
        ${supabaseSetupScript}
      `,
    })

    await page.goto('/painel')
    await expect(page.getByRole('button', { name: /Expor Peça Nova/i })).toBeVisible({ timeout: 15_000 })

    await page.getByRole('button', { name: /Expor Peça Nova/i }).click()

    await expect(page.getByRole('heading', { name: /Expor Nova Peça/i })).toBeVisible()

    const newProductModal = page.locator('form').filter({ has: page.getByRole('button', { name: /Publicar Peça/i }) })

    await newProductModal.getByPlaceholder(/Vaso de Argila Pintado/i).fill(productName)
    await newProductModal.getByPlaceholder(/Descreva o produto/i).fill(productDescription)
    await newProductModal.locator('select').selectOption('ARGILA E CERÂMICA')
    await newProductModal.getByPlaceholder('120').fill('120')

    const tmpPng = createTempPngFile()
    const fileInput = newProductModal.locator('input[type="file"]').first()
    await fileInput.setInputFiles(tmpPng)

    await page.getByRole('button', { name: /Publicar Peça/i }).click()

    await expect(page.getByRole('heading', { name: productName })).toBeVisible()
    await expect(page.locator('text=' + productName)).toBeVisible()

    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })

    const productCard = page.locator('article').filter({ has: page.getByRole('heading', { name: productName }) })
    const trashBtn = productCard.locator('button').last()
    await expect(trashBtn).toBeVisible()
    await trashBtn.click({ force: true })

    await expect(page.getByRole('heading', { name: productName })).toHaveCount(0)
  })
})


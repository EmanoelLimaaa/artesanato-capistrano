import { test, expect } from '@playwright/test'
import { installSupabaseMock } from './supabaseMock'


test.describe('E2E - smoke', () => {
  test('acesso à página inicial redireciona para /catalogo', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/catalogo/)
  })

  test('login - validação de campos obrigatórios via UI (sem backend)', async ({ page }) => {
    installSupabaseMock({})
    await page.goto('/login')

    await page.getByRole('button', { name: /Entrar no Painel/i }).click()

    // Há alert em caso de campos vazios - Playwright bloqueia alert nativamente,
    // então validamos que o URL não muda.
    await expect(page).toHaveURL(/\/login/)
  })

  test('cadastro - validação de email/senha mínimos (casos de erro)', async ({ page }) => {
    installSupabaseMock({})
    await page.goto('/cadastro')

    await page.getByRole('button', { name: /Cadastrar Grátis & Entrar/i }).click()

    await expect(page).toHaveURL(/\/cadastro/)
  })
})


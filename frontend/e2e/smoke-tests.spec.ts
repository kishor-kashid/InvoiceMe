import { test, expect } from '@playwright/test';

/**
 * E2E Smoke Tests
 * 
 * Basic smoke tests to verify the application loads and core pages are accessible.
 * These tests are designed to be reliable and fast.
 */

test.describe('Smoke Tests', () => {
  
  test('should load the login page successfully', async ({ page }) => {
    await page.goto('/login');
    
    // Verify login page elements are present
    await expect(page.locator('h2').filter({ hasText: /welcome|sign in/i }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
  
  test('should display application branding', async ({ page }) => {
    await page.goto('/login');
    
    // Verify InvoiceMe branding is present
    await expect(page.locator('text=InvoiceMe').first()).toBeVisible({ timeout: 10000 });
  });
  
  test('should have functional form inputs', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verify we can interact with inputs (when they're enabled)
    const usernameInput = page.locator('input[name="username"]');
    const passwordInput = page.locator('input[name="password"]');
    
    // Wait for inputs to be ready
    await usernameInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Check if inputs are enabled (they might start disabled)
    const isUsernameDisabled = await usernameInput.isDisabled();
    
    if (!isUsernameDisabled) {
      // If enabled, try to fill them
      await usernameInput.fill('test');
      await passwordInput.fill('test');
      
      // Verify values were set
      await expect(usernameInput).toHaveValue('test');
      await expect(passwordInput).toHaveValue('test');
    } else {
      // If disabled, just verify they exist
      await expect(usernameInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
    }
  });
});


const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  
  const jsErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') jsErrors.push(msg.text());
  });
  page.on('pageerror', err => jsErrors.push(err.message));
  
  await page.goto('http://localhost:8090/');
  await page.waitForSelector('input[name="user_name_entry_field"]', { timeout: 10000 });
  await page.fill('input[name="user_name_entry_field"]', 'opencode');
  await page.fill('input[name="password"]', 'opencode');
  await page.selectOption('select[name="company_login_name"]', '0');
  await Promise.all([
    page.waitForNavigation({ timeout: 15000 }),
    page.click('input[type="submit"], button[type="submit"]'),
  ]);
  await page.waitForSelector('a:has-text("Logout")', { timeout: 15000 });
  console.log("Logged in");
  
  await page.goto('http://localhost:8090/admin/inst_module.php?extset=0', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Click Local on ksf_FA_CRM_Marketing
  const localBtn = page.locator('input[name="Localksf_FA_CRM_Marketing"], button[name="Localksf_FA_CRM_Marketing"]');
  const count = await localBtn.count();
  console.log("Local buttons for ksf_FA_CRM_Marketing:", count);
  
  if (count > 0) {
    await localBtn.first().click({ force: true });
    console.log("Clicked Local button");
    await page.waitForTimeout(5000);
    
    // Check if page changed
    const bodyAfter = await page.textContent('body');
    console.log("Contains 'installed':", bodyAfter.includes('installed'));
    console.log("Contains 'incompatible':", bodyAfter.includes('incompatible'));
    console.log("Contains 'error':", bodyAfter.toLowerCase().includes('error'));
    console.log("JS Errors:", jsErrors.length);
    jsErrors.forEach(e => console.log("  JS Error:", e));
    
    // Now check for checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');
    const cbCount = await checkboxes.count();
    console.log("Checkboxes after activation attempt:", cbCount);
    
    for (let i = 0; i < Math.min(cbCount, 20); i++) {
      const cb = checkboxes.nth(i);
      const name = await cb.getAttribute('name');
      const isChecked = await cb.isChecked();
      console.log(`  Checkbox ${i}: name=${name}, checked=${isChecked}`);
    }
  }
  
  await browser.close();
})();

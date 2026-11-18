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
    await page.waitForTimeout(5000);
    console.log("Clicked Local button");
    
    const bodyAfter = await page.textContent('body');
    console.log("Contains 'installed':", bodyAfter.toLowerCase().includes('installed'));
    console.log("Contains 'incompatible':", bodyAfter.includes('incompatible'));
    console.log("Contains 'error':", bodyAfter.toLowerCase().includes('error'));
    console.log("JS Errors:", jsErrors.length);
    jsErrors.forEach(e => console.log("  JS Error:", e));
  }
  
  await browser.close();
})();

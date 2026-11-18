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
  
  const bodyText = await page.textContent('body');
  console.log("Contains ksf_FA_HRM_LeaveApproval:", bodyText.includes('ksf_FA_HRM_LeaveApproval'));
  console.log("Contains ksf_FA_CRM_Marketing:", bodyText.includes('ksf_FA_CRM_Marketing'));
  
  const checkboxes = page.locator('input[type="checkbox"]');
  const cbCount = await checkboxes.count();
  console.log("Checkboxes:", count);
  
  const buttons = page.locator('input[type="submit"], button[type="submit"], button');
  const btnCount = await buttons.count();
  console.log("Buttons:", btnCount);
  
  for (let i = 0; i < Math.min(btnCount, 20); i++) {
    const btn = buttons.nth(i);
    const name = await btn.getAttribute('name');
    const type = await btn.getAttribute('type');
    const visible = await btn.isVisible();
    console.log(`  Button ${i}: name=${name}, type=${type}, visible=${visible}`);
  }
  
  await browser.close();
})();

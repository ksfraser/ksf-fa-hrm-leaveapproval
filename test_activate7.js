const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8080/');
  await page.waitForSelector('input[name="user_name_entry_field"]', { timeout: 10000 });
  await page.fill('input[name="user_name_entry_field"]', 'opencode');
  await page.fill('input[name="password"]', 'opencode');
  await page.selectOption('select[name="company_login_name"]', '0');
  await Promise.all([
    page.waitForNavigation({ timeout: 15000 }),
    page.click('input[type="submit"], button[type="submit"]'),
  ]);
  await page.waitForSelector('a:has-text("Logout")', { timeout: 15000 });
  
  // Go to company extensions page
  await page.goto('http://localhost:8080/admin/inst_module.php?extset=0', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const bodyText = await page.textContent('body');
  console.log("Contains ksf_FA_HRM_LeaveApproval:", bodyText.includes('ksf_FA_HRM_LeaveApproval'));
  console.log("Contains 'None' for installed:", bodyText.includes('None'));
  console.log("Contains 'ksf_FA_CRM_Marketing':", bodyText.includes('ksf_FA_CRM_Marketing'));
  
  // Check if any checkboxes exist
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  console.log("Checkboxes:", count);
  
  // Check for any buttons
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

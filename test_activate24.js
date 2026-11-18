const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  
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
  
  await page.goto('http://localhost:8090/admin/inst_module.php?extset=0', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const bodyText = await page.textContent('body');
  
  // Look for ksf_FA_HRM_LeaveApproval in the page
  const idx = bodyText.indexOf('ksf_FA_HRM_LeaveApproval');
  if (idx >= 0) {
    console.log("Found ksf_FA_HRM_LeaveApproval at position", idx);
    console.log("Context:", bodyText.substring(Math.max(0, idx-100), idx+200));
  }
  
  await browser.close();
})();

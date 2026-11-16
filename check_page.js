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
  
  await page.goto('http://localhost:8080/modules/ksf_FA_HRM_LeaveApproval/index.php', { waitUntil: 'networkidle' });
  const body = await page.textContent('body');
  console.log("=== BODY TEXT (first 800 chars) ===");
  console.log(body.substring(0, 800));
  console.log("=== END ===");
  
  await browser.close();
})();

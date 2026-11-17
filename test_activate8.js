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
  
  // Log in
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
  console.log("Logged in");
  
  // Go to Install/Extensions page
  await page.goto('http://localhost:8080/admin/inst_module.php', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Click "Local" for ksf_FA_HRM_LeaveApproval
  const localBtn = page.locator('input[name="Localksf_FA_HRM_LeaveApproval"], button[name="Localksf_FA_HRM_LeaveApproval"]');
  const count = await localBtn.count();
  console.log("Local buttons for ksf_FA_HRM_LeaveApproval:", count);
  
  if (count > 0) {
    await localBtn.first().click({ force: true });
    await page.waitForTimeout(5000);
    console.log("Clicked Local");
    
    const bodyText = await page.textContent('body');
    console.log("Contains 'incompatible':", bodyText.includes('incompatible'));
    console.log("Contains 'Installed':", bodyText.includes('Installed'));
    console.log("Contains 'None':", bodyText.includes('None'));
    console.log("JS Errors:", jsErrors.length);
  }
  
  await browser.close();
})();

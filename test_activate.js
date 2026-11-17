const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  
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
  
  // Check if our modules are listed
  const bodyText = await page.textContent('body');
  console.log("Contains ksf_FA_HRM_LeaveApproval:", bodyText.includes('ksf_FA_HRM_LeaveApproval'));
  console.log("Contains ksf_FA_CRM_Marketing:", bodyText.includes('ksf_FA_CRM_Marketing'));
  
  // Try to find and click Activate for ksf_FA_HRM_LeaveApproval
  // Look for the row with our module name
  const rows = page.locator('tr');
  const rowCount = await rows.count();
  console.log("Total rows:", rowCount);
  
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const text = await row.textContent();
    if (text.includes('ksf_FA_HRM_LeaveApproval')) {
      console.log("Found LeaveApproval row at index", i);
      // Look for Activate button or checkbox in this row
      const checkbox = row.locator('input[type="checkbox"]');
      const cbCount = await checkbox.count();
      console.log("Checkboxes in row:", cbCount);
      if (cbCount > 0) {
        await checkbox.first().check();
        console.log("Checked box");
      }
      break;
    }
  }
  
  await browser.close();
})();

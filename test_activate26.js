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
  console.log("Logged in");
  
  await page.goto('http://localhost:8090/admin/inst_module.php?extset=0', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Find ksf_FA_HRM_LeaveApproval row and click Local
  const rows = page.locator('tr');
  const rowCount = await rows.count();
  console.log("Total rows:", count);
  
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const text = await row.textContent();
    if (text.includes('ksf_FA_HRM_LeaveApproval')) {
      console.log("Found ksf_FA_HRM_LeaveApproval at row", i);
      console.log("Row text:", text.substring(0, 200));
      
      // Find the Local button in this row
      const localBtn = row.locator('input[name="Localksf_FA_HRM_LeaveApproval"], button[name="Localksf_FA_HRM_LeaveApproval"]');
      const lc = await localBtn.count();
      console.log("Local buttons in this row:", lc);
      
      if (lc > 0) {
        await localBtn.first().click({ force: true });
        console.log("Clicked Local on ksf_FA_HRM_LeaveApproval");
        await page.waitForTimeout(5000);
        
        // Check what changed
        const bodyAfter = await page.textContent('body');
        const idx = bodyText.indexOf('ksf_FA_HRM_LeaveApproval');
        if (idx >= 0) {
          console.log("After click - context:", bodyAfter.substring(Math.max(0, idx-50), idx+200));
        }
        
        const newCheckboxes = page.locator('input[type="checkbox"]');
        const cbCount = await newCheckboxes.count();
        console.log("Checkboxes after Local click:", cbCount);
        
        for (let j = 0; j < Math.min(cbCount, 10); j++) {
          const cb = newCheckboxes.nth(j);
          const name = await cb.getAttribute('name');
          const checked = await cb.isChecked();
          console.log(`  Checkbox ${j}: name=${name}, checked=${checked}`);
        }
      }
      break;
    }
  }
  
  await browser.close();
})();

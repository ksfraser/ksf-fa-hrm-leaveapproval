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
  
  // Click Local on ksf_FA_HRM_LeaveApproval
  const localBtn = page.locator('input[name="Localksf_FA_HRM_LeaveApproval"], button[name="Localksf_FA_HRM_LeaveApproval"]');
  const count = await localBtn.count();
  console.log("Local buttons:", count);
  
  if (count > 0) {
    await localBtn.first().click({ force: true });
    await page.waitForTimeout(5000);
    
    const bodyText = await page.textContent('body');
    console.log("After local click:");
    console.log("  Contains 'installed':", bodyText.includes('installed'));
    console.log("  Contains 'incompatible':", bodyText.includes('incompatible'));
    
    // Check for checkboxes now
    const checkboxes = page.locator('input[type="checkbox"]');
    const cbCount = await checkboxes.count();
    console.log("Checkboxes after Local click:", cbCount);
    
    for (let i = 0; i < Math.min(cbCount, 10); i++) {
      const cb = checkboxes.nth(i);
      const name = await cb.getAttribute('name');
      const checked = await cb.isChecked();
      console.log(`  Checkbox ${i}: name=${name}, checked=${checked}`);
    }
    
    // If checkboxes found, check one and click Refresh
    if (cbCount > 0) {
      const firstBox = checkboxes.nth(0);
      const isChecked = await firstBox.isChecked();
      if (!isChecked) {
        await firstBox.check();
        console.log("Checked:", await firstBox.getAttribute('name'));
      }
      
      const refreshBtn = page.locator('input[name="Refresh"], button[name="Refresh"]');
      const refreshCount = await refreshBtn.count();
      console.log("Refresh buttons:", refreshCount);
      
      if (refreshCount > 0) {
        await refreshBtn.first().click({ force: true });
        await page.waitForTimeout(5000);
        
        const bodyAfter = await page.textContent('body');
        console.log("After refresh:");
        console.log("  Contains 'incompatible':", bodyAfter.includes('incompatible'));
        console.log("Contains 'error':", bodyAfter.toLowerCase().includes('error'));
        console.log("Contains 'Saved':", bodyAfter.includes('saved'));
        console.log("Contains 'activated':", bodyAfter.toLowerCase().includes('activat'));
      }
    }
  }
  
  await browser.close();
})();

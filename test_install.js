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
  console.log("Logged in");
  
  await page.goto('http://localhost:8090/admin/inst_module.php?extset=0', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const bodyText = await page.textContent('body');
  console.log("Contains ksf_FA_HRM_LeaveApproval:", bodyText.includes('ksf_FA_HRM_LeaveApproval'));
  
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  console.log("Checkboxes:", count);
  
  for (let i = 0; i < count; i++) {
    const cb = checkboxes.nth(i);
    const name = await cb.getAttribute('name');
    const isChecked = await cb.isChecked();
    console.log(`  Checkbox ${i}: name=${name}, checked=${isChecked}`);
  }
  
  const localBtn = page.locator('input[name="Localksf_FA_HRM_LeaveApproval"], button[name="Localksf_FA_HRM_LeaveApproval"]');
  const lc = await localBtn.count();
  console.log("Local buttons:", lc);
  
  if (lc > 0) {
    await localBtn.first().click({ force: true });
    await page.waitForTimeout(5000);
    console.log("Clicked Local");
    
    const bodyAfter = await page.textContent('body');
    console.log("Contains 'installed':", bodyAfter.includes('installed'));
    console.log("Contains 'incompatible':", bodyAfter.includes('incompatible'));
    console.log("JS Errors:", jsErrors.length);
    jsErrors.forEach(e => console.log("  JS Error:", e));
    
    const cbCount = await page.locator('input[type="checkbox"]').count();
    console.log("Checkboxes after click:", cbCount);
  }
  
  await browser.close();
})();

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
  
  // Go to company extensions page
  await page.goto('http://localhost:8080/admin/inst_module.php?extset=0', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const html = await page.content();
  const fs = require('fs');
  fs.writeFileSync('/tmp/fa_ext_page3.html', html);
  
  // Check for checkboxes
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  console.log("Total checkboxes:", count);
  
  // Check all unchecked checkboxes
  let checked = 0;
  for (let i = 0; i < count; i++) {
    const cb = checkboxes.nth(i);
    const isChecked = await cb.isChecked();
    if (!isChecked) {
      await cb.check();
      checked++;
    }
  }
  console.log("Checked", checked, "checkboxes");
  
  // Click Refresh
  const refreshBtn = page.locator('input[name="Refresh"], button[name="Refresh"]');
  const refreshCount = await refreshBtn.count();
  console.log("Refresh buttons:", refreshCount);
  
  if (refreshCount > 0) {
    await refreshBtn.first().click({ force: true });
    await page.waitForTimeout(5000);
    console.log("Clicked Refresh");
  }
  
  const bodyAfter = await page.textContent('body');
  console.log("Contains 'incompatible':", bodyAfter.includes('incompatible'));
  console.log("Contains 'Saved':", bodyAfter.includes('saved'));
  console.log("Contains 'activated':", bodyAfter.toLowerCase().includes('activat'));
  console.log("Contains 'failed':", bodyAfter.toLowerCase().includes('fail'));
  console.log("JS Errors:", jsErrors.length);
  
  await browser.close();
})();

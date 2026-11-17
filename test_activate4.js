const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  
  // Capture console errors
  const jsErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      jsErrors.push('JS ERROR: ' + msg.text());
      console.log('JS ERROR:', msg.text());
    }
  });
  page.on('pageerror', err => {
    jsErrors.push('PAGE ERROR: ' + err.message);
    console.log('PAGE ERROR:', err.message);
  });
  
  // Capture all responses
  const responses = [];
  page.on('response', response => {
    if (response.url().includes('inst_module')) {
      responses.push({ url: response.url(), status: response.status() });
      console.log('RESPONSE:', response.url(), response.status());
    }
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
  
  // Get all checkboxes
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  console.log("Total checkboxes:", count);
  
  // Check all unchecked checkboxes
  let checked = 0;
  for (let i = 0; i < count; i++) {
    const cb = checkboxes.nth(i);
    const isChecked = await cb.isChecked();
    if (!isChecked) {
      try {
        await cb.check();
        checked++;
      } catch(e) {
        console.log("Could not check box", i, e.message);
      }
    }
  }
  console.log("Checked", checked, "checkboxes");
  
  // Click Refresh
  const refreshBtn = page.locator('input[name="Refresh"], button[name="Refresh"]');
  const refreshCount = await refreshBtn.count();
  console.log("Refresh buttons found:", refreshCount);
  
  if (refreshCount > 0) {
    // Try clicking with force
    try {
      await refreshBtn.first().click({ force: true });
      await page.waitForTimeout(5000);
      console.log("Clicked Refresh, waited 5s");
    } catch(e) {
      console.log("Click failed:", e.message);
    }
  }
  
  // Check for errors
  const bodyAfter = await page.textContent('body');
  console.log("\n=== Contains 'incompatible':", bodyAfter.includes('incompatible'));
  console.log("Contains 'Saved':", bodyAfter.includes('saved'));
  console.log("Contains 'activated':", bodyAfter.toLowerCase().includes('activat'));
  console.log("Contains 'failed':", bodyAfter.toLowerCase().includes('fail'));
  console.log("JS Errors:", jsErrors.length);
  
  await browser.close();
})();

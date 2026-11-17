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
  page.on('pageerror', err => jsErrors.push(err.message));
  
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
  
  // Go to company extensions page
  await page.goto('http://localhost:8080/admin/inst_module.php?extset=0', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Get page HTML to understand structure
  const html = await page.content();
  console.log("HTML length:", html.length);
  console.log("Has 'Active' text:", html.includes('Active'));
  console.log("Has 'Activate':", html.includes('Activate'));
  console.log("Has 'checkbox':", html.toLowerCase().includes('checkbox'));
  console.log("Has 'type=\"checkbox\"':", html.includes('type="checkbox"'));
  
  // Look for any input elements
  const inputs = page.locator('input');
  const inputCount = await inputs.count();
  console.log("Total inputs:", inputCount);
  
  for (let i = 0; i < Math.min(inputCount, 20); i++) {
    const inp = inputs.nth(i);
    const type = await inp.getAttribute('type');
    const name = await inp.getAttribute('name');
    const value = await inp.getAttribute('value');
    console.log(`Input ${i}: type=${type}, name=${name}, value=${value}`);
  }
  
  await browser.close();
})();

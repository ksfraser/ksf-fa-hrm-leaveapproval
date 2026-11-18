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
  
  await page.goto('http://localhost:8080/admin/inst_module.php?extset=0', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Print all buttons and inputs
  const allInputs = page.locator('input, button');
  const count = await allInputs.count();
  console.log("Total input/button elements:", count);
  
  for (let i = 0; i < count; i++) {
    const el = allInputs.nth(i);
    const tag = await el.evaluate(el => el.tagName);
    const type = await el.getAttribute('type');
    const name = await el.getAttribute('name');
    const value = await el.getAttribute('value');
    const text = await el.evaluate(el => el.textContent?.trim().substring(0, 30));
    console.log(`  [${i}] tag=${tag} type=${type} name=${name} value="${value}" text="${text}"`);
  }
  
  await browser.close();
})();

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
  
  await page.goto('http://localhost:8080/admin/inst_module.php?extset=0', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const html = await page.content();
  
  // Save to file for inspection
  const fs = require('fs');
  fs.writeFileSync('/tmp/fa_ext_page.html', html);
  console.log("HTML saved to /tmp/fa_ext_page.html");
  console.log("Length:", html.length);
  
  // Find all table structures
  const tableMatches = html.match(/<table[^>]*>/g);
  console.log("Number of tables:", tableMatches ? tableMatches.length : 0);
  
  // Find all input elements
  const inputMatches = html.match(/<input[^>]*>/g);
  console.log("Number of inputs:", inputMatches ? inputMatches.length : 0);
  if (inputMatches) {
    inputMatches.forEach((m, i) => console.log(`Input ${i}: ${m.substring(0, 200)}`));
  }
  
  await browser.close();
})();

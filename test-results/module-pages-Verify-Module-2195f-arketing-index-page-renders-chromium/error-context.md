# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: module-pages.spec.js >> Verify Module Pages Render >> Marketing index page renders
- Location: tests/e2e/module-pages.spec.js:47:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  82  |   // Check if already installed (no Local button means either installed or not available)
  83  |   const updateButton = page.locator(`input[name="Update.${packageName}"], button[name="Update.${packageName}"]`);
  84  |   if (await updateButton.count() > 0) {
  85  |     // Already installed
  86  |     return true;
  87  |   }
  88  | 
  89  |   throw new Error(`Could not find Install button for ${packageName}`);
  90  | }
  91  | 
  92  | /**
  93  |  * Activate extensions for a company.
  94  |  * Navigates to the company extensions activation page, checks the Active
  95  |  * checkboxes for the given packages, and clicks Refresh to submit.
  96  |  *
  97  |  * Checkbox names are Active<i> where <i> is the row index in the merged +
  98  |  * natural-sorted GLOBAL registry list (per FA's inst_module.php logic).
  99  |  * @param {number} companyId - The company index (default 0)
  100 |  * @param {string[]} packages - Array of package names to activate
  101 |  */
  102 | async function activateExtensions(page, companyId = COMPANY_ID, packages) {
  103 |   // Navigate to the company extensions activation page
  104 |   await page.goto(BASE_URL + `/admin/inst_module.php?extset=${companyId}`);
  105 |   await page.waitForLoadState('networkidle');
  106 | 
  107 |   // Read the page to find Active checkbox indices for our packages.
  108 |   // Checkboxes are named Active<i> where i is the row index in the table.
  109 |   const tableRows = page.locator('table tr');
  110 |   const rowCount = await tableRows.count();
  111 | 
  112 |   const checkboxesToCheck = [];
  113 | 
  114 |   for (let i = 0; i < rowCount; i++) {
  115 |     const row = tableRows.nth(i);
  116 |     const rowText = await row.textContent();
  117 |     // Check if this row contains one of our target package names
  118 |     const match = packages.find(pkg => rowText.includes(pkg));
  119 |     if (match) {
  120 |       // Find the Active checkbox in this row
  121 |       const activeCheckbox = row.locator(`input[name="Active${i}"]`);
  122 |       if (await activeCheckbox.count() > 0) {
  123 |         const isChecked = await activeCheckbox.isChecked();
  124 |         if (!isChecked) {
  125 |           checkboxesToCheck.push(i);
  126 |         }
  127 |       }
  128 |     }
  129 |   }
  130 | 
  131 |   // Check all needed checkboxes
  132 |   for (const idx of checkboxesToCheck) {
  133 |     await page.check(`input[name="Active${idx}"]`);
  134 |   }
  135 | 
  136 |   // If we checked anything, click Refresh to submit
  137 |   if (checkboxesToCheck.length > 0) {
  138 |     await page.click('input[name="Refresh"], button[name="Refresh"]');
  139 |     await page.waitForLoadState('networkidle');
  140 | 
  141 |     // Verify no "incompatible version" errors
  142 |     const errorLocator = page.locator('.error, .failure').filter({ hasText: 'incompatible' });
  143 |     if (await errorLocator.count() > 0) {
  144 |       const text = await errorLocator.first().textContent();
  145 |       throw new Error(`Activation failed: ${text}`);
  146 |     }
  147 |   }
  148 | }
  149 | 
  150 | /**
  151 |  * Grant System Administrator access to a module's security areas.
  152 |  * Navigates to Setup -> Access and enables the module's SA_ areas for sysadmin.
  153 |  * @param {string} modulePrefix - Module prefix (e.g. 'SA_HRM_LEAVEAPPROVAL')
  154 |  */
  155 | async function grantSysAdminAccess(page, securityAreas) {
  156 |   await page.goto(BASE_URL + '/admin/user_access.php?user_id=1'); // sysadmin is typically user_id=1
  157 |   await page.waitForLoadState('networkidle');
  158 | 
  159 |   for (const area of securityAreas) {
  160 |     const checkbox = page.locator(`input[name="${area}"]`);
  161 |     if (await checkbox.count() > 0) {
  162 |       await checkbox.check();
  163 |     }
  164 |   }
  165 | 
  166 |   await page.click('input[type="submit"], button[type="submit"]');
  167 |   await page.waitForLoadState('networkidle');
  168 | }
  169 | 
  170 | /**
  171 |  * Navigate to a module page and verify it renders (HTTP 200, expected content).
  172 |  * @param {string} pagePath - Relative path from module root (e.g. 'index.php?view=list')
  173 |  * @param {string} expectedText - Text expected to appear on the page
  174 |  * @param {Object} options - { moduleName, securityAreas }
  175 |  */
  176 | async function verifyModulePage(page, modulePath, expectedText, options = {}) {
  177 |   const url = BASE_URL + '/modules/' + options.moduleName + '/' + modulePath;
  178 |   const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  179 | 
  180 |   if (response) {
  181 |     const status = response.status();
> 182 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  183 |   }
  184 | 
  185 |   const body = await page.textContent('body');
  186 |   expect(body).toContain(expectedText);
  187 | }
  188 | 
  189 | module.exports = { faLogin, faLogout, gotoInstallExtensions, installExtension, activateExtensions, grantSysAdminAccess, verifyModulePage, BASE_URL, FA_USER, FA_PASS, COMPANY_ID };
  190 | 
```
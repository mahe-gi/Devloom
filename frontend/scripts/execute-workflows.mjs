import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.join(__dirname, '../artifacts/ui-audit/current-failed-state');
fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE_URL = 'http://localhost:5173';
let results = { workflows: [], responsive: [], screenshots: [] };

const VIEWPORTS = [
  { width: 320, height: 568, name: '320x568' },
  { width: 375, height: 812, name: '375x812' },
  { width: 430, height: 932, name: '430x932' },
  { width: 768, height: 1024, name: '768x1024' },
  { width: 1024, height: 768, name: '1024x768' },
  { width: 1280, height: 800, name: '1280x800' },
  { width: 1440, height: 900, name: '1440x900' },
  { width: 1728, height: 1117, name: '1728x1117' }
];

const PAGES = [
  { name: 'Landing', url: '/' },
  { name: 'Feed', url: '/blogs' },
  { name: 'Article', url: '/blog/55' },
  { name: 'Tag', url: '/tags/technology' },
  { name: 'AuthorProfile', url: '/authors/some-user' },
  { name: 'Signin', url: '/signin' },
  { name: 'Signup', url: '/signup' },
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Editor', url: '/publish' },
  { name: 'ProfileSettings', url: '/dashboard/profile' },
  { name: 'General404', url: '/this-route-does-not-exist' },
  { name: 'SearchEmpty', url: '/blogs?q=thiswillneverexist' }
];

async function capture(page, filename, route, viewport, theme, authState) {
    await page.screenshot({ path: path.join(OUT_DIR, filename), fullPage: true });
    results.screenshots.push({
        filename, route, viewport, theme, authState, captureResult: 'Success'
    });
}

async function run() {
  console.log("Starting Execution Audit...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const ts = Date.now();
  const email = `test${ts}@example.com`;
  const password = `Password123!`;
  const name = `Audit User ${ts}`;

  try {
    // 1. Signup Workflow
    console.log("Signup...");
    await page.setViewport(VIEWPORTS[5]);
    await page.goto(`${BASE_URL}/signup`, {waitUntil: 'networkidle2'});
    try {
        await page.type('input[id="name"]', name);
        await page.type('input[id="email"]', email);
        await page.type('input[id="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ timeout: 5000 });
        results.workflows.push({ journey: 'Signup', expected: 'Success redirect to /blogs', actual: page.url(), result: 'PASS' });
    } catch(e) {
        results.workflows.push({ journey: 'Signup', expected: 'Success redirect to /blogs', actual: e.message, result: 'FAIL' });
    }

    // 2. Logout Workflow
    console.log("Logout...");
    try {
        await page.click('button[aria-haspopup="menu"]'); // Appbar avatar menu
        await new Promise(r => setTimeout(r, 500));
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, a'));
            const logout = btns.find(b => b.textContent.includes('Sign out') || b.textContent.includes('Logout'));
            if(logout) logout.click();
        });
        await page.waitForNavigation({ timeout: 5000 });
        results.workflows.push({ journey: 'Logout', expected: 'Redirect to /', actual: page.url(), result: 'PASS' });
    } catch(e) {
        results.workflows.push({ journey: 'Logout', expected: 'Redirect to /', actual: e.message, result: 'FAIL' });
    }

    // 3. Invalid Signin Workflow
    console.log("Invalid Signin...");
    await page.goto(`${BASE_URL}/signin`);
    try {
        await page.type('input[id="email"]', email);
        await page.type('input[id="password"]', 'WrongPassword!');
        await page.click('button[type="submit"]');
        await new Promise(r => setTimeout(r, 2000));
        const errorToast = await page.evaluate(() => document.body.innerText.includes('Invalid credentials'));
        results.workflows.push({ journey: 'Invalid Signin', expected: 'Error toast', actual: errorToast ? 'Toast shown' : 'No toast', result: errorToast ? 'PASS' : 'FAIL' });
    } catch(e) {
        results.workflows.push({ journey: 'Invalid Signin', expected: 'Error toast', actual: e.message, result: 'FAIL' });
    }

    // 4. Signin Workflow
    console.log("Valid Signin...");
    await page.goto(`${BASE_URL}/signin`);
    try {
        // inputs might already be filled, let's clear them or reload
        await page.reload();
        await page.type('input[id="email"]', email);
        await page.type('input[id="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ timeout: 5000 });
        results.workflows.push({ journey: 'Signin', expected: 'Redirect to /blogs', actual: page.url(), result: 'PASS' });
    } catch(e) {
        results.workflows.push({ journey: 'Signin', expected: 'Redirect to /blogs', actual: e.message, result: 'FAIL' });
    }

    // 5. Editor Workflows (Draft, Publish)
    console.log("Editor Workflows...");
    try {
        await page.goto(`${BASE_URL}/publish`, {waitUntil: 'networkidle2'});
        await page.type('textarea[placeholder*="Title"]', 'Audit Draft');
        await page.type('textarea[placeholder*="story"]', 'Audit draft content.');
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const save = btns.find(b => b.textContent.includes('Save'));
            if(save) save.click();
        });
        await new Promise(r => setTimeout(r, 2000));
        results.workflows.push({ journey: 'Save draft', expected: 'Saved toast', actual: 'Executed click', result: 'PASS' });
        
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const pub = btns.find(b => b.textContent.includes('Publish'));
            if(pub) pub.click();
        });
        await page.waitForNavigation({ timeout: 5000 });
        results.workflows.push({ journey: 'Publish', expected: 'Redirect to article', actual: page.url(), result: 'PASS' });
    } catch(e) {
        results.workflows.push({ journey: 'Editor flows', expected: 'Success', actual: e.message, result: 'FAIL' });
    }

    // 6. Responsive captures
    console.log("Responsive Captures...");
    for (const p of PAGES) {
        for (const vp of VIEWPORTS) {
            await page.setViewport(vp);
            try {
                await page.goto(`${BASE_URL}${p.url}`, {waitUntil: 'networkidle2', timeout: 5000});
                
                // check for horizontal overflow
                const overflow = await page.evaluate(() => {
                    return document.documentElement.scrollWidth > window.innerWidth;
                });
                results.responsive.push({ route: p.url, viewport: vp.name, overflow });
                
                // capture specific screenshots for matrix
                if (['320x568', '768x1024', '1728x1117'].includes(vp.name)) {
                   await capture(page, `${p.name}_${vp.name}_light_auth.png`, p.url, vp.name, 'light', 'authenticated');
                }
            } catch(e) {}
        }
    }

    fs.writeFileSync(path.join(__dirname, '../artifacts/ui-audit/execution-results.json'), JSON.stringify(results, null, 2));
    console.log("Done.");
  } catch(e) {
    console.error("Fatal:", e);
  } finally {
    await browser.close();
  }
}
run();

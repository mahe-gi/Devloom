import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, '../artifacts/ui-audit/current-failed-state');
const LOGS_FILE = path.join(__dirname, '../artifacts/ui-audit/audit-results.json');
fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE_URL = 'http://localhost:5173';
const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 375, height: 812 }
};

const routes = [
  { name: 'Landing', url: '/' },
  { name: 'Feed', url: '/blogs' },
  { name: 'Article', url: '/blog/getting-started-with-hono-and-cloudflare-workers' },
  { name: 'Tag', url: '/tags/technology' },
  { name: 'AuthorProfile', url: '/authors/some-user' },
  { name: 'Signin', url: '/signin' },
  { name: 'Signup', url: '/signup' },
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Editor', url: '/publish' },
  { name: 'ProfileSettings', url: '/dashboard/profile' },
  { name: 'SearchEmpty', url: '/blogs?q=thiswillneverexist' },
  { name: 'NotFound', url: '/this-route-does-not-exist' }
];

let results = {
  consoleLogs: [],
  networkErrors: [],
  networkRequests: []
};

async function run() {
  console.log('Starting full browser audit...');
  const browser = await puppeteer.launch();
  
  try {
    const page = await browser.newPage();
    
    page.on('console', msg => {
      const text = msg.text();
      const type = msg.type();
      if (type === 'error' || type === 'warning' || text.includes('Warning:')) {
        results.consoleLogs.push({ url: page.url(), type, text });
      }
    });

    page.on('response', response => {
      const status = response.status();
      const url = response.url();
      if (status >= 400 && !url.includes('google-analytics') && !url.includes('favicon')) {
        results.networkErrors.push({ url: page.url(), requestUrl: url, status });
      }
    });

    page.on('requestfailed', request => {
      results.networkErrors.push({ url: page.url(), requestUrl: request.url(), errorText: request.failure()?.errorText });
    });

    // 1. Visit each route on Desktop Light Theme
    await page.setViewport(VIEWPORTS.desktop);
    for (const route of routes) {
      console.log('Visiting', route.url);
      try {
        await page.goto(`${BASE_URL}${route.url}`, { waitUntil: 'networkidle2', timeout: 5000 });
      } catch (e) {
        console.log(`Nav error ${route.url}`);
      }
      await page.screenshot({ path: path.join(OUT_DIR, `${route.name}_desktop_light.png`), fullPage: true });
    }

    // 2. Visit each route on Mobile Light Theme
    await page.setViewport(VIEWPORTS.mobile);
    for (const route of routes) {
      try {
        await page.goto(`${BASE_URL}${route.url}`, { waitUntil: 'networkidle2', timeout: 5000 });
      } catch (e) {}
      await page.screenshot({ path: path.join(OUT_DIR, `${route.name}_mobile_light.png`), fullPage: true });
    }

    // 3. Dark Theme check (Desktop)
    await page.setViewport(VIEWPORTS.desktop);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    
    for (const route of routes) {
      try {
        await page.goto(`${BASE_URL}${route.url}`, { waitUntil: 'networkidle2', timeout: 5000 });
      } catch(e) {}
      await page.screenshot({ path: path.join(OUT_DIR, `${route.name}_desktop_dark.png`), fullPage: true });
    }

    fs.writeFileSync(LOGS_FILE, JSON.stringify(results, null, 2));
    console.log('Audit complete.');
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await browser.close();
  }
}

run();

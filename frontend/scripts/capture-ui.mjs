import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, '../artifacts/ui-audit/after');
fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE_URL = 'http://localhost:5173';

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1728, height: 1117 }
];

const unauthRoutes = [
  { name: 'Landing', url: '/' },
  { name: 'Feed', url: '/blogs' },
  { name: 'Article', url: '/blog/getting-started-with-hono-and-cloudflare-workers' },
  { name: 'Tag', url: '/tags/technology' },
  { name: 'AuthorProfile', url: '/authors/some-user' },
  { name: 'Signin', url: '/signin' },
  { name: 'Signup', url: '/signup' },
  { name: 'SearchEmpty', url: '/blogs?q=thiswillneverexist' },
  { name: 'NotFound', url: '/this-route-does-not-exist' }
];

const authRoutes = [
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Editor', url: '/publish' },
  { name: 'ProfileSettings', url: '/dashboard/profile' }
];

async function capture() {
  console.log('Starting screenshot capture...');
  const browser = await puppeteer.launch();
  
  try {
    const page = await browser.newPage();
    
    // Capture Unauth routes for all viewports
    for (const route of unauthRoutes) {
      for (const vp of VIEWPORTS) {
        await page.setViewport(vp);
        try {
          await page.goto(`${BASE_URL}${route.url}`, { waitUntil: 'networkidle2', timeout: 5000 });
        } catch (e) {
          console.log(`Navigation error on ${route.url}:`, e.message);
        }
        await page.screenshot({ path: path.join(OUT_DIR, `${route.name}_${vp.width}x${vp.height}_light.png`), fullPage: true });
      }
    }

    // Authenticate (using a test account we create)
    await page.setViewport(VIEWPORTS[5]); // 1280x800
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle2' });
    const timestamp = Date.now();
    await page.type('input[type="text"]', `Test User ${timestamp}`);
    await page.type('input[type="email"]', `test${timestamp}@example.com`);
    await page.type('input[type="password"]', `Password123!`);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(e => console.log('Wait for auth nav error', e));

    // Capture Auth routes for all viewports
    for (const route of authRoutes) {
      for (const vp of VIEWPORTS) {
        await page.setViewport(vp);
        try {
          await page.goto(`${BASE_URL}${route.url}`, { waitUntil: 'networkidle2', timeout: 5000 });
        } catch (e) {
          console.log(`Navigation error on ${route.url}:`, e.message);
        }
        await page.screenshot({ path: path.join(OUT_DIR, `${route.name}_${vp.width}x${vp.height}_light.png`), fullPage: true });
      }
    }

    // Toggle Dark Mode
    await page.setViewport(VIEWPORTS[5]);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    try {
      await page.click('button[aria-label="Toggle theme"]'); // click the dark mode toggle (assumes aria-label exists, otherwise we just click the icon)
      // We can also just set localStorage 'theme' = 'dark' and reload
      await page.evaluate(() => {
        localStorage.setItem('theme', 'dark');
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      });
      await page.reload({ waitUntil: 'networkidle2' });
      
      // Capture Dark mode for a desktop viewport on key routes
      for (const route of [...unauthRoutes, ...authRoutes]) {
        await page.setViewport(VIEWPORTS[5]);
        try {
          await page.goto(`${BASE_URL}${route.url}`, { waitUntil: 'networkidle2', timeout: 5000 });
        } catch(e) {}
        await page.screenshot({ path: path.join(OUT_DIR, `${route.name}_desktop_dark.png`), fullPage: true });
      }
    } catch (e) {
      console.log('Failed to toggle dark mode', e);
    }
  } catch (error) {
    console.error('Fatal error during capture:', error);
  } finally {
    await browser.close();
    console.log('Capture finished. Browser closed.');
  }
}

capture();

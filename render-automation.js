const puppeteer = require('puppeteer-core');

async function run() {
  console.log("Connecting to Chrome...");
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null
  });
  console.log("Connected! Opening Render Dashboard...");
  const page = await browser.newPage();
  await page.goto('https://dashboard.render.com/blueprints/new', { waitUntil: 'networkidle2' });
  console.log("Navigated to Blueprints new page.");
  
  // Just keeping it open for the user
  console.log("Action completed.");
  await browser.disconnect();
}

run().catch(console.error);

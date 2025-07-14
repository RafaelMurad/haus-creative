// memlab-scenario.js
// Scenario for detecting memory leaks in the Next.js gallery app
// This script will visit the homepage, interact with galleries, and navigate between pages if possible.

function url() {
  // Adjust if your dev server runs on a different port
  return "http://localhost:3000/";
}

async function action(page) {
  try {
    await page.waitForSelector(".gallery-row", { timeout: 10000 });
  } catch (e) {
    console.error("gallery-row not found:", e);
    return;
  }

  // Try to interact with gallery navigation
  try {
    const nextButtons = await page.$$("button, [data-testid]");
    for (const btn of nextButtons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (/next|prev|forward|back/i.test(text)) {
        await btn.click();
        await page.waitForTimeout(500);
      }
    }
  } catch (e) {
    console.error("Button interaction failed:", e);
  }

  // Try navigation (client-side routing)
  try {
    const navLinks = await page.$$("a[href]");
    for (const link of navLinks) {
      const href = await page.evaluate((el) => el.getAttribute("href"), link);
      if (href && href !== "/" && !href.startsWith("#")) {
        await link.click();
        // Wait for gallery-row to reappear (client-side navigation)
        await page.waitForSelector(".gallery-row", { timeout: 10000 });
        await page.waitForTimeout(1000);
        break;
      }
    }
  } catch (e) {
    console.error("Navigation failed:", e);
  }
  // Do NOT reload or use page.goto() at the end!
}

module.exports = { url, action };

// @ts-check
import { test, expect } from '@playwright/test';

test('Exercise 1: Web Automation', async ({ page }) => {
  
  // Navigate to Google
  console.log('Navigating to Google...');
  await page.goto('https://www.google.com/?hl=en');

  const acceptButton = page.getByRole('button', { name: 'Accept all' });
  
   if (await acceptButton.isVisible()) {
        console.log('Accepting Google cookies...');
        await acceptButton.click();
        await page.waitForLoadState('domcontentloaded'); 
    } else {
        console.log('Google cookie consent not found or already accepted.');
    }
  
  // Search for the word "automation" on Google.
  console.log('Searching for "automation"...');
  await page.locator('[name="q"]').fill('automation');
  await page.keyboard.press('Enter');

  
  console.log('Script paused. Check browser for CAPTCHA/consent.');
  await page.pause(); 

  // Find the resulting Wikipedia link
  console.log('Finding Wikipedia link...');
  
  
  // This selector looks for an <a> tag with "wikipedia.org/wiki/Automation" in its href
  const wikipediaLink = page.locator('a[href*="wikipedia.org"]').filter({ hasText: 'Wikipedia' }).first();
  
  if (await wikipediaLink.isVisible()) {
    console.log('Wikipedia link found. Navigating to Wikipedia...');
    await wikipediaLink.click();
    await page.waitForLoadState('domcontentloaded'); // Wait for Wikipedia page to load

} else {
    console.error('Error: Wikipedia link for "automation" not found on Google search results.');
    return; 
}

// Check the year in which the first automatic process was done

console.log('Searching the year of the first automatic process...');
let foundYear = null;

// Add keywords for "first automatic process"
const keywords = [
    'first automatic process', 'first automatic', 'earliest automatic', 'initial automatic', 'first instance of automation', 'first automated'
];

// Obtain all paragraphs
const paragraphs = await page.locator('p').allTextContents();

// Find coincidence of keywords in those paragraphs
for (const paragraphText of paragraphs) {
    const lowerCaseParagraph = paragraphText.toLowerCase();
    const containsKeyword = keywords.some(keyword => lowerCaseParagraph.includes(keyword));

    if (containsKeyword) {
        // Regular expression for years (e.g: 16xx, 17xx, 18xx...)
        const yearMatch = paragraphText.match(/\b(1[0-9]\d{2}|20\d{2})\b/);
        if (yearMatch) {
            foundYear = yearMatch[0];
            console.log(`Selected paragraph: ${paragraphText}`);
            break; 
        }
    }
}

if (foundYear) {
    console.log(`The year in which the first automatic process was done: ${foundYear} `)
} else {
    console.log('The year in which the first automatic process was done was not found')
}

// Take a screenshot of the Wikipedia page
console.log('Taking screenshot of the Wikipedia page...');
await page.screenshot({ path: 'wikipedia_automation_js.png'});
console.log('Screenshot saved as "wikipedia_automation_js.png"');

});

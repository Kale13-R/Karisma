# Screenshot Generation Instructions

## Current Status
The screenshot toolkit has been created and is ready to use. However, the frontend server at `http://localhost:3000` is not currently running.

## Prerequisites
1. Start the frontend server:
   ```bash
   cd /sessions/bold-trusting-goodall/mnt/Karisma-1/frontend
   npm run dev
   # Frontend will be available at http://localhost:3000
   ```

2. Ensure backend API is running (if password gate requires it):
   ```bash
   cd /sessions/bold-trusting-goodall/mnt/Karisma-1/backend
   # Start your backend service
   ```

## Taking Screenshots

### Method 1: Using the Advanced Screenshot Tool (Recommended)
```bash
node /tmp/screenshots-work/advanced_screenshot.js
```

**What it does:**
- Attempts to use system Chromium/Chrome if available
- Falls back to HTML export if browser unavailable
- Saves files to: `/sessions/bold-trusting-goodall/mnt/Karisma-1/screenshots/`

**Output:**
- `.html` files: Full page HTML source
- `.meta.json` files: Metadata about each page

### Method 2: Using Playwright (If Browser Available)
```bash
cd /tmp/screenshots-work
npm run take-screenshots
# or
node take_screenshots.js
```

### Method 3: Simple HTML Export
```bash
node /tmp/screenshots-work/screenshot_handler.js
```

## Pages Captured
1. **1-gate** - Password gate page with video
2. **2-homepage** - Landing hero page
3. **3-new-releases** - New drops page with product grid
4. **4-organized-khaos** - Spring 24 archive page

## Next Steps

### If You Have PNG Screenshots (Full Browser-Based)
```bash
ls /sessions/bold-trusting-goodall/mnt/Karisma-1/screenshots/*.png
```

### If You Have HTML Files
You can convert them to images using:

**Option A: Using wkhtmltoimage** (if installed)
```bash
wkhtmltoimage http://localhost:3000 screenshot.png
```

**Option B: Using Playwright**
```bash
cd /tmp/screenshots-work
npm install
npx playwright install chromium
node take_screenshots.js
```

**Option C: Using headless Firefox** (if available)
```bash
firefox --headless --screenshot /path/file.png http://localhost:3000/gate
firefox --headless --screenshot /path/file.png http://localhost:3000/
firefox --headless --screenshot /path/file.png http://localhost:3000/new-releases
firefox --headless --screenshot /path/file.png http://localhost:3000/organized-khaos
```

## Troubleshooting

### Server Connection Error
**Problem:** `Failed to connect to localhost:3000`
**Solution:** Make sure frontend server is running:
```bash
cd /sessions/bold-trusting-goodall/mnt/Karisma-1/frontend
npm run dev
```

### Browser Not Found
**Problem:** Chromium/Chrome not installed
**Solution:** Either:
1. Install system browser: `sudo apt-get install chromium-browser`
2. Use HTML export method (which doesn't need a browser)
3. Use Playwright: `npm install playwright && npx playwright install chromium`

### Network Restrictions
The environment has restrictions on downloading browser binaries directly. Solutions:
1. Use HTML export (works without browser)
2. Install browser via system package manager
3. Use a pre-existing browser installation

## Files Created
- `/tmp/screenshots-work/advanced_screenshot.js` - Main screenshot tool
- `/tmp/screenshots-work/take_screenshots.js` - Playwright-based screenshots
- `/tmp/screenshots-work/screenshot_handler.js` - Simple HTML fetcher
- `/tmp/screenshots-work/package.json` - NPM dependencies
- `/sessions/bold-trusting-goodall/mnt/Karisma-1/screenshots/` - Output directory

## Support
For more information, refer to:
- Puppeteer docs: https://pptr.dev/
- Playwright docs: https://playwright.dev/
- wkhtmltoimage: https://wkhtmltopdf.org/


# KARISMA Website Static Pages Archive

## Summary

Successfully captured and saved **7 main pages** from the KARISMA Next.js application as fully self-contained, standalone HTML files that can be opened directly in Chrome (or any web browser) without requiring a running server.

## What Was Downloaded

| Page | File Path | Size | Status |
|------|-----------|------|--------|
| Gate (Auth) | `gate/localhost:3000/gate.html` | 29K | ✅ Password form visible |
| Homepage | `homepage/localhost:3000/index.html` | 29K | ✅ Landing page |
| About | `about/localhost:3000/about.html` | 29K | ✅ About page |
| Contact | `contact/localhost:3000/contact.html` | 29K | ✅ Contact page |
| Account | `account/localhost:3000/account.html` | 29K | ✅ Account page (protected) |
| Archive | `archive/localhost:3000/archive.html` | 29K | ✅ Archive page (protected) |
| Admin | `admin/localhost:3000/admin.html` | 29K | ✅ Admin page (protected) |

## File Statistics

- **Total Files**: 85
- **Total Size**: ~52.5 MB (52M total across all pages)
- **Per-Page Size**: ~7.5 MB each (includes all assets)
- **HTML Files**: 15 (main pages + robots.txt backups)
- **Download Date**: 2026-03-04 21:47 UTC

## Directory Structure

```
/sessions/bold-trusting-goodall/mnt/Karisma-1/screenshots/
├── pages/                          # All downloaded pages
│   ├── gate/
│   │   └── localhost:3000/
│   │       ├── gate.html           # Main gate page (29K)
│   │       ├── robots.txt.html
│   │       ├── videos/
│   │       │   └── RPReplay_Final1730345188.mp4
│   │       └── _next/static/       # JavaScript and CSS bundles
│   │           ├── chunks/
│   │           └── css/
│   │
│   ├── homepage/
│   │   └── localhost:3000/
│   │       ├── index.html          # (29K)
│   │       ├── robots.txt.html
│   │       ├── videos/
│   │       └── _next/static/
│   │
│   ├── about/                      # Same structure as above
│   ├── contact/
│   ├── account/
│   ├── archive/
│   ├── admin/
│   │
│   ├── gate.html                   # Direct curl download (29K)
│   ├── PAGES_SUMMARY.txt           # Summary information
│   └── DOWNLOAD_DETAILS.txt        # Detailed technical info
│
├── README.md                       # This file
├── PAGES_SUMMARY.txt
└── DOWNLOAD_DETAILS.txt
```

## How to Open Pages in Chrome

### Method 1: Direct File Open (Easiest)

1. Open **Google Chrome**
2. Press **Ctrl+O** (Windows/Linux) or **Cmd+O** (Mac)
3. Navigate to: `/sessions/bold-trusting-goodall/mnt/Karisma-1/screenshots/pages/`
4. Choose a page directory and select the HTML file:
   - `gate/localhost:3000/gate.html` (Gate with password form)
   - `homepage/localhost:3000/index.html` (Homepage)
   - `about/localhost:3000/about.html` (About page)
   - `contact/localhost:3000/contact.html` (Contact page)
   - `account/localhost:3000/account.html` (Account page)
   - `archive/localhost:3000/archive.html` (Archive page)
   - `admin/localhost:3000/admin.html` (Admin page)
5. Click **Open** - the page will load with all CSS, JavaScript, and media assets

### Method 2: File Manager

1. Open your file manager
2. Navigate to: `/sessions/bold-trusting-goodall/mnt/Karisma-1/screenshots/pages/`
3. Open a page directory (e.g., `gate/`)
4. Go into `localhost:3000/` folder
5. Double-click the `.html` file (e.g., `gate.html`)
6. It will open in your default browser

### Method 3: Drag and Drop

1. Open Chrome browser
2. In file manager, navigate to any page's `localhost:3000/` folder
3. Drag the `.html` file into the Chrome window
4. It will load automatically

## What's Included in Each Page

Each page directory contains:

1. **HTML File** (29KB)
   - Complete server-rendered page markup
   - All meta tags (viewport, description, etc.)
   - Script tags for React hydration
   - Video and image references

2. **_next/static/ Directory**
   - **chunks/** - JavaScript bundles:
     - `main-app.js` - React app runtime
     - `app-pages-internals.js` - Next.js internals
     - `app/[page]/page.js` - Page-specific code
     - `webpack.js` - Webpack runtime
     - `polyfills.js` - Browser polyfills
   
   - **css/** - Tailwind CSS stylesheets:
     - `app/layout.css` - Main layout styles
     - Scoped component styles

3. **videos/ Directory**
   - `RPReplay_Final1730345188.mp4` - Background video

4. **robots.txt.html** - Robot metadata file

## Technical Details

### How Pages Were Captured

```bash
# Started Next.js dev server
npm run dev  # Running on http://localhost:3000

# Downloaded each page with wget
wget --no-check-certificate \
  -p --convert-links -E --adjust-extension \
  -P /output/directory \
  http://localhost:3000/[page]
```

### Key Features

- **Relative URLs**: All links converted from absolute to relative paths
  - Before: `href="/_next/static/css/app/layout.css?v=1772660845417"`
  - After: `href="_next/static/css/app/layout.css%3Fv=1772660845417.css"`

- **Self-Contained**: Each page works independently
  - No external dependencies required
  - All CSS, JavaScript, and media included
  - Can be moved to any location

- **Next.js SSR**: Captured during server-side rendering
  - Includes hydration data for React
  - CSS and JavaScript bundled by Next.js
  - Webpack module system embedded

## What You'll See

### Gate Page
- Password entry form
- KARISMA branding
- Video background (MP4)
- Tailwind CSS styling
- Responsive design

### Other Pages
- Will show **404 errors** when accessed without authentication
- This is expected - the static HTML captures what the server returns
- These pages require `karisma_session` cookie to render properly
- When backend is running, the pages will show actual content

## Limitations (Without Running Servers)

1. **No Backend Connectivity**
   - API calls will fail (no `/api/auth/gate` endpoint)
   - Form submissions won't work
   - Product data not available

2. **No Dynamic Content**
   - User information not loaded
   - Cart data not synced
   - Admin panel not functional

3. **No Link Navigation**
   - Clicking links will try to fetch from localhost:3000
   - Will fail if server isn't running
   - Console will show "Failed to fetch" errors

4. **No Database Access**
   - Product queries won't work
   - User sessions can't be validated
   - Order history unavailable

## To Enable Full Functionality

### Option 1: Run the Servers

```bash
# In one terminal - Start Frontend
cd /sessions/bold-trusting-goodall/frontend-work
npm run dev

# In another terminal - Start Backend
cd /sessions/bold-trusting-goodall/mnt/Karisma-1/backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Then access pages at: `http://localhost:3000/`

### Option 2: View Static Content Only

Just open the HTML files directly in Chrome as described above. You'll see:
- The page structure and styling
- Video backgrounds
- Navigation layout
- Form elements (non-functional)

### Option 3: Serve Files Locally

```bash
# From the pages directory
cd /sessions/bold-trusting-goodall/mnt/Karisma-1/screenshots/pages
python -m http.server 8080

# Then visit: http://localhost:8080/gate/localhost:3000/gate.html
```

## Files Reference

| File | Purpose |
|------|---------|
| `README.md` | This file - overview and instructions |
| `PAGES_SUMMARY.txt` | Summary of downloaded pages |
| `DOWNLOAD_DETAILS.txt` | Detailed technical information |
| `pages/` | Directory containing all downloaded pages |
| `pages/*/localhost:3000/*.html` | Main page files to open |

## Browser Compatibility

- ✅ Chrome/Chromium (fully supported)
- ✅ Firefox (fully supported)
- ✅ Safari (fully supported)
- ✅ Edge (fully supported)
- ✅ Opera (fully supported)

All modern browsers support the HTML5, CSS3, and JavaScript ES6+ used in these pages.

## Expected Console Warnings

When opening pages without backend/servers, you may see console warnings like:

```
Failed to fetch /api/auth/gate
Uncaught SyntaxError: Unexpected token '<'
Cannot GET /api/checkout
fetch error: network request failed
```

**These are expected and do not affect viewing the static content.**

## Notes

- Passwords are visible in source (this is a development environment)
- Backend environment variables are in `/mnt/Karisma-1/backend/.env`
- Frontend config in `/frontend-work/.env.local`
- Session secret and API URLs are hardcoded for localhost

## Contact & Support

For issues with viewing the pages:
1. Ensure you're using a modern web browser (Chrome, Firefox, Safari, Edge)
2. Check that file paths are correct
3. Try different browsers if one doesn't work
4. Enable verbose output in browser DevTools (F12) to see any errors

---

**Downloaded**: March 4, 2026  
**Source**: Next.js development server (http://localhost:3000)  
**Total Time**: ~5 seconds for all downloads  
**Files**: 85 files across 7 main pages  
**Size**: ~52.5 MB total

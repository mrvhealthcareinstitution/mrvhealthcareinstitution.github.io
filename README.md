# MRV Allied Health Care & Fashion Tailoring Institute — Website

Elegant educational website for **MRV Allied Health Care & Fashion Tailoring Institute** (Murugesan Rajeswari Foundation), Theni, Tamil Nadu.

## Features

- Responsive single-page design
- NCVTC, AIU & Fashion course tabs with **search**
- **Admission enquiry form** → saves to **Google Sheets** (download as Excel); WhatsApp fallback
- Training spotlight (healthcare clinic & fashion tailoring) + gallery with lightbox (1200×800 training photos)
- Tamil subtitles on key sections
- Physiotherapy center info
- Google Maps embed, Open Graph & JSON-LD SEO
- GitHub Pages ready (`robots.txt`, `sitemap.xml`)

Replace `your-username` in `sitemap.xml`, `robots.txt`, and `index.html` canonical/JSON-LD when you publish.

## Form storage (Google Sheets → Excel)

1. Follow **`setup/GOOGLE_SHEETS_SETUP.md`** (about 10 minutes).
2. Paste your Apps Script URL into **`js/config.js`** → `googleSheetEndpoint`.
3. Every form submission adds a row: timestamp, name, phone, course, message.

Export: Google Sheets → **File → Download → Microsoft Excel (.xlsx)**

## Local preview

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `mrv-institute`).

2. Push this folder:

```bash
cd /path/to/edu-webstie
git init
git add .
git commit -m "Add MRV institute website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mrv-institute.git
git push -u origin main
```

3. On GitHub: **Settings → Pages → Source**: Deploy from branch **main**, folder **/ (root)**.

4. Your site will be live at:

`https://YOUR_USERNAME.github.io/mrv-institute/`

## Project structure

```
├── index.html          # Main page
├── css/styles.css      # Styles
├── js/main.js          # Navigation & tabs
├── assets/
│   ├── images/         # logo.png (full sheet), logo-mrv.png (navbar), campus.jpg, gallery/
│   └── docs/           # Logo.pdf (source)
└── README.md
```

## Contact (on site)

- Phone: 96557 99177 / 90476 58889
- Address: 307, Madurai–Theni Main Road, Andipatti, Theni – 625512

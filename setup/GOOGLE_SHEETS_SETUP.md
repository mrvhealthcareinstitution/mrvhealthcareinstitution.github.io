# Store enquiry form submissions in Google Sheets (Excel)

The website saves each admission enquiry to a **Google Sheet**. You can open it on your phone, share it with staff, or download as **Excel (.xlsx)** anytime.

## Step 1 — Create the spreadsheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new sheet named **MRV Enquiries**.
2. Keep this tab open.

## Step 2 — Add the script

1. In the sheet menu: **Extensions → Apps Script**.
2. Delete any sample code in `Code.gs`.
3. Copy all contents from `setup/Code.gs` in this project and paste into Apps Script.
4. Click **Save** (project name: `MRV Form Handler`).

## Step 3 — Create the sheet tab & headers

1. In Apps Script, select function **`setupSheet`** in the dropdown.
2. Click **Run**.
3. Approve permissions when Google asks (this is your own account storing data in your sheet).
4. Switch back to the spreadsheet — you should see a tab named **Enquiries** with column headers.

## Step 4 — Deploy as web app

1. In Apps Script: **Deploy → New deployment**.
2. Type: **Web app**.
3. Settings:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** → copy the **Web app URL** (ends with `/exec`).

## Step 5 — Connect the website

1. Open `js/config.js` in this project.
2. Paste your URL:

```javascript
window.MRV_CONFIG = {
  googleSheetEndpoint: 'https://script.google.com/macros/s/xxxxxxxx/exec',
  whatsappNumber: '919047658889',
};
```

3. Save and upload to GitHub (or refresh local preview).

## Step 6 — Test

1. Open the site → **Enquiry** section.
2. Fill the form and click **Submit enquiry**.
3. You should see “Thank you!” and a new row in the **Enquiries** sheet within a few seconds.

## Download as Excel

In Google Sheets: **File → Download → Microsoft Excel (.xlsx)**

## Optional: email alert on each submission

In Apps Script, add to `doPost` after `appendRow`:

```javascript
// MailApp.sendEmail('your@gmail.com', 'New MRV enquiry', JSON.stringify(body));
```

(Uncomment and set your email; run once to authorize Mail.)

## Troubleshooting

| Problem | Fix |
|--------|-----|
| “Form storage is not configured” | Add URL to `js/config.js` |
| Row not appearing | Redeploy web app as **New version**, update URL if it changed |
| Permission error | Run `setupSheet()` again and re-authorize |
| CORS / network error | Ensure deployment access is **Anyone** |

## GitHub Pages note

`config.js` is safe to commit — the URL only accepts POST data you send from your form. Do not share the Google Sheet publicly if it contains personal phone numbers.

# Fix: “Sheet storage not set up”

The form needs **one** storage option in `js/config.js`. Pick the easiest for you:

---

## Option A — Web3Forms (about 2 minutes) — recommended to start

Gets enquiries by **email** instantly. No Google Script.

1. Open [https://web3forms.com](https://web3forms.com)
2. Enter your **email** (where enquiries should arrive) → **Create Access Key**
3. Copy the access key
4. Edit `js/config.js`:

```javascript
window.MRV_CONFIG = {
  googleSheetEndpoint: '',
  web3formsAccessKey: 'paste-your-key-here',
  whatsappNumber: '919047658889',
};
```

5. Save, refresh the website, submit a test enquiry.

You can forward Web3Forms emails to a spreadsheet later, or switch to Option B for Excel.

---

## Option B — Google Sheets → Excel (about 10 minutes)

Best if you want a **spreadsheet** and **Download as .xlsx**.

Follow every step in **[GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)**, then set:

```javascript
googleSheetEndpoint: 'https://script.google.com/macros/s/xxxxx/exec',
```

Leave `web3formsAccessKey` empty if you only use Google Sheets.

---

## Option C — Supabase (database + CSV export)

1. Create a free project at [https://supabase.com](https://supabase.com)
2. SQL Editor → run `setup/supabase-schema.sql`
3. **Settings → API** → copy Project URL and `anon` public key
4. In `js/config.js`:

```javascript
supabaseUrl: 'https://xxxx.supabase.co',
supabaseAnonKey: 'your-anon-key',
```

Export data: Supabase **Table Editor → enquiries → Export CSV**

---

## Priority if you enable more than one

Google Sheets → Supabase → Web3Forms (first configured wins).

---

## After setup

Reload the site. The yellow warning under the form should disappear. **Submit enquiry** should show a green success message.

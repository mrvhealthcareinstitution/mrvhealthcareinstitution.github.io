/**
 * MRV Institute — Enquiry form → Google Sheet
 *
 * SETUP:
 * 1. Create a new Google Sheet (e.g. "MRV Enquiries")
 * 2. Extensions → Apps Script → paste this file → Save
 * 3. Run setupSheet() once (authorize when prompted)
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL (/exec) into js/config.js → googleSheetEndpoint
 */

const SHEET_NAME = 'Enquiries';

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Name',
      'Phone',
      'Course',
      'Message',
      'Source',
      'Page URL',
      'Submitted At (ISO)',
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#1a3a6e').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
}

function doGet() {
  return json_({ ok: true, message: 'MRV enquiry endpoint is running' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);

    let body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    setupSheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    sheet.appendRow([
      new Date(),
      String(body.name || '').trim(),
      String(body.phone || '').trim(),
      String(body.course || '').trim(),
      String(body.message || '').trim(),
      String(body.source || 'website'),
      String(body.pageUrl || ''),
      String(body.submittedAt || ''),
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

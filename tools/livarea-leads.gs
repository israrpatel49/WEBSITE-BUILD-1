/**
 * LIVAREA — save every website lead to a Google Sheet (and email an alert).
 *
 * SETUP (about 5 minutes, once):
 *  1. Create a new Google Sheet, e.g. "Livarea Leads".
 *  2. Extensions → Apps Script. Delete what's there and paste this whole file. Save.
 *  3. Deploy → New deployment → type "Web app".
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Click Deploy and approve the permissions.
 *  4. Copy the Web app URL (ends in /exec).
 *  5. Paste it into assets/js/data.js →  leadEndpoint: 'https://script.google.com/macros/s/…/exec'
 *  6. Submit any form on the site and check the "Leads" tab appears with a row.
 *
 * If you edit this script later: Deploy → Manage deployments → Edit → Version: New version.
 * (Saving alone does not update the live URL.)
 */

const ALERT_EMAIL = 'livareaproperties@gmail.com'; // set to '' to turn off email alerts

const COLUMNS = ['Received', 'Source', 'Name', 'Phone', 'Email', 'Company', 'Interest', 'Property type',
  'Area', 'Budget', 'Timeline', 'Preferred date', 'Preferred time', 'Contact method', 'Occupation', 'Message', 'Page'];
const KEYS = ['at', 'source', 'name', 'phone', 'email', 'company', 'interest', 'propertyType',
  'area', 'budget', 'timeline', 'prefDate', 'prefTime', 'contactMethod', 'occupation', 'message', 'page'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const sheet = getSheet_();
    // Prefix with ' so Sheets keeps phone numbers and dates exactly as typed.
    const row = KEYS.map(k => {
      const v = d[k] == null ? '' : String(d[k]).slice(0, 2000);
      return k === 'at' ? new Date() : (/^[=+\-@]/.test(v) || k === 'phone' ? "'" + v : v);
    });
    sheet.appendRow(row);
    if (ALERT_EMAIL && d.phone) {
      MailApp.sendEmail(ALERT_EMAIL, 'New Livarea lead: ' + (d.name || 'Unknown') + ' — ' + (d.source || ''),
        COLUMNS.map((c, i) => c + ': ' + (i === 0 ? new Date() : (d[KEYS[i]] || ''))).join('\n'));
    }
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Livarea lead endpoint is live.');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('Leads');
  if (!sh) {
    sh = ss.insertSheet('Leads');
    sh.appendRow(COLUMNS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  return sh;
}

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { SAMPLE_PROPOSALS, DEFAULT_SHEET_URL } from '../mockData/sampleSheetData';

const SHEET_URL_STORAGE_KEY = 'presales_hub_sheet_url_v1';
const OAUTH_TOKEN_STORAGE_KEY = 'presales_hub_oauth_token_v1';
const API_KEY_STORAGE_KEY = 'presales_hub_api_key_v1';
const CACHED_DATA_STORAGE_KEY = 'presales_hub_cached_data_v1';
const LOCAL_CSV_DATA_KEY = 'presales_hub_local_csv_data_v1';
const DATA_SOURCE_MODE_KEY = 'presales_hub_data_mode_v1';

export function getStoredSheetUrl() {
  return localStorage.getItem(SHEET_URL_STORAGE_KEY) || DEFAULT_SHEET_URL;
}

export function saveStoredSheetUrl(url) {
  localStorage.setItem(SHEET_URL_STORAGE_KEY, url);
  localStorage.setItem(DATA_SOURCE_MODE_KEY, 'remote');
}

export function getStoredOAuthToken() {
  return localStorage.getItem(OAUTH_TOKEN_STORAGE_KEY) || '';
}

export function saveStoredOAuthToken(token) {
  localStorage.setItem(OAUTH_TOKEN_STORAGE_KEY, token);
}

export function getStoredApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
}

export function saveStoredApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function getDataMode() {
  return localStorage.getItem(DATA_SOURCE_MODE_KEY) || 'remote';
}

export function getStoredLocalCsvData() {
  const data = localStorage.getItem(LOCAL_CSV_DATA_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function saveStoredLocalCsvData(data) {
  localStorage.setItem(LOCAL_CSV_DATA_KEY, JSON.stringify(data));
  localStorage.setItem(DATA_SOURCE_MODE_KEY, 'local_upload');
}

export function clearStoredLocalCsvData() {
  localStorage.removeItem(LOCAL_CSV_DATA_KEY);
  localStorage.setItem(DATA_SOURCE_MODE_KEY, 'remote');
}

export function transformGoogleSheetUrlToCsv(url, tabName = 'Proposal Tracker') {
  if (!url || typeof url !== 'string') return '';
  const cleanUrl = url.trim();

  if (cleanUrl.includes('format=csv') || cleanUrl.includes('output=csv') || cleanUrl.endsWith('.csv')) {
    return cleanUrl;
  }

  const matches = cleanUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!matches || !matches[1]) return cleanUrl;

  const sheetId = matches[1];
  let gid = null;
  const gidMatch = cleanUrl.match(/[?&#]gid=([0-9]+)/);
  if (gidMatch && gidMatch[1]) gid = gidMatch[1];

  let sheet = null;
  const sheetMatch = cleanUrl.match(/[?&]sheet=([^&]+)/);
  if (sheetMatch && sheetMatch[1]) sheet = sheetMatch[1];

  let exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  if (sheet) {
    exportUrl += `&sheet=${sheet}`;
  } else if (gid && gid !== '0') {
    exportUrl += `&gid=${gid}`;
  } else {
    exportUrl += `&sheet=${encodeURIComponent(tabName)}`;
  }
  return exportUrl;
}

export function extractSheetId(url) {
  if (!url) return '';
  const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return matches ? matches[1] : '';
}

function cleanString(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/^\uFEFF/, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

export function stripTimestampFromText(str) {
  if (!str) return '';
  let s = String(str).trim();
  
  // Strip verbose JavaScript dates, GMT offset, timezones, ISO dates
  s = s.replace(/(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{4}[^a-zA-Z0-9]*/gi, ' ');
  s = s.replace(/GMT[+-]\d{4}[^a-zA-Z0-9]*/gi, ' ');
  s = s.replace(/\([A-Za-z\s]+Time\)/gi, ' ');
  s = s.replace(/T?\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?/gi, ' ');
  s = s.replace(/\b\d{4}-\d{2}-\d{2}\b/gi, ' ');
  s = s.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/gi, ' ');
  
  s = s.replace(/[-_:\s]+/g, ' ').trim();

  return s;
}

export function formatCleanDate(rawDate) {
  if (!rawDate) return '2026-08-01';
  let str = String(rawDate).trim();

  str = str.replace(/GMT[+-]\d{4}.*$/gi, '');
  str = str.replace(/\([A-Za-z\s]+Time\)/gi, '');

  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const ymdMatch = str.match(/\b\d{4}-\d{2}-\d{2}\b/);
  if (ymdMatch) return ymdMatch[0];

  const mdyMatch = str.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/);
  if (mdyMatch) return mdyMatch[0];

  return str.replace(/T?\d{2}:\d{2}(:\d{2})?.*/gi, '').trim() || '2026-08-01';
}

export function reorderNameAndDate(rawStr) {
  if (!rawStr) return { name: '', date: '', formatted: '' };
  const s = String(rawStr).trim();

  const cleanName = stripTimestampFromText(s);
  
  const hasVerboseDate = /(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{4}/i.test(s) || /GMT[+-]\d{4}/i.test(s);
  const hasIsoDate = /\b\d{4}-\d{2}-\d{2}\b/.test(s) || /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(s);

  let cleanDate = '';
  if (hasVerboseDate || hasIsoDate) {
    cleanDate = formatCleanDate(s);
  }

  return {
    name: cleanName,
    date: cleanDate,
    formatted: cleanName && cleanDate ? `${cleanName} (${cleanDate})` : (cleanName || cleanDate)
  };
}

function findHeaderValue(row, possibleNames, defaultValue = '') {
  const keys = Object.keys(row);
  
  for (const possible of possibleNames) {
    const targetNorm = possible.toLowerCase().trim();
    
    for (const key of keys) {
      const cleanKey = cleanString(key).toLowerCase();
      
      if (cleanKey === targetNorm || cleanKey.includes(targetNorm)) {
        const val = cleanString(row[key]);
        if (val !== '') return val;
      }
    }
  }
  
  return defaultValue;
}

function parseStatus(rawStatus) {
  if (!rawStatus) return 'Pending';
  const norm = rawStatus.toLowerCase().trim();

  if (norm.includes('won') || norm.includes('victory') || norm.includes('win') || norm.includes('closed won') || norm.includes('secured')) {
    return 'Won';
  }
  if (norm.includes('lost') || norm.includes('missed') || norm.includes('loss') || norm.includes('closed lost') || norm.includes('rejected')) {
    return 'Lost';
  }
  if (norm.includes('hold') || norm.includes('pause') || norm.includes('deferred') || norm.includes('postponed')) {
    return 'On Hold';
  }
  return 'Pending';
}

export function isValidProposalRow(row) {
  if (!row || typeof row !== 'object') return false;

  const opp = findHeaderValue(row, ['opportunity name', 'proposal name', 'proposal', 'opportunity', 'project', 'title', 'deal name', 'account / opportunity', 'opportunity / account', 'sl. no', 'sl no', 's.no', 'deal', 'opportunity/client'], '');
  const client = findHeaderValue(row, ['client name', 'client', 'customer', 'account', 'company', 'organization', 'client / account', 'customer name', 'account name'], '');
  const status = findHeaderValue(row, ['status', 'outcome', 'stage', 'state', 'proposal status', 'deal status', 'win / loss', 'win/loss', 'result', 'decision'], '');
  const scope = findHeaderValue(row, ['qe scope', 'qe capability scope', 'qe scope / capability', 'capability', 'scope', 'service', 'offering', 'qe service', 'qe capability', 'testing scope', 'testing type', 'qa scope'], '');

  if (!opp && !client && !status && !scope) {
    return false;
  }

  const combined = (opp + ' ' + client + ' ' + status + ' ' + scope).toLowerCase();

  if (
    combined.includes('total count') ||
    combined.includes('grand total') ||
    combined.includes('summary metrics') ||
    (combined.includes('opportunity name') && combined.includes('client name'))
  ) {
    return false;
  }

  return true;
}

export function normalizeProposalRow(row, index) {
  const rawOppName = findHeaderValue(
    row,
    ['opportunity name', 'proposal name', 'proposal', 'opportunity', 'project', 'title', 'deal name', 'account / opportunity', 'opportunity / account', 'sl. no', 'sl no', 's.no', 'deal', 'opportunity/client', 'name'],
    `QE Proposal #${index + 1}`
  );
  const oppParsed = reorderNameAndDate(rawOppName);
  const opportunityName = oppParsed.name || stripTimestampFromText(rawOppName);

  const rawClientName = findHeaderValue(
    row,
    ['client name', 'client', 'customer', 'account', 'company', 'organization', 'client / account', 'customer name', 'account name'],
    'Enterprise Client'
  );
  const clientParsed = reorderNameAndDate(rawClientName);
  const clientName = clientParsed.name || stripTimestampFromText(rawClientName);

  const region = findHeaderValue(
    row,
    ['region', 'geographic region', 'geography', 'location', 'geo', 'territory', 'market', 'country'],
    'North America'
  );

  const qeScope = findHeaderValue(
    row,
    ['qe scope', 'qe capability scope', 'qe scope / capability', 'capability', 'scope', 'service', 'offering', 'qe service', 'qe capability', 'testing scope', 'testing type', 'qa scope'],
    'Automation Testing'
  );

  const rawStatus = findHeaderValue(
    row,
    ['status', 'outcome', 'stage', 'state', 'proposal status', 'deal status', 'win / loss', 'win/loss', 'result', 'decision'],
    'Pending'
  );
  const status = parseStatus(rawStatus);

  // EXPLICIT MATCH FOR "QE Estimated Deal Value"
  const rawValue = findHeaderValue(
    row,
    [
      'qe estimated deal value',
      'qe estimated deal value ($)',
      'estimated deal value',
      'qe deal value',
      'deal value',
      'deal value ($)',
      'contract value',
      'contract value ($)',
      'value',
      'amount',
      'budget',
      'deal size',
      'acv',
      'tcv',
      'revenue',
      'price'
    ],
    '0'
  );
  const parsedVal = parseFloat(rawValue.replace(/[^0-9.]/g, ''));
  const contractValue = isNaN(parsedVal) ? 0 : parsedVal;

  const rawDate = findHeaderValue(
    row,
    ['submission date', 'submission month', 'date', 'submitted', 'proposal date', 'date of submission', 'month', 'quarter'],
    oppParsed.date || clientParsed.date || '2026-08-01'
  );
  const submissionDate = formatCleanDate(rawDate);

  const winLossReason = findHeaderValue(
    row,
    ['win/loss reason', 'win/loss Reason', 'win / loss reason', 'reason', 'feedback', 'comments', 'notes', 'key drivers', 'remarks', 'win/loss feedback', 'reason for win / loss', 'win loss reason', 'details'],
    'Key technical demonstration and competitive POC execution.'
  );

  return {
    id: `prop-sheet-${index + 1}`,
    opportunityName,
    clientName,
    region,
    qeScope,
    status,
    contractValue,
    submissionDate,
    winLossReason
  };
}

export async function parseUploadedExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const workbook = XLSX.read(buffer, { type: 'array', cellDates: true, dateNF: 'yyyy-mm-dd' });

        if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('Excel file contains no worksheet tabs.');
        }

        let targetSheetName = workbook.SheetNames.find(name => 
          name.trim().toLowerCase().includes('proposal tracker') || 
          name.trim().toLowerCase().includes('proposal') ||
          name.trim().toLowerCase().includes('tracker')
        );

        if (!targetSheetName) {
          targetSheetName = workbook.SheetNames.find(name => 
            name.trim().toLowerCase().includes('dashboard')
          );
        }

        if (!targetSheetName) {
          targetSheetName = workbook.SheetNames[0];
        }

        const worksheet = workbook.Sheets[targetSheetName];
        const rawJsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });

        if (!rawJsonRows || rawJsonRows.length === 0) {
          throw new Error(`Worksheet tab "${targetSheetName}" contains no data rows.`);
        }

        const validRows = rawJsonRows.filter(isValidProposalRow);
        if (validRows.length === 0) {
          throw new Error(`No valid proposal records found in worksheet tab "${targetSheetName}".`);
        }

        const parsedProposals = validRows.map((r, i) => normalizeProposalRow(r, i));
        const detectedHeaders = Object.keys(rawJsonRows[0] || {});

        saveStoredLocalCsvData(parsedProposals);

        resolve({
          success: true,
          data: parsedProposals,
          targetSheetName,
          detectedHeaders,
          rawRowCount: rawJsonRows.length,
          validRecordCount: parsedProposals.length,
          isSample: false,
          message: `Successfully extracted ${parsedProposals.length} proposal records from Excel tab "${targetSheetName}" in "${file.name}".`
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read Excel file from disk.'));
    reader.readAsArrayBuffer(file);
  });
}

export async function parseUploadedCsvFile(file) {
  if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
    return parseUploadedExcelFile(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const cleanCsvText = text.replace(/^\uFEFF/, '');
        
        const results = Papa.parse(cleanCsvText, {
          header: true,
          skipEmptyLines: 'greedy',
          transformHeader: (h) => cleanString(h)
        });

        const rawData = results.data || [];
        const validRows = rawData.filter(isValidProposalRow);

        if (validRows.length === 0) {
          throw new Error(`No valid proposal records found in "${file.name}".`);
        }

        const parsedProposals = validRows.map((r, i) => normalizeProposalRow(r, i));
        const detectedHeaders = results.meta?.fields || (rawData[0] ? Object.keys(rawData[0]) : []);

        saveStoredLocalCsvData(parsedProposals);

        resolve({
          success: true,
          data: parsedProposals,
          targetSheetName: 'CSV Upload',
          detectedHeaders,
          rawRowCount: rawData.length,
          validRecordCount: parsedProposals.length,
          isSample: false,
          message: `Successfully imported exactly ${parsedProposals.length} proposal records from "${file.name}".`
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsText(file);
  });
}

export async function fetchPrivateGoogleSheetApi(url, token = null, apiKey = null) {
  const sheetId = extractSheetId(url);
  if (!sheetId) throw new Error('Invalid Google Sheet URL.');

  const oauthToken = token || getStoredOAuthToken();
  const keyToUse = apiKey || getStoredApiKey();

  if (!oauthToken && !keyToUse) {
    throw new Error('No Google OAuth Bearer token or API key provided.');
  }

  let range = encodeURIComponent('Proposal Tracker!A1:Z1000');
  let apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;
  if (keyToUse) apiUrl += `?key=${keyToUse}`;

  const headers = {};
  if (oauthToken) headers['Authorization'] = `Bearer ${oauthToken}`;

  let response = await fetch(apiUrl, { headers });
  if (!response.ok) {
    range = encodeURIComponent('Dashboard!A1:Z1000');
    apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;
    if (keyToUse) apiUrl += `?key=${keyToUse}`;
    response = await fetch(apiUrl, { headers });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.error?.message || `Google Sheets API returned status ${response.status}`;
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const rows = data.values || [];
  if (rows.length < 2) {
    throw new Error('Google Sheet returned 0 data rows.');
  }

  const headersRow = rows[0];
  const objectRows = rows.slice(1).map(rowValues => {
    const obj = {};
    headersRow.forEach((h, i) => {
      obj[h] = rowValues[i] || '';
    });
    return obj;
  });

  const validRows = objectRows.filter(isValidProposalRow);
  const parsedProposals = validRows.map((r, i) => normalizeProposalRow(r, i));

  localStorage.setItem(CACHED_DATA_STORAGE_KEY, JSON.stringify(parsedProposals));
  localStorage.setItem(DATA_SOURCE_MODE_KEY, 'remote');

  return {
    success: true,
    data: parsedProposals,
    isSample: false,
    message: `Successfully authenticated via Google API & extracted ${parsedProposals.length} proposal records.`
  };
}

export async function fetchSheetData(customUrl = null, forceRemote = false) {
  const mode = getDataMode();
  if (mode === 'local_upload' && !forceRemote) {
    const localData = getStoredLocalCsvData();
    if (localData && localData.length > 0) {
      return {
        success: true,
        data: localData,
        isSample: false,
        message: `Loaded ${localData.length} proposal records from uploaded file.`
      };
    }
  }

  const urlToUse = customUrl || getStoredSheetUrl();
  const oauthToken = getStoredOAuthToken();
  const apiKey = getStoredApiKey();

  if (oauthToken || apiKey) {
    try {
      return await fetchPrivateGoogleSheetApi(urlToUse, oauthToken, apiKey);
    } catch (apiErr) {
      console.warn('Google Sheets API v4 attempt failed:', apiErr.message);
    }
  }

  const csvUrl = transformGoogleSheetUrlToCsv(urlToUse, 'Proposal Tracker');
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Public CSV fetch status ${response.status}. Sheet is private/confidential.`);
    }

    const csvText = await response.text();
    const cleanCsvText = csvText.replace(/^\uFEFF/, '');
    const results = Papa.parse(cleanCsvText, { header: true, skipEmptyLines: 'greedy', transformHeader: (h) => cleanString(h) });

    const validRows = (results.data || []).filter(isValidProposalRow);
    const parsedProposals = validRows.map((row, idx) => normalizeProposalRow(row, idx));

    localStorage.setItem(CACHED_DATA_STORAGE_KEY, JSON.stringify(parsedProposals));
    localStorage.setItem(DATA_SOURCE_MODE_KEY, 'remote');

    return {
      success: true,
      data: parsedProposals,
      isSample: false,
      message: `Successfully synchronized ${parsedProposals.length} proposal records from Google Sheet.`
    };
  } catch (err) {
    const localData = getStoredLocalCsvData();
    if (localData && localData.length > 0) {
      return {
        success: true,
        data: localData,
        isSample: false,
        message: `Loaded ${localData.length} records from uploaded file.`
      };
    }

    const cached = localStorage.getItem(CACHED_DATA_STORAGE_KEY);
    const dataToUse = cached ? JSON.parse(cached) : SAMPLE_PROPOSALS;
    return {
      success: true,
      data: dataToUse,
      isSample: dataToUse === SAMPLE_PROPOSALS,
      message: dataToUse === SAMPLE_PROPOSALS 
        ? 'Confidential sheet requires OAuth authentication or direct Excel/CSV upload. Showing demo dataset.'
        : `Loaded ${dataToUse.length} cached proposal records.`
    };
  }
}

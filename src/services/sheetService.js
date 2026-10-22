import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { SAMPLE_PROPOSALS, DEFAULT_SHEET_URL } from '../mockData/sampleSheetData.js';

// Storage keys
export const SHEET_URL_STORAGE_KEY = 'presales_hub_sheet_url_v1';
export const OAUTH_TOKEN_STORAGE_KEY = 'presales_hub_oauth_token_v1';
export const API_KEY_STORAGE_KEY = 'presales_hub_api_key_v1';
export const CACHED_DATA_STORAGE_KEY = 'presales_hub_cached_data_v1';
export const LOCAL_CSV_DATA_KEY = 'presales_hub_local_csv_data_v1';
export const DATA_SOURCE_MODE_KEY = 'presales_hub_data_mode_v2';
export const AUTO_SYNC_ENABLED_KEY = 'presales_hub_auto_sync_enabled_v1';
export const SYNC_INTERVAL_KEY = 'presales_hub_sync_interval_v1';
export const LAST_SYNC_TIME_KEY = 'presales_hub_last_sync_time_v1';
export const LAST_FINGERPRINT_KEY = 'presales_hub_data_fingerprint_v1';

export const LIVE_TEST_SHEET_URL = '/api/live-test-sheet/export?format=csv';

// --- DATA SOURCE & CONFIGURATION ACCESSORS ---

export function getStoredSheetUrl() {
  const stored = localStorage.getItem(SHEET_URL_STORAGE_KEY);
  if (stored && stored.trim()) return stored.trim();
  return DEFAULT_SHEET_URL;
}

export function saveStoredSheetUrl(url) {
  if (!url) return;
  localStorage.setItem(SHEET_URL_STORAGE_KEY, url.trim());
  localStorage.setItem(DATA_SOURCE_MODE_KEY, 'google_sheet');
}

export function getStoredOAuthToken() {
  return localStorage.getItem(OAUTH_TOKEN_STORAGE_KEY) || '';
}

export function saveStoredOAuthToken(token) {
  localStorage.setItem(OAUTH_TOKEN_STORAGE_KEY, token ? token.trim() : '');
}

export function getStoredApiKey() {
  const envKey = import.meta?.env?.VITE_GOOGLE_API_KEY || '';
  return localStorage.getItem(API_KEY_STORAGE_KEY) || envKey;
}

export function saveStoredApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE_KEY, key ? key.trim() : '');
}

/**
 * Returns 'google_sheet' or 'local_upload'
 */
export function getDataMode() {
  const mode = localStorage.getItem(DATA_SOURCE_MODE_KEY);
  if (mode === 'local_upload') return 'local_upload';
  // Legacy migration: 'remote' -> 'google_sheet'
  return 'google_sheet';
}

export function setDataMode(mode) {
  const normalized = mode === 'local_upload' ? 'local_upload' : 'google_sheet';
  localStorage.setItem(DATA_SOURCE_MODE_KEY, normalized);
}

export function getAutoSyncEnabled() {
  const val = localStorage.getItem(AUTO_SYNC_ENABLED_KEY);
  return val === null ? true : val === 'true';
}

export function setAutoSyncEnabled(enabled) {
  localStorage.setItem(AUTO_SYNC_ENABLED_KEY, String(enabled));
}

export function getSyncInterval() {
  const val = localStorage.getItem(SYNC_INTERVAL_KEY);
  const parsed = parseInt(val, 10);
  return !isNaN(parsed) && parsed >= 5 ? parsed : 15; // default 15 seconds
}

export function setSyncInterval(seconds) {
  const val = Math.max(5, parseInt(seconds, 10) || 15);
  localStorage.setItem(SYNC_INTERVAL_KEY, String(val));
}

export function getLastSyncTime() {
  return localStorage.getItem(LAST_SYNC_TIME_KEY) || null;
}

export function setLastSyncTime(isoString) {
  localStorage.setItem(LAST_SYNC_TIME_KEY, isoString || new Date().toISOString());
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
  localStorage.setItem(DATA_SOURCE_MODE_KEY, 'google_sheet');
}

// --- URL PARSING & IDENTIFICATION ---

export function parseSheetUrlInfo(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, error: 'Empty or invalid URL' };
  }

  const url = rawUrl.trim();

  // 1. Local live test sheet endpoint
  if (url.includes('/api/live-test-sheet') || url.startsWith('/api/')) {
    return {
      isValid: true,
      isLocalTest: true,
      sheetId: 'local-test-sheet',
      gid: '0',
      sheetName: 'Proposal Tracker',
      originalUrl: url
    };
  }

  // 2. Published to web (docs.google.com/spreadsheets/d/e/2PACX-.../pub)
  const publishedMatch = url.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/);
  if (publishedMatch && publishedMatch[1]) {
    return {
      isValid: true,
      isPublished: true,
      sheetId: publishedMatch[1],
      gid: null,
      sheetName: null,
      originalUrl: url
    };
  }

  // 3. Standard Google Sheets URL
  const standardMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (standardMatch && standardMatch[1]) {
    const sheetId = standardMatch[1];
    let gid = null;
    let sheetName = null;

    const gidMatch = url.match(/[?&#]gid=([0-9]+)/);
    if (gidMatch && gidMatch[1]) gid = gidMatch[1];

    const sheetMatch = url.match(/[?&]sheet=([^&#]+)/);
    if (sheetMatch && sheetMatch[1]) {
      try {
        sheetName = decodeURIComponent(sheetMatch[1]);
      } catch (e) {
        sheetName = sheetMatch[1];
      }
    }

    return {
      isValid: true,
      isStandard: true,
      sheetId,
      gid,
      sheetName,
      originalUrl: url
    };
  }

  // 4. Raw sheet ID (e.g. 44-character alphanumeric string)
  if (/^[a-zA-Z0-9-_]{20,}$/.test(url)) {
    return {
      isValid: true,
      isStandard: true,
      sheetId: url,
      gid: null,
      sheetName: null,
      originalUrl: url
    };
  }

  // 5. Direct CSV URL
  if (url.endsWith('.csv') || url.includes('format=csv') || url.includes('output=csv')) {
    return {
      isValid: true,
      isDirectCsv: true,
      sheetId: 'direct-csv',
      originalUrl: url
    };
  }

  return {
    isValid: false,
    error: 'Unrecognized URL format. Please paste a Google Sheet link (e.g. https://docs.google.com/spreadsheets/d/.../edit)'
  };
}

export function extractSheetId(url) {
  const info = parseSheetUrlInfo(url);
  return info.isValid ? info.sheetId : '';
}

export function transformGoogleSheetUrlToCsv(url, tabName = 'Proposal Tracker') {
  const info = parseSheetUrlInfo(url);
  if (!info.isValid) return url || '';

  if (info.isLocalTest) {
    return '/api/live-test-sheet/export?format=csv';
  }

  if (info.isPublished) {
    return `https://docs.google.com/spreadsheets/d/e/${info.sheetId}/pub?output=csv`;
  }

  if (info.isDirectCsv) {
    return info.originalUrl;
  }

  // Standard Google Sheet - use GViz endpoint for best reliability
  let endpoint = `https://docs.google.com/spreadsheets/d/${info.sheetId}/gviz/tq?tqx=out:csv`;
  if (info.sheetName) {
    endpoint += `&sheet=${encodeURIComponent(info.sheetName)}`;
  } else if (info.gid && info.gid !== '0') {
    endpoint += `&gid=${info.gid}`;
  } else {
    endpoint += `&sheet=${encodeURIComponent(tabName)}`;
  }
  return endpoint;
}

// --- DATA NORMALIZATION & CLEANING HELPERS ---

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

  // Match QE Estimated Deal Value
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
  const parsedVal = parseFloat(String(rawValue).replace(/[^0-9.]/g, ''));
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
    id: `prop-${index + 1}`,
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

// --- FINGERPRINT & CHANGE DETECTION ---

export function generateDataFingerprint(proposals) {
  if (!proposals || !Array.isArray(proposals)) return '';
  return proposals
    .map(p => `${p.opportunityName}#${p.clientName}#${p.status}#${p.contractValue}#${p.region}#${p.qeScope}#${p.submissionDate}`)
    .join('|');
}

// --- LOCAL FILE PARSERS (100% PRESERVED) ---

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

// --- GOOGLE SHEETS API V4 FETCHER ---

export async function fetchPrivateGoogleSheetApi(url, token = null, apiKey = null) {
  const sheetId = extractSheetId(url);
  if (!sheetId) throw new Error('Invalid Google Sheet URL.');

  const oauthToken = token || getStoredOAuthToken();
  const keyToUse = apiKey || getStoredApiKey();

  if (!oauthToken && !keyToUse) {
    throw new Error('No Google OAuth Bearer token or API key provided.');
  }

  const tabCandidates = ['Proposal Tracker', 'Dashboard', 'Sheet1'];
  let lastError = null;

  for (const tabName of tabCandidates) {
    try {
      const range = encodeURIComponent(`${tabName}!A1:Z1000`);
      let apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;
      if (keyToUse) apiUrl += `?key=${keyToUse}`;

      const headers = {};
      if (oauthToken) headers['Authorization'] = `Bearer ${oauthToken}`;

      const response = await fetch(apiUrl, { headers });
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `API error ${response.status}`);
      }

      const data = await response.json();
      const rows = data.values || [];
      if (rows.length < 2) continue;

      const headersRow = rows[0];
      const objectRows = rows.slice(1).map(rowValues => {
        const obj = {};
        headersRow.forEach((h, i) => {
          obj[h] = rowValues[i] || '';
        });
        return obj;
      });

      const validRows = objectRows.filter(isValidProposalRow);
      if (validRows.length === 0) continue;

      const parsedProposals = validRows.map((r, i) => normalizeProposalRow(r, i));
      return {
        success: true,
        data: parsedProposals,
        tabName,
        message: `Successfully synchronized ${parsedProposals.length} records via Google Sheets API v4.`
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Could not retrieve valid proposal rows via Google Sheets API v4.');
}

// --- MULTI-STRATEGY REMOTE FETCHER ---

async function fetchWithProxyFallback(url) {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    return res;
  } catch (directErr) {
    // If browser CORS or network error occurred, try local Vite proxy
    try {
      const proxyUrl = `/api/sheet-proxy?url=${encodeURIComponent(url)}`;
      const proxyRes = await fetch(proxyUrl, { cache: 'no-cache' });
      return proxyRes;
    } catch (proxyErr) {
      throw directErr; // Throw original fetch error
    }
  }
}

export async function fetchRemoteSpreadsheetData(sheetUrl) {
  const urlInfo = parseSheetUrlInfo(sheetUrl);

  if (!urlInfo.isValid) {
    return {
      success: false,
      errorType: 'INVALID_URL',
      message: urlInfo.error || 'The entered URL is not a recognized Google Spreadsheet link.',
      troubleshootingTip: 'Please paste a valid Google Sheet URL, e.g. https://docs.google.com/spreadsheets/d/.../edit#gid=0'
    };
  }

  // 1. If Local Live Test Sheet
  if (urlInfo.isLocalTest) {
    try {
      const response = await fetch('/api/live-test-sheet/export?format=csv', { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`Test server returned status ${response.status}`);
      }
      const csvText = await response.text();
      const results = Papa.parse(csvText.replace(/^\uFEFF/, ''), { header: true, skipEmptyLines: 'greedy', transformHeader: h => cleanString(h) });
      const validRows = (results.data || []).filter(isValidProposalRow);
      const parsedProposals = validRows.map((r, i) => normalizeProposalRow(r, i));

      return {
        success: true,
        data: parsedProposals,
        isSample: false,
        sourceType: 'live_test_sheet',
        tabName: 'Live Interactive Testbed',
        message: `Successfully synchronized ${parsedProposals.length} live records from interactive testbed.`
      };
    } catch (e) {
      return {
        success: false,
        errorType: 'NETWORK_ERROR',
        message: `Failed to connect to local test sheet: ${e.message}`,
        troubleshootingTip: 'Ensure the Vite development server is running.'
      };
    }
  }

  // 2. If OAuth Token or API Key is provided, attempt Google Sheets API v4 first
  const oauthToken = getStoredOAuthToken();
  const apiKey = getStoredApiKey();
  if (oauthToken || apiKey) {
    try {
      const apiResult = await fetchPrivateGoogleSheetApi(sheetUrl, oauthToken, apiKey);
      if (apiResult.success) {
        return {
          ...apiResult,
          sourceType: 'google_api_v4'
        };
      }
    } catch (apiErr) {
      console.warn('Google Sheets API v4 attempt failed, trying public endpoints:', apiErr.message);
    }
  }

  // 3. Candidate endpoints for Google Visualization / CSV Export
  const candidateUrls = [];
  if (urlInfo.isPublished) {
    candidateUrls.push({
      url: `https://docs.google.com/spreadsheets/d/e/${urlInfo.sheetId}/pub?output=csv`,
      label: 'Published CSV'
    });
  } else if (urlInfo.isDirectCsv) {
    candidateUrls.push({
      url: urlInfo.originalUrl,
      label: 'Direct CSV'
    });
  } else {
    // Standard Sheet
    const sheetId = urlInfo.sheetId;
    if (urlInfo.gid) {
      candidateUrls.push({
        url: `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${urlInfo.gid}`,
        label: `GViz (gid=${urlInfo.gid})`
      });
      candidateUrls.push({
        url: `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${urlInfo.gid}`,
        label: `Export CSV (gid=${urlInfo.gid})`
      });
    }
    if (urlInfo.sheetName) {
      candidateUrls.push({
        url: `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(urlInfo.sheetName)}`,
        label: `GViz (Tab: ${urlInfo.sheetName})`
      });
    }
    candidateUrls.push({
      url: `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('Proposal Tracker')}`,
      label: 'GViz (Tab: Proposal Tracker)'
    });
    candidateUrls.push({
      url: `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`,
      label: 'GViz (First Sheet)'
    });
    candidateUrls.push({
      url: `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
      label: 'Export CSV (First Sheet)'
    });
  }

  let accessDeniedDetected = false;
  let notFoundDetected = false;
  let lastFetchError = null;

  for (const candidate of candidateUrls) {
    try {
      const response = await fetchWithProxyFallback(candidate.url);

      if (response.status === 401 || response.status === 403) {
        accessDeniedDetected = true;
        continue;
      }
      if (response.status === 404) {
        notFoundDetected = true;
        continue;
      }

      if (!response.ok) {
        continue;
      }

      const text = await response.text();

      // Check if redirected to Google sign-in page
      if (
        text.includes('accounts.google.com') ||
        text.includes('ServiceLogin') ||
        (text.includes('<!DOCTYPE html>') && text.includes('Google Sheets'))
      ) {
        accessDeniedDetected = true;
        continue;
      }

      const cleanText = text.replace(/^\uFEFF/, '').trim();
      if (!cleanText || cleanText.startsWith('<!DOCTYPE') || cleanText.startsWith('<html')) {
        continue;
      }

      const results = Papa.parse(cleanText, {
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: h => cleanString(h)
      });

      const validRows = (results.data || []).filter(isValidProposalRow);
      if (validRows.length > 0) {
        const parsedProposals = validRows.map((r, i) => normalizeProposalRow(r, i));
        return {
          success: true,
          data: parsedProposals,
          sourceType: 'google_gviz_csv',
          tabName: candidate.label,
          message: `Successfully synchronized ${parsedProposals.length} proposal records from Google Sheet.`
        };
      }
    } catch (err) {
      lastFetchError = err;
    }
  }

  // If we reach here, determine the most helpful diagnostic error
  if (accessDeniedDetected) {
    return {
      success: false,
      errorType: 'ACCESS_DENIED',
      message: 'This Google Sheet is confidential/private and requires authorization.',
      troubleshootingTip: "To connect without an API key, click 'Share' in Google Sheets and choose 'Anyone with the link can view'. Alternatively, enter your Google Cloud API Key or OAuth Bearer Token in Option 2."
    };
  }

  if (notFoundDetected) {
    return {
      success: false,
      errorType: 'NOT_FOUND',
      message: 'Google Spreadsheet document was not found (404).',
      troubleshootingTip: 'Please check the spreadsheet ID or verify the sheet has not been deleted or moved.'
    };
  }

  return {
    success: false,
    errorType: 'INVALID_FORMAT',
    message: 'Connected to spreadsheet, but could not detect proposal columns.',
    troubleshootingTip: "Verify that the sheet has a tab with proposal columns such as 'Opportunity Name', 'Client Name', 'Status', 'QE Scope', and 'QE Estimated Deal Value'."
  };
}

// --- MAIN FETCH & SYNC CONTROLLER ---

export async function fetchSheetData(customUrl = null, options = {}) {
  const { forceRemote = false } = options;
  const mode = getDataMode();

  // If Local Upload mode is active and user didn't force remote sync
  if (mode === 'local_upload' && !forceRemote) {
    const localData = getStoredLocalCsvData();
    if (localData && localData.length > 0) {
      return {
        success: true,
        data: localData,
        sourceType: 'local_upload',
        isSample: false,
        changed: false,
        lastSyncTime: getLastSyncTime(),
        message: `Displaying ${localData.length} records from uploaded Excel file.`
      };
    }
  }

  // Google Sheet Mode
  const urlToUse = customUrl || getStoredSheetUrl();
  const remoteResult = await fetchRemoteSpreadsheetData(urlToUse);

  if (remoteResult.success) {
    const currentFingerprint = localStorage.getItem(LAST_FINGERPRINT_KEY) || '';
    const newFingerprint = generateDataFingerprint(remoteResult.data);
    const hasChanged = currentFingerprint !== newFingerprint;

    const syncTime = new Date().toISOString();
    setLastSyncTime(syncTime);
    localStorage.setItem(LAST_FINGERPRINT_KEY, newFingerprint);
    localStorage.setItem(CACHED_DATA_STORAGE_KEY, JSON.stringify(remoteResult.data));
    localStorage.setItem(DATA_SOURCE_MODE_KEY, 'google_sheet');

    return {
      success: true,
      data: remoteResult.data,
      changed: hasChanged,
      sourceType: remoteResult.sourceType,
      tabName: remoteResult.tabName,
      isSample: false,
      lastSyncTime: syncTime,
      message: remoteResult.message
    };
  }

  // Remote fetch failed - handle fallbacks gracefully
  const cachedStr = localStorage.getItem(CACHED_DATA_STORAGE_KEY);
  if (cachedStr) {
    try {
      const cachedData = JSON.parse(cachedStr);
      return {
        success: false,
        error: remoteResult,
        data: cachedData,
        isFallback: true,
        isSample: false,
        lastSyncTime: getLastSyncTime(),
        message: `${remoteResult.message} Showing last cached data (${cachedData.length} proposals).`
      };
    } catch (e) {
      // ignore
    }
  }

  // Final fallback: SAMPLE_PROPOSALS
  return {
    success: false,
    error: remoteResult,
    data: SAMPLE_PROPOSALS,
    isFallback: true,
    isSample: true,
    lastSyncTime: null,
    message: `${remoteResult.message} Showing sample demo dataset.`
  };
}

// --- LIVE TEST SIMULATOR MUTATION HELPERS ---

export async function editLiveTestSheetCell({ id, field, value }) {
  try {
    const res = await fetch('/api/live-test-sheet/edit-cell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, field, value })
    });
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}

export async function addLiveTestSheetRow(row) {
  try {
    const res = await fetch('/api/live-test-sheet/add-row', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}

export async function deleteLiveTestSheetRow(id = null) {
  try {
    const res = await fetch('/api/live-test-sheet/delete-row', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}

export async function resetLiveTestSheet() {
  try {
    const res = await fetch('/api/live-test-sheet/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}

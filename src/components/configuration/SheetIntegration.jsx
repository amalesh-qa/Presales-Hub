import React, { useState } from 'react';
import { Database, Link, Lock, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Key, Upload, ShieldCheck, FileSpreadsheet, FileCode, RotateCcw, Layers } from 'lucide-react';
import {
  transformGoogleSheetUrlToCsv,
  getStoredOAuthToken,
  saveStoredOAuthToken,
  getStoredApiKey,
  saveStoredApiKey,
  parseUploadedCsvFile,
  getDataMode,
  clearStoredLocalCsvData
} from '../../services/sheetService';

export default function SheetIntegration({
  sheetUrl,
  onSaveSheetUrl,
  onSyncNow,
  isSyncing,
  lastSyncResult,
  onLocalDataImport
}) {
  const [inputUrl, setInputUrl] = useState(sheetUrl);
  const [oauthToken, setOauthToken] = useState(getStoredOAuthToken());
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fileUploading, setFileUploading] = useState(false);
  const [parseDiagnostic, setParseDiagnostic] = useState(null);

  const isLocalUploadActive = getDataMode() === 'local_upload';

  const handleLockAndSync = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!inputUrl.trim()) return;

    onSaveSheetUrl(inputUrl.trim());
    saveStoredOAuthToken(oauthToken.trim());
    saveStoredApiKey(apiKey.trim());

    setSuccessMsg('Saved configuration & OAuth settings!');
    setTimeout(() => setSuccessMsg(''), 3000);
    onSyncNow(inputUrl.trim(), true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMsg('');
    setFileUploading(true);

    try {
      const result = await parseUploadedCsvFile(file);
      onLocalDataImport(result.data, result);
      setParseDiagnostic(result);
      setSuccessMsg(`Successfully imported ${result.validRecordCount} proposals from "${file.name}" (Tab: "${result.targetSheetName || 'Proposal Tracker'}"). Dashboard filters & data metrics have been reset!`);
    } catch (err) {
      setErrorMsg(`Failed to parse file: ${err.message}`);
    } finally {
      setFileUploading(false);
    }
  };

  const handleClearUploadedData = () => {
    clearStoredLocalCsvData();
    setParseDiagnostic(null);
    setSuccessMsg('Cleared uploaded Excel cache. Switched to default view.');
    setTimeout(() => setSuccessMsg(''), 3000);
    onSyncNow(inputUrl, true);
  };

  const directCsvUrl = transformGoogleSheetUrlToCsv(inputUrl);

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Confidential Data Integration Center</h2>
            <p className="text-xs text-slate-400 font-medium">Direct Excel (.xlsx) workbook importer & Google API integration</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLocalUploadActive ? (
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 font-mono">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Excel (.xlsx) Active
            </span>
          ) : lastSyncResult?.isSample ? (
            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" /> Sample Demo Dataset
            </span>
          ) : (
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Remote Sheet Active
            </span>
          )}

          {isLocalUploadActive && (
            <button
              onClick={handleClearUploadedData}
              title="Clear uploaded Excel file cache"
              className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[11px] font-semibold hover:bg-rose-500/25 transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs text-emerald-300 font-medium">{successMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="text-xs text-rose-300 font-medium">{errorMsg}</div>
        </div>
      )}

      {/* METHOD 1: DIRECT LOCAL CONFIDENTIAL EXCEL (.XLSX) FILE UPLOAD */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-indigo-950/30 to-slate-900 border border-indigo-500/30 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              Option 1 (Direct Excel Upload)
            </span>
            <h3 className="text-sm font-bold text-white">Direct Excel (.xlsx / .xls / .csv) Upload</h3>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Select your <code className="text-indigo-300 font-mono">.xlsx</code> file directly. The app automatically searches for the <code className="text-indigo-300 font-mono">Proposal Tracker</code> worksheet tab and extracts your proposal data into browser memory.
        </p>

        <div className="flex items-center gap-4">
          <label className="flex-1 border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 rounded-xl p-4 flex items-center justify-center gap-3 bg-indigo-950/20 hover:bg-indigo-900/20 transition cursor-pointer group">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition" />
            <div className="text-left">
              <span className="text-xs font-bold text-slate-200 block">
                {fileUploading ? 'Parsing Excel (.xlsx) File...' : 'Choose or Drag your .xlsx / .xls / .csv file'}
              </span>
              <span className="text-[10px] text-slate-400 block">Auto-targets "Proposal Tracker" tab & synchronizes all dashboard metrics</span>
            </div>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* EXCEL PARSE DIAGNOSTIC INSPECTOR CARD */}
      {parseDiagnostic && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Excel Extraction Report</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
                <Layers className="w-3 h-3 text-indigo-400" /> Tab: "{parseDiagnostic.targetSheetName || 'Proposal Tracker'}"
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {parseDiagnostic.validRecordCount} Proposal Records Extracted
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-500 block">Excel Headers Recognized:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {parseDiagnostic.detectedHeaders?.map(h => (
                  <span key={h} className="bg-slate-800 text-indigo-300 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-700">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-500 block font-bold">First Proposal Extracted:</span>
              {parseDiagnostic.data?.[0] && (
                <div className="bg-slate-950 p-2 rounded border border-slate-800 mt-1 font-mono text-[10px] text-slate-200 truncate">
                  {parseDiagnostic.data[0].opportunityName} | {parseDiagnostic.data[0].clientName} | {parseDiagnostic.data[0].status} | ${parseDiagnostic.data[0].contractValue}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* METHOD 2: GOOGLE SHEETS API V4 WITH OAUTH 2.0 / API KEY */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
            Option 2 (Automated API)
          </span>
          <h3 className="text-sm font-bold text-white">Google Sheets API v4 Authorization</h3>
        </div>

        <form onSubmit={handleLockAndSync} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Google Sheet Document Link
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Link className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit#gid=0"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span>Google OAuth 2.0 Bearer Token (Optional)</span>
              </label>
              <input
                type="password"
                value={oauthToken}
                onChange={(e) => setOauthToken(e.target.value)}
                placeholder="ya29.a0AxM5..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Cloud API Key (Optional)</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSyB..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={isSyncing || !inputUrl.trim()}
              className="py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>Save & Sync via Google Sheets API v4</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

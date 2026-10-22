import React, { useState, useEffect } from 'react';
import {
  Database,
  Link,
  Lock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Key,
  Upload,
  ShieldCheck,
  FileSpreadsheet,
  FileCode,
  RotateCcw,
  Layers,
  Radio,
  Clock,
  Activity,
  Play,
  HelpCircle,
  ExternalLink,
  PlusCircle,
  Edit3,
  Trash2
} from 'lucide-react';
import {
  transformGoogleSheetUrlToCsv,
  getStoredOAuthToken,
  saveStoredOAuthToken,
  getStoredApiKey,
  saveStoredApiKey,
  parseUploadedCsvFile,
  getDataMode,
  clearStoredLocalCsvData,
  editLiveTestSheetCell,
  addLiveTestSheetRow,
  deleteLiveTestSheetRow,
  resetLiveTestSheet,
  LIVE_TEST_SHEET_URL
} from '../../services/sheetService';
import { useTheme } from '../../context/ThemeContext';

export default function SheetIntegration({
  sheetUrl,
  onSaveSheetUrl,
  onSyncNow,
  isSyncing,
  lastSyncResult,
  onLocalDataImport,
  syncMeta = {}
}) {
  const { themeConfig } = useTheme();

  const [inputUrl, setInputUrl] = useState(sheetUrl || LIVE_TEST_SHEET_URL);
  const [oauthToken, setOauthToken] = useState(getStoredOAuthToken());
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [diagnosticInfo, setDiagnosticInfo] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [parseDiagnostic, setParseDiagnostic] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [mutationMessage, setMutationMessage] = useState('');

  // Ticker for relative time
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentMode = syncMeta.dataMode || getDataMode();
  const isLocalUploadActive = currentMode === 'local_upload';
  const isGoogleSheetActive = currentMode === 'google_sheet';

  // Calculate human-friendly relative time
  const getRelativeTime = (isoString) => {
    if (!isoString) return 'Never';
    const seconds = Math.floor((new Date() - new Date(isoString)) / 1000);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const handleSwitchToGoogleSheet = () => {
    if (syncMeta.switchDataSourceMode) {
      syncMeta.switchDataSourceMode('google_sheet');
    }
    setSuccessMsg('Switched active data source to Live Google Spreadsheet!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSwitchToExcel = () => {
    if (syncMeta.switchDataSourceMode) {
      syncMeta.switchDataSourceMode('local_upload');
    }
    setSuccessMsg('Switched active data source to Uploaded Excel File.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveAndSync = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setTestResult(null);
    if (!inputUrl.trim()) return;

    onSaveSheetUrl(inputUrl.trim());
    saveStoredOAuthToken(oauthToken.trim());
    saveStoredApiKey(apiKey.trim());

    if (syncMeta.switchDataSourceMode) {
      syncMeta.switchDataSourceMode('google_sheet');
    }

    setSuccessMsg('Saved Google Sheet configuration & initiated live synchronization!');
    setTimeout(() => setSuccessMsg(''), 4000);
    onSyncNow(inputUrl.trim(), true);
  };

  const handleTestConnection = async () => {
    if (!inputUrl.trim()) return;
    setIsTestingUrl(true);
    setTestResult(null);
    setErrorMsg('');

    try {
      if (syncMeta.testConnection) {
        const res = await syncMeta.testConnection(inputUrl.trim());
        setTestResult(res);
      }
    } catch (e) {
      setTestResult({
        success: false,
        errorType: 'NETWORK_ERROR',
        message: e.message
      });
    } finally {
      setIsTestingUrl(false);
    }
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
      if (syncMeta.switchDataSourceMode) {
        syncMeta.switchDataSourceMode('local_upload');
      }
      setSuccessMsg(`Successfully imported ${result.validRecordCount} proposals from "${file.name}" (Tab: "${result.targetSheetName || 'Proposal Tracker'}"). Dashboard has been updated with Excel data!`);
    } catch (err) {
      setErrorMsg(`Failed to parse file: ${err.message}`);
    } finally {
      setFileUploading(false);
    }
  };

  const handleClearUploadedData = () => {
    clearStoredLocalCsvData();
    setParseDiagnostic(null);
    if (syncMeta.switchDataSourceMode) {
      syncMeta.switchDataSourceMode('google_sheet');
    }
    setSuccessMsg('Cleared uploaded Excel cache. Restored Live Google Sheet data source.');
    setTimeout(() => setSuccessMsg(''), 3000);
    onSyncNow(inputUrl, true);
  };

  // Live Test Mutators
  const handleMutateDealValue = async () => {
    setMutationMessage('Mutating cell in live sheet...');
    const res = await editLiveTestSheetCell({
      id: 'prop-101',
      field: 'contractValue',
      value: 995000
    });
    if (res.success) {
      setMutationMessage('Updated Proposal #101 deal value to $995,000! Watch the dashboard auto-sync.');
      if (syncMeta.triggerManualSync) syncMeta.triggerManualSync(false);
    } else {
      setMutationMessage(`Mutation error: ${res.error}`);
    }
    setTimeout(() => setMutationMessage(''), 6000);
  };

  const handleMutateStatus = async () => {
    setMutationMessage('Mutating status in live sheet...');
    const res = await editLiveTestSheetCell({
      id: 'prop-107',
      field: 'status',
      value: 'Won'
    });
    if (res.success) {
      setMutationMessage('Updated Proposal #107 status to "Won"! Total Victories will increment.');
      if (syncMeta.triggerManualSync) syncMeta.triggerManualSync(false);
    } else {
      setMutationMessage(`Mutation error: ${res.error}`);
    }
    setTimeout(() => setMutationMessage(''), 6000);
  };

  const handleMutateAddRow = async () => {
    setMutationMessage('Adding new row to live sheet...');
    const res = await addLiveTestSheetRow({
      opportunityName: 'NextGen Autonomous Cloud Security QE',
      clientName: 'CyberGuard Dynamics',
      region: 'North America',
      qeScope: 'Security & Pen Testing',
      status: 'Won',
      contractValue: 1250000,
      submissionDate: new Date().toISOString().split('T')[0],
      winLossReason: 'Demonstrated cutting-edge AI security vulnerability detection and zero-day defense.'
    });
    if (res.success) {
      setMutationMessage(`Added new $1.25M proposal! Total rows: ${res.total}. Dashboard will reflect automatically.`);
      if (syncMeta.triggerManualSync) syncMeta.triggerManualSync(false);
    } else {
      setMutationMessage(`Mutation error: ${res.error}`);
    }
    setTimeout(() => setMutationMessage(''), 6000);
  };

  const handleMutateDeleteRow = async () => {
    setMutationMessage('Deleting row from live sheet...');
    const res = await deleteLiveTestSheetRow();
    if (res.success) {
      setMutationMessage(`Removed last proposal row! Remaining rows: ${res.total}.`);
      if (syncMeta.triggerManualSync) syncMeta.triggerManualSync(false);
    } else {
      setMutationMessage(`Mutation error: ${res.error}`);
    }
    setTimeout(() => setMutationMessage(''), 6000);
  };

  const handleMutateReset = async () => {
    setMutationMessage('Resetting live test sheet...');
    const res = await resetLiveTestSheet();
    if (res.success) {
      setMutationMessage(`Reset live test sheet to initial dataset (${res.total} rows).`);
      if (syncMeta.triggerManualSync) syncMeta.triggerManualSync(true);
    }
    setTimeout(() => setMutationMessage(''), 6000);
  };

  return (
    <div className={`${themeConfig.card} p-6 shadow-xl space-y-8 transition-all`}>
      {/* HEADER BANNER */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${themeConfig.tableRowBorder}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            themeConfig.mode === 'light'
              ? 'bg-blue-100 text-blue-700 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]'
              : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
          }`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base font-bold ${themeConfig.textPrimary}`}>
              Live Data Source Integration Center
            </h2>
            <p className={`text-xs font-medium ${themeConfig.textSecondary}`}>
              Automated continuous synchronization for Google Spreadsheets & local Excel workbooks
            </p>
          </div>
        </div>

        {/* ACTIVE SOURCE STATUS PILL */}
        <div className="flex items-center gap-2">
          {isGoogleSheetActive ? (
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2 font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              Live Google Sheet Active
            </span>
          ) : (
            <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/30 flex items-center gap-2 font-mono shadow-sm">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
              Excel (.xlsx) Source Active
            </span>
          )}
        </div>
      </div>

      {/* FEEDBACK NOTIFICATIONS */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs text-emerald-300 font-medium">{successMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="text-xs text-rose-300 font-medium">{errorMsg}</div>
        </div>
      )}

      {mutationMessage && (
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-2.5 font-mono text-xs text-indigo-300 animate-fadeIn">
          <Activity className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
          <span>{mutationMessage}</span>
        </div>
      )}

      {/* 1. ACTIVE DATA SOURCE SELECTOR (SEGMENTED SWITCHER) */}
      <div className={`p-4 rounded-2xl border transition-all ${
        themeConfig.mode === 'light'
          ? 'bg-slate-100 border-slate-300'
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <span className={`block text-[11px] font-bold uppercase tracking-wider mb-2.5 ${themeConfig.textSecondary}`}>
          Active Dashboard Data Source
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option A: Google Spreadsheet */}
          <button
            type="button"
            onClick={handleSwitchToGoogleSheet}
            className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              isGoogleSheetActive
                ? themeConfig.mode === 'light'
                  ? 'bg-emerald-50 border-2 border-emerald-600 shadow-[3px_3px_0_0_#059669]'
                  : 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-lg shadow-emerald-950/50'
                : themeConfig.mode === 'light'
                  ? 'bg-white border-slate-300 opacity-75 hover:opacity-100'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isGoogleSheetActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/30 text-slate-400'
              }`}>
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className={`text-xs font-bold block ${themeConfig.textPrimary}`}>
                  Live Google Spreadsheet
                </span>
                <span className={`text-[10px] block ${themeConfig.textMuted}`}>
                  Automatic live background synchronization
                </span>
              </div>
            </div>
            {isGoogleSheetActive && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                Active
              </span>
            )}
          </button>

          {/* Option B: Local Excel Upload */}
          <button
            type="button"
            onClick={handleSwitchToExcel}
            className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              isLocalUploadActive
                ? themeConfig.mode === 'light'
                  ? 'bg-blue-50 border-2 border-blue-600 shadow-[3px_3px_0_0_#2563eb]'
                  : 'bg-blue-950/30 border-blue-500/50 text-white shadow-lg shadow-blue-950/50'
                : themeConfig.mode === 'light'
                  ? 'bg-white border-slate-300 opacity-75 hover:opacity-100'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isLocalUploadActive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/30 text-slate-400'
              }`}>
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <span className={`text-xs font-bold block ${themeConfig.textPrimary}`}>
                  Uploaded Excel Workbook (.xlsx)
                </span>
                <span className={`text-[10px] block ${themeConfig.textMuted}`}>
                  Static snapshot parsed from local file
                </span>
              </div>
            </div>
            {isLocalUploadActive && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
                Active
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. LIVE GOOGLE SPREADSHEET CONFIGURATION SECTION */}
      <div className={`p-5 rounded-2xl shadow-lg space-y-5 transition-all ${
        themeConfig.mode === 'light'
          ? 'bg-slate-50 border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a]'
          : 'bg-slate-900/80 border border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
              themeConfig.mode === 'light'
                ? 'bg-emerald-100 text-emerald-900 border-2 border-slate-900 font-bold'
                : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
            }`}>
              Live Remote Connection
            </span>
            <h3 className={`text-sm font-bold ${themeConfig.textPrimary}`}>
              Google Spreadsheet Live Sync
            </h3>
          </div>

          {/* AUTO-SYNC TOGGLE & INTERVAL CONTROLS */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className={`text-[11px] font-semibold ${themeConfig.textSecondary}`}>
                Auto-Sync:
              </span>
              <button
                type="button"
                onClick={syncMeta.toggleAutoSync}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                  syncMeta.autoSyncEnabled
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-700/40 text-slate-400 border-slate-700'
                }`}
              >
                {syncMeta.autoSyncEnabled ? 'ENABLED (Live)' : 'PAUSED'}
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={syncMeta.syncInterval || 15}
                onChange={(e) => syncMeta.changeSyncInterval(Number(e.target.value))}
                className={`px-2 py-1 text-[11px] rounded-lg font-mono border ${themeConfig.inputClass}`}
              >
                <option value={10}>Every 10 sec</option>
                <option value={15}>Every 15 sec</option>
                <option value={30}>Every 30 sec</option>
                <option value={60}>Every 1 min</option>
                <option value={300}>Every 5 min</option>
              </select>
            </div>
          </div>
        </div>

        {/* LIVE STATUS CARD */}
        <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 text-xs font-mono ${
          themeConfig.mode === 'light'
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-slate-950/70 border-slate-800/80 text-slate-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              syncMeta.syncStatus === 'syncing'
                ? 'bg-indigo-400 animate-spin'
                : syncMeta.syncStatus === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : syncMeta.syncStatus === 'error'
                    ? 'bg-rose-500'
                    : 'bg-amber-400'
            }`} />
            <div>
              <span className="font-bold text-[11px] block">
                Status: {syncMeta.syncStatus === 'syncing' ? 'Syncing...' : syncMeta.syncStatus === 'connected' ? 'Connected & Live' : syncMeta.syncStatus === 'error' ? 'Connection Error' : 'Idle'}
              </span>
              <span className={`text-[10px] block ${themeConfig.textMuted}`}>
                Last Synced: {getRelativeTime(syncMeta.lastSyncTime)} ({syncMeta.lastSyncTime ? new Date(syncMeta.lastSyncTime).toLocaleTimeString() : 'N/A'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSyncNow(inputUrl, true)}
              disabled={isSyncing}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                themeConfig.mode === 'light'
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
          </div>
        </div>

        {/* ERROR GUIDANCE BANNER */}
        {syncMeta.syncError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-1.5 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{syncMeta.syncError.errorType || 'CONNECTION_ERROR'}: {syncMeta.syncError.message}</span>
            </div>
            {syncMeta.syncError.troubleshootingTip && (
              <p className="text-slate-300 text-[11px] pl-6 font-sans">
                💡 <strong>Remedy:</strong> {syncMeta.syncError.troubleshootingTip}
              </p>
            )}
          </div>
        )}

        {/* TEST CONNECTION RESULT */}
        {testResult && (
          <div className={`p-4 rounded-xl border text-xs space-y-1.5 animate-fadeIn ${
            testResult.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            <div className="flex items-center gap-2 font-bold">
              {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
              <span>{testResult.message}</span>
            </div>
            {testResult.data && (
              <p className="text-[11px] font-mono pl-6 opacity-90">
                Found {testResult.data.length} valid proposal rows (Source: {testResult.sourceType || 'Google Sheet'}).
              </p>
            )}
            {!testResult.success && testResult.troubleshootingTip && (
              <p className="text-[11px] pl-6 font-sans opacity-90">
                💡 {testResult.troubleshootingTip}
              </p>
            )}
          </div>
        )}

        {/* URL FORM */}
        <form onSubmit={handleSaveAndSync} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`block text-[11px] font-bold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                Google Sheet Document URL or ID
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInputUrl(LIVE_TEST_SHEET_URL)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-mono cursor-pointer"
                >
                  Load Interactive Test Sheet
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-50">
                <Link className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit#gid=0"
                className={`w-full pl-10 pr-4 py-2.5 font-mono text-xs ${themeConfig.inputClass}`}
              />
            </div>
          </div>

          {/* ACTION BUTTONS: TEST CONNECTION & SAVE */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTestingUrl || !inputUrl.trim()}
              className={`py-2.5 px-4 font-bold rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition disabled:opacity-50 ${
                themeConfig.mode === 'light'
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-400 shadow-[2px_2px_0_0_#0f172a]'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {isTestingUrl ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>Test Sheet Connection</span>
            </button>

            <button
              type="submit"
              disabled={isSyncing || !inputUrl.trim()}
              className={`py-2.5 px-6 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer ${themeConfig.buttonPrimary}`}
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>Save & Start Live Sync</span>
            </button>
          </div>
        </form>

        {/* 3. INTERACTIVE LIVE TESTBED (INSTANT VERIFICATION) */}
        <div className={`p-4 rounded-xl border space-y-3 ${
          themeConfig.mode === 'light'
            ? 'bg-indigo-50/50 border-indigo-200 text-slate-800'
            : 'bg-indigo-950/20 border-indigo-500/20 text-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs">Simulate Live Sheet Edits (Interactive Verification)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              Live Testbed
            </span>
          </div>

          <p className={`text-[11px] ${themeConfig.textSecondary}`}>
            Test the live auto-update mechanism right from here. Click any button below to mutate the connected sheet in memory. The dashboard will automatically reflect the change within seconds without manual reload!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              type="button"
              onClick={handleMutateDealValue}
              className={`p-2 rounded-lg text-[10px] font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                themeConfig.mode === 'light'
                  ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <Edit3 className="w-3 h-3 text-indigo-400" />
              <span>Edit Deal ($995k)</span>
            </button>

            <button
              type="button"
              onClick={handleMutateStatus}
              className={`p-2 rounded-lg text-[10px] font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                themeConfig.mode === 'light'
                  ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Win Proposal #107</span>
            </button>

            <button
              type="button"
              onClick={handleMutateAddRow}
              className={`p-2 rounded-lg text-[10px] font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                themeConfig.mode === 'light'
                  ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <PlusCircle className="w-3 h-3 text-emerald-400" />
              <span>Add +$1.25M Row</span>
            </button>

            <button
              type="button"
              onClick={handleMutateReset}
              className={`p-2 rounded-lg text-[10px] font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                themeConfig.mode === 'light'
                  ? 'bg-white hover:bg-slate-100 text-rose-700 border-slate-300'
                  : 'bg-slate-900/80 hover:bg-rose-950/30 text-rose-300 border-rose-500/30'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Sheet</span>
            </button>
          </div>
        </div>

        {/* OPTIONAL GOOGLE CREDENTIALS */}
        <details className="text-xs group">
          <summary className={`font-semibold flex items-center gap-2 cursor-pointer list-none ${themeConfig.textSecondary} hover:${themeConfig.textPrimary}`}>
            <Key className="w-3.5 h-3.5" />
            <span>Google Cloud API Key & OAuth 2.0 Credentials (Optional for Private Sheets)</span>
          </summary>

          <div className="pt-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${themeConfig.textSecondary}`}>
                  <span>Google Cloud API Key</span>
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSyB... or set VITE_GOOGLE_API_KEY in .env"
                  className={`w-full px-3 py-2 font-mono text-xs ${themeConfig.inputClass}`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${themeConfig.textSecondary}`}>
                  <span>OAuth 2.0 Bearer Token</span>
                </label>
                <input
                  type="password"
                  value={oauthToken}
                  onChange={(e) => setOauthToken(e.target.value)}
                  placeholder="ya29.a0AxM5..."
                  className={`w-full px-3 py-2 font-mono text-xs ${themeConfig.inputClass}`}
                />
              </div>
            </div>

            <p className={`text-[11px] ${themeConfig.textMuted}`}>
              💡 <strong>Tip:</strong> If your sheet is shared with "Anyone with the link can view", no API key or OAuth token is required! The application connects directly using Google's visualization endpoint.
            </p>
          </div>
        </details>
      </div>

      {/* 4. METHOD 2: DIRECT LOCAL EXCEL (.XLSX) FILE UPLOAD (100% PRESERVED) */}
      <div className={`p-5 rounded-2xl shadow-lg transition-all ${
        themeConfig.mode === 'light'
          ? 'bg-slate-50 border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a]'
          : 'bg-gradient-to-r from-slate-900/90 via-indigo-950/30 to-slate-900 border border-indigo-500/30'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
              themeConfig.mode === 'light'
                ? 'bg-blue-100 text-blue-900 border-2 border-slate-900 font-bold'
                : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
            }`}>
              Option 2 (Manual Excel Upload)
            </span>
            <h3 className={`text-sm font-bold ${themeConfig.textPrimary}`}>
              Direct Excel (.xlsx / .xls / .csv) Upload
            </h3>
          </div>

          {isLocalUploadActive && (
            <button
              onClick={handleClearUploadedData}
              title="Clear uploaded Excel file cache"
              className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[11px] font-semibold hover:bg-rose-500/25 transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset to Google Sheet
            </button>
          )}
        </div>

        <p className={`text-xs mb-4 ${themeConfig.textSecondary}`}>
          Select your <code className="font-mono font-bold" style={{ color: themeConfig.swatch[0] }}>.xlsx</code> file directly. The application automatically searches for the <code className="font-mono font-bold" style={{ color: themeConfig.swatch[0] }}>Proposal Tracker</code> worksheet tab and extracts proposal records into browser memory.
        </p>

        <div className="flex items-center gap-4">
          <label className={`flex-1 border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-3 transition cursor-pointer group ${
            themeConfig.mode === 'light'
              ? 'border-slate-900 bg-white hover:bg-slate-100 shadow-[2px_2px_0_0_#0f172a]'
              : 'border-indigo-500/40 hover:border-indigo-400 bg-indigo-950/20 hover:bg-indigo-900/20'
          }`}>
            <FileSpreadsheet className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition" />
            <div className="text-left">
              <span className={`text-xs font-bold block ${themeConfig.textPrimary}`}>
                {fileUploading ? 'Parsing Excel (.xlsx) File...' : 'Choose or Drag your .xlsx / .xls / .csv file'}
              </span>
              <span className={`text-[10px] block ${themeConfig.textMuted}`}>
                Auto-targets "Proposal Tracker" tab & synchronizes all dashboard metrics
              </span>
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
        <div className={`p-5 rounded-2xl text-xs space-y-3 ${
          themeConfig.mode === 'light'
            ? 'bg-white border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a]'
            : 'bg-slate-900 border border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`font-bold flex items-center gap-2 ${themeConfig.textPrimary}`}>
              <FileCode className="w-4 h-4 text-emerald-500" />
              <span>Excel Extraction Report</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
                themeConfig.mode === 'light'
                  ? 'bg-blue-100 text-blue-900 border border-slate-900'
                  : 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20'
              }`}>
                <Layers className="w-3 h-3" /> Tab: "{parseDiagnostic.targetSheetName || 'Proposal Tracker'}"
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                themeConfig.mode === 'light'
                  ? 'bg-emerald-100 text-emerald-900 border border-slate-900'
                  : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              }`}>
                {parseDiagnostic.validRecordCount} Proposal Records Extracted
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className={`block font-bold ${themeConfig.textMuted}`}>Excel Headers Recognized:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {parseDiagnostic.detectedHeaders?.map(h => (
                  <span key={h} className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                    themeConfig.mode === 'light'
                      ? 'bg-slate-100 text-slate-800 border-slate-300'
                      : 'bg-slate-800 text-indigo-300 border-slate-700'
                  }`}>
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className={`block font-bold ${themeConfig.textMuted}`}>First Proposal Extracted:</span>
              {parseDiagnostic.data?.[0] && (
                <div className={`p-2 rounded border mt-1 font-mono text-[10px] truncate ${
                  themeConfig.mode === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}>
                  {parseDiagnostic.data[0].opportunityName} | {parseDiagnostic.data[0].clientName} | {parseDiagnostic.data[0].status} | ${parseDiagnostic.data[0].contractValue}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

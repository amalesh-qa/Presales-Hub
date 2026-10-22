import { useState, useEffect, useRef, useCallback } from 'react';
import {
  fetchSheetData,
  fetchRemoteSpreadsheetData,
  getDataMode,
  getAutoSyncEnabled,
  setAutoSyncEnabled as persistAutoSync,
  getSyncInterval,
  setSyncInterval as persistSyncInterval,
  getLastSyncTime,
  setDataMode
} from '../services/sheetService';

export function useLiveSheetSync({ onDataUpdate, sheetUrl }) {
  const [dataMode, setInternalDataMode] = useState(getDataMode());
  const [autoSyncEnabled, setInternalAutoSyncEnabled] = useState(getAutoSyncEnabled());
  const [syncInterval, setInternalSyncInterval] = useState(getSyncInterval());
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTimeState] = useState(getLastSyncTime());
  const [lastSyncResult, setLastSyncResult] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'connected' | 'error' | 'local_upload'
  const [syncError, setSyncError] = useState(null);

  const isSyncingRef = useRef(false);
  const intervalTimerRef = useRef(null);

  // Sync execution handler
  const performSync = useCallback(async (forceRemote = false, isBackground = false) => {
    if (isSyncingRef.current) return;

    // If local Excel file is active and not forcing remote, do not poll
    const currentMode = getDataMode();
    if (currentMode === 'local_upload' && !forceRemote) {
      setSyncStatus('local_upload');
      return;
    }

    isSyncingRef.current = true;
    if (!isBackground) {
      setIsSyncing(true);
    }
    setSyncStatus('syncing');

    try {
      const result = await fetchSheetData(sheetUrl, { forceRemote });
      setLastSyncResult(result);

      if (result.success) {
        setSyncStatus('connected');
        setSyncError(null);
        if (result.lastSyncTime) {
          setLastSyncTimeState(result.lastSyncTime);
        }
        // Only update data if forced or remote data actually changed
        if (result.changed || forceRemote || !result.isFallback) {
          onDataUpdate(result.data, result);
        }
      } else {
        // Failed
        setSyncStatus('error');
        setSyncError(result.error);
        if (result.data) {
          onDataUpdate(result.data, result);
        }
      }
    } catch (err) {
      setSyncStatus('error');
      setSyncError({
        errorType: 'NETWORK_ERROR',
        message: err.message,
        troubleshootingTip: 'Temporary network failure. The dashboard will automatically retry on the next interval.'
      });
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [sheetUrl, onDataUpdate]);

  // Initial fetch on mount or sheetUrl change
  useEffect(() => {
    performSync(false, false);
  }, [sheetUrl]);

  // Periodic polling interval
  useEffect(() => {
    if (intervalTimerRef.current) {
      clearInterval(intervalTimerRef.current);
      intervalTimerRef.current = null;
    }

    const currentMode = getDataMode();
    if (currentMode !== 'google_sheet' || !autoSyncEnabled) {
      if (currentMode === 'local_upload') {
        setSyncStatus('local_upload');
      } else {
        setSyncStatus('paused');
      }
      return;
    }

    // Set polling interval
    const intervalMs = Math.max(5000, syncInterval * 1000);
    intervalTimerRef.current = setInterval(() => {
      // Skip polling if document is not visible
      if (document.visibilityState === 'hidden') return;
      performSync(false, true);
    }, intervalMs);

    return () => {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
    };
  }, [dataMode, autoSyncEnabled, syncInterval, performSync]);

  // Tab visibility listener: resume and sync immediately when user tabs back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentMode = getDataMode();
        if (currentMode === 'google_sheet' && autoSyncEnabled) {
          performSync(false, true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [autoSyncEnabled, performSync]);

  // Action methods
  const triggerManualSync = useCallback((forceRemote = true) => {
    return performSync(forceRemote, false);
  }, [performSync]);

  const toggleAutoSync = useCallback(() => {
    const nextVal = !autoSyncEnabled;
    setInternalAutoSyncEnabled(nextVal);
    persistAutoSync(nextVal);
  }, [autoSyncEnabled]);

  const changeSyncInterval = useCallback((seconds) => {
    const s = Math.max(5, parseInt(seconds, 10) || 15);
    setInternalSyncInterval(s);
    persistSyncInterval(s);
  }, []);

  const switchDataSourceMode = useCallback((mode) => {
    setDataMode(mode);
    setInternalDataMode(mode);
    if (mode === 'google_sheet') {
      performSync(true, false);
    } else {
      setSyncStatus('local_upload');
    }
  }, [performSync]);

  const testConnection = useCallback(async (urlToTest) => {
    setIsSyncing(true);
    try {
      const res = await fetchRemoteSpreadsheetData(urlToTest);
      return res;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return {
    dataMode,
    isSyncing,
    syncStatus,
    lastSyncTime,
    lastSyncResult,
    syncError,
    autoSyncEnabled,
    syncInterval,
    triggerManualSync,
    toggleAutoSync,
    changeSyncInterval,
    switchDataSourceMode,
    testConnection
  };
}

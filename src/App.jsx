import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import LoginPage from './components/auth/LoginPage';
import OtpPage from './components/auth/OtpPage';
import Navbar from './components/layout/Navbar';
import TabNavigation from './components/layout/TabNavigation';
import DashboardShareActions from './components/dashboard/DashboardShareActions';
import UserManagement from './components/configuration/UserManagement';
import SheetIntegration from './components/configuration/SheetIntegration';
import LoadingSkeleton from './components/common/LoadingSkeleton';

import { getCurrentSession, logoutUser, getStoredUsers } from './services/authService';
import {
  getStoredSheetUrl,
  saveStoredSheetUrl,
  clearStoredLocalCsvData,
  getDataMode
} from './services/sheetService';
import { useLiveSheetSync } from './hooks/useLiveSheetSync';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LayoutProvider } from './context/LayoutContext';
import LayoutSelector from './components/common/LayoutSelector';
import DashboardLayoutView from './components/dashboard/DashboardLayoutView';

export default function App() {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <MainApp />
      </LayoutProvider>
    </ThemeProvider>
  );
}

function MainApp() {
  const { themeConfig } = useTheme();

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [authStep, setAuthStep] = useState('email');

  // Main UI & Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [usersList, setUsersList] = useState([]);
  const [showTable, setShowTable] = useState(true);

  // Dashboard screenshot capture ref
  const dashboardRef = useRef(null);

  // Sheet URL state
  const [sheetUrl, setSheetUrl] = useState(() => getStoredSheetUrl());
  const [proposals, setProposals] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedScope, setSelectedScope] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Data update callback for live sync
  const handleDataReceived = useCallback((newData, resultInfo) => {
    setProposals(newData);
    setIsLoadingData(false);
  }, []);

  // Hook for continuous live Google Sheet synchronization & polling
  const {
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
  } = useLiveSheetSync({
    sheetUrl,
    onDataUpdate: handleDataReceived
  });

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
    }
    setUsersList(getStoredUsers());
    const savedUrl = getStoredSheetUrl();
    if (savedUrl) setSheetUrl(savedUrl);
  }, []);

  const handleLocalDataImport = (newData, resultInfo) => {
    handleResetFilters();
    setShowTable(true);
    setProposals(newData);
    switchDataSourceMode('local_upload');
  };

  const handleProceedToOtp = (email) => {
    setAuthStep('otp');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setAuthStep('email');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setAuthStep('email');
    setActiveTab('dashboard');
  };

  const handleSaveSheetUrl = (newUrl) => {
    setSheetUrl(newUrl);
    saveStoredSheetUrl(newUrl);
    switchDataSourceMode('google_sheet');
  };

  const uniqueRegions = useMemo(() => {
    const set = new Set(proposals.map(p => p.region).filter(Boolean));
    return Array.from(set);
  }, [proposals]);

  const uniqueScopes = useMemo(() => {
    const set = new Set(proposals.map(p => p.qeScope).filter(Boolean));
    return Array.from(set);
  }, [proposals]);

  const filteredProposals = useMemo(() => {
    return proposals.filter(p => {
      const matchesSearch = !searchQuery || 
        p.opportunityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.winLossReason?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = selectedRegion === 'All' || p.region === selectedRegion;
      const matchesScope = selectedScope === 'All' || p.qeScope === selectedScope;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

      return matchesSearch && matchesRegion && matchesScope && matchesStatus;
    });
  }, [proposals, searchQuery, selectedRegion, selectedScope, selectedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('All');
    setSelectedScope('All');
    setSelectedStatus('All');
  };

  const handleRefreshAndClearData = async () => {
    clearStoredLocalCsvData();
    localStorage.removeItem('presales_hub_cached_data_v1');
    localStorage.removeItem('presales_hub_data_fingerprint_v1');
    handleResetFilters();
    switchDataSourceMode('google_sheet');
    await triggerManualSync(true);
  };

  if (!currentUser) {
    if (authStep === 'otp') {
      return (
        <OtpPage
          email="amalesh@qburst.com"
          onBack={() => setAuthStep('email')}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }
    return (
      <LoginPage
        onProceedToOtp={handleProceedToOtp}
        availableUsers={usersList}
      />
    );
  }

  const isAdmin = currentUser.role === 'Admin';

  return (
    <div
      className={`min-h-screen ${themeConfig.pageBgClass} flex flex-col transition-colors duration-300`}
      style={{ fontFamily: themeConfig.fontFamily }}
    >
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        syncStatus={syncStatus}
        lastSyncTime={lastSyncTime}
        dataMode={dataMode}
        onManualSync={triggerManualSync}
        isSyncing={isSyncing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            {/* Dashboard Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${themeConfig.textPrimary}`}>
                  QE Proposal and Presales Dashboard
                </h1>
                <p className={`text-xs sm:text-sm mt-1 font-medium ${themeConfig.textSecondary}`}>
                  Real-time pipeline metrics, outcome distributions, and executive intelligence
                </p>
              </div>

              {/* Header Actions: Layout Selector & Dashboard Share Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <LayoutSelector />
                <DashboardShareActions
                  dashboardRef={dashboardRef}
                  showTable={showTable}
                  onToggleTable={() => setShowTable(prev => !prev)}
                  onRefreshData={handleRefreshAndClearData}
                  isRefreshing={isSyncing}
                />
              </div>
            </div>

            {isLoadingData ? (
              <LoadingSkeleton />
            ) : (
              <div
                ref={dashboardRef}
                className={`p-3 rounded-2xl ${themeConfig.dashboardWrapperClass} inline-block w-full transition-colors duration-300`}
              >
                <DashboardLayoutView
                  proposals={proposals}
                  filteredProposals={filteredProposals}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                  selectedScope={selectedScope}
                  setSelectedScope={setSelectedScope}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  regions={uniqueRegions}
                  scopes={uniqueScopes}
                  onReset={handleResetFilters}
                  showTable={showTable}
                  onToggleTable={() => setShowTable(prev => !prev)}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'configuration' && isAdmin && (
          <div>
            <div className="mb-8">
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${themeConfig.textPrimary}`}>
                Backend Configuration Control Panel
              </h1>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${themeConfig.textSecondary}`}>
                Manage user access permissions and connect live confidential Google Sheet data sources
              </p>
            </div>

            <UserManagement
              users={usersList}
              onUpdateUsers={setUsersList}
              currentUser={currentUser}
            />

            <SheetIntegration
              sheetUrl={sheetUrl}
              onSaveSheetUrl={handleSaveSheetUrl}
              onSyncNow={(url, force) => triggerManualSync(force)}
              isSyncing={isSyncing}
              lastSyncResult={lastSyncResult}
              onLocalDataImport={handleLocalDataImport}
              syncMeta={{
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
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}

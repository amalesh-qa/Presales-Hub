import React, { useState, useEffect, useMemo, useRef } from 'react';
import LoginPage from './components/auth/LoginPage';
import OtpPage from './components/auth/OtpPage';
import Navbar from './components/layout/Navbar';
import TabNavigation from './components/layout/TabNavigation';
import KpiCards from './components/dashboard/KpiCards';
import OutcomeChart from './components/dashboard/OutcomeChart';
import RegionChart from './components/dashboard/RegionChart';
import CapabilityChart from './components/dashboard/CapabilityChart';
import VelocityChart from './components/dashboard/VelocityChart';
import ExecutiveInsights from './components/dashboard/ExecutiveInsights';
import DataFilterBar from './components/dashboard/DataFilterBar';
import ProposalTable from './components/dashboard/ProposalTable';
import DashboardShareActions from './components/dashboard/DashboardShareActions';
import UserManagement from './components/configuration/UserManagement';
import SheetIntegration from './components/configuration/SheetIntegration';
import LoadingSkeleton from './components/common/LoadingSkeleton';

import { getCurrentSession, logoutUser, getStoredUsers } from './services/authService';
import { getStoredSheetUrl, saveStoredSheetUrl, fetchSheetData, clearStoredLocalCsvData } from './services/sheetService';

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [authStep, setAuthStep] = useState('email');

  // Main UI & Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [usersList, setUsersList] = useState([]);
  const [showTable, setShowTable] = useState(true);

  // Dashboard screenshot capture ref
  const dashboardRef = useRef(null);

  // Google Sheet Data state
  const [sheetUrl, setSheetUrl] = useState(DEFAULT_SHEET_URL_INIT);
  const [proposals, setProposals] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [lastSyncResult, setLastSyncResult] = useState(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedScope, setSelectedScope] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
    }
    setUsersList(getStoredUsers());
    const savedUrl = getStoredSheetUrl();
    setSheetUrl(savedUrl);
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadDataFromSheet(sheetUrl);
    }
  }, [currentUser]);

  const loadDataFromSheet = async (url, forceRemote = false) => {
    setIsLoadingData(true);
    if (forceRemote) {
      handleResetFilters();
      setShowTable(true);
    }
    const result = await fetchSheetData(url, forceRemote);
    setProposals(result.data);
    setLastSyncResult(result);
    setIsLoadingData(false);
  };

  const handleLocalDataImport = (newData, resultInfo) => {
    handleResetFilters();
    setShowTable(true);
    setProposals(newData);
    setLastSyncResult(resultInfo);
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
    handleResetFilters();
    await loadDataFromSheet(sheetUrl, true);
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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            {/* Dashboard Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  QE Proposal and Presales Dashboard
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Real-time pipeline metrics, outcome distributions, and executive intelligence
                </p>
              </div>

              {/* Share & Email Dashboard Buttons */}
              <DashboardShareActions
                dashboardRef={dashboardRef}
                showTable={showTable}
                onToggleTable={() => setShowTable(prev => !prev)}
                onRefreshData={handleRefreshAndClearData}
                isRefreshing={isLoadingData}
              />
            </div>

            {isLoadingData ? (
              <LoadingSkeleton />
            ) : (
              <div ref={dashboardRef} className="p-3 rounded-2xl bg-[#0b0f19] inline-block w-full">
                {/* Section A: KPI Summary Cards */}
                <KpiCards proposals={proposals} />

                {/* Section C: Key Executive Insights */}
                <ExecutiveInsights proposals={proposals} />

                {/* Section B: Data Visualizations (4 Charts Grid) */}
                <div id="charts-grid-container" className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${showTable ? 'mb-8' : 'mb-0'}`}>
                  <OutcomeChart proposals={filteredProposals} />
                  <RegionChart proposals={filteredProposals} />
                  <CapabilityChart proposals={filteredProposals} />
                  <VelocityChart proposals={filteredProposals} />
                </div>

                {/* Interactive Data Filter Bar (Hidden when table ignored) */}
                <DataFilterBar
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

                {/* Detailed QE Proposals Ledger */}
                <ProposalTable
                  proposals={filteredProposals}
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Backend Configuration Control Panel
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
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
              onSyncNow={loadDataFromSheet}
              isSyncing={isLoadingData}
              lastSyncResult={lastSyncResult}
              onLocalDataImport={handleLocalDataImport}
            />
          </div>
        )}
      </main>
    </div>
  );
}

const DEFAULT_SHEET_URL_INIT = 'https://docs.google.com/spreadsheets/d/1kZZam5HXYYi-DzfFWYaIwmhwdVYa-jdEUgRXaKeCTpk/edit?gid=0#gid=0';

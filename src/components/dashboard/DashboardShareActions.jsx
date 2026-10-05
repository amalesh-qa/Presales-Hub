import React, { useState } from 'react';
import { Camera, Mail, CheckCircle2, Copy, Sparkles, X, Download, AlertCircle, EyeOff, Eye, RefreshCw } from 'lucide-react';
import { toCanvas } from 'html-to-image';

export default function DashboardShareActions({ dashboardRef, showTable, onToggleTable, onRefreshData, isRefreshing }) {
  const [capturing, setCapturing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [dataUrl, setDataUrl] = useState('');
  const [ignoreLedgerInExport, setIgnoreLedgerInExport] = useState(true);

  const captureDashboard = async (forceIgnoreLedger = ignoreLedgerInExport) => {
    if (!dashboardRef?.current) return null;
    setCapturing(true);
    setErrorMessage('');

    try {
      const pixelRatio = 2;
      const options = {
        backgroundColor: '#0b0f19',
        pixelRatio,
        cacheBust: true,
        style: {
          borderRadius: '16px',
          padding: '16px 16px 20px 16px',
          marginBottom: '0',
          height: 'auto'
        },
        filter: (node) => {
          if (node.id === 'toast-banner' || node.classList?.contains('no-capture')) {
            return false;
          }
          if (forceIgnoreLedger) {
            if (node.id === 'proposal-ledger-container' || node.id === 'dashboard-filter-bar') {
              return false;
            }
          }
          return true;
        }
      };

      // 1. Generate full DOM canvas
      const fullCanvas = await toCanvas(dashboardRef.current, options);

      let finalCanvas = fullCanvas;

      // 2. If ignoring ledger, compute exact bottom of #charts-grid-container and crop canvas tightly
      if (forceIgnoreLedger) {
        const chartsNode = dashboardRef.current.querySelector('#charts-grid-container');
        if (chartsNode) {
          const containerRect = dashboardRef.current.getBoundingClientRect();
          const chartsRect = chartsNode.getBoundingClientRect();
          
          // Compute exact content height + padding
          const paddingPx = 20 * pixelRatio;
          const exactContentHeight = Math.round((chartsRect.bottom - containerRect.top) * pixelRatio + paddingPx);
          const targetHeight = Math.min(fullCanvas.height, Math.max(200, exactContentHeight));

          // Create tightly cropped canvas
          const croppedCanvas = document.createElement('canvas');
          croppedCanvas.width = fullCanvas.width;
          croppedCanvas.height = targetHeight;

          const ctx = croppedCanvas.getContext('2d');
          ctx.drawImage(
            fullCanvas,
            0, 0, fullCanvas.width, targetHeight, // Source rect
            0, 0, fullCanvas.width, targetHeight  // Destination rect
          );

          finalCanvas = croppedCanvas;
        }
      }

      // Convert cropped canvas to Blob & Data URL
      const pngUrl = finalCanvas.toDataURL('image/png');
      const blob = await new Promise(resolve => finalCanvas.toBlob(resolve, 'image/png'));

      setCapturing(false);
      return { blob, pngUrl };
    } catch (err) {
      console.error('Failed to capture perfectly trimmed dashboard image:', err);
      setCapturing(false);
      setErrorMessage('Could not render dashboard image. Please try downloading PNG.');
      return null;
    }
  };

  const handleCopyScreenshot = async () => {
    setErrorMessage('');
    const result = await captureDashboard();
    if (!result || !result.blob) {
      setErrorMessage('Failed to capture screenshot. Please try opening Email Dashboard modal.');
      return;
    }

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': result.blob })
        ]);
        showToast('Trimmed Executive Dashboard screenshot copied! Press Ctrl+V inside your email to paste inline.');
      } else {
        setDataUrl(result.pngUrl);
        setShowModal(true);
        showToast('Trimmed Screenshot generated! Click Download PNG or copy from preview.');
      }
    } catch (err) {
      console.warn('Clipboard API blocked by browser permissions:', err);
      setDataUrl(result.pngUrl);
      setShowModal(true);
      showToast('Clipboard permission blocked. Image opened in preview modal below.');
    }
  };

  const handleOpenEmailModal = async () => {
    setErrorMessage('');
    const result = await captureDashboard();
    if (result && result.pngUrl) {
      setDataUrl(result.pngUrl);
      setShowModal(true);
    }
  };

  const handleDownloadPng = async () => {
    const result = await captureDashboard();
    if (result && result.pngUrl) {
      const link = document.createElement('a');
      link.download = `QE_Presales_Executive_Dashboard_${new Date().toISOString().split('T')[0]}.png`;
      link.href = result.pngUrl;
      link.click();
      showToast('Trimmed Executive Dashboard PNG downloaded successfully!');
    }
  };

  const handleToggleLedgerExport = async (e) => {
    const shouldIgnore = e.target.checked;
    setIgnoreLedgerInExport(shouldIgnore);
    
    if (showModal) {
      const result = await captureDashboard(shouldIgnore);
      if (result && result.pngUrl) {
        setDataUrl(result.pngUrl);
      }
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 5000);
  };

  const handleComposeMailto = () => {
    const subject = encodeURIComponent('QE Proposal and Presales Dashboard Executive Briefing');
    const body = encodeURIComponent('Hello Team,\n\nPlease review the executive presales dashboard screenshot below:\n\n[Paste copied dashboard screenshot here - Ctrl+V]\n\nBest regards,');
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {/* Toggle UI table view button */}
        <button
          onClick={onToggleTable}
          title={showTable ? 'Hide Detailed Proposals Ledger table from screen' : 'Show Detailed Proposals Ledger table on screen'}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
            showTable
              ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80'
              : 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
          }`}
        >
          {showTable ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span>Ignore Ledger</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-white" />
              <span>Show Ledger</span>
            </>
          )}
        </button>

        {/* Checkbox to ignore ledger in screenshot */}
        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 cursor-pointer hover:bg-slate-800 transition">
          <input
            type="checkbox"
            checked={ignoreLedgerInExport}
            onChange={handleToggleLedgerExport}
            className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="flex items-center gap-1 text-[11px]">
            <EyeOff className="w-3.5 h-3.5 text-indigo-400" />
            Compact Trimmed Screenshot
          </span>
        </label>

        {/* Copy Screenshot Button */}
        <button
          onClick={handleCopyScreenshot}
          disabled={capturing}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {capturing ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>Copy Screenshot</span>
        </button>

        {/* Download PNG Button */}
        <button
          onClick={handleDownloadPng}
          disabled={capturing}
          title="Download PNG image file to disk"
          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Download PNG</span>
        </button>

        {/* Refresh & Reset Data Button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            disabled={capturing || isRefreshing}
            title="Refresh dataset from Google Sheet and clear local cached filters/data"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh & Reset Data</span>
          </button>
        )}

        {/* Email Dashboard Button */}
        <button
          onClick={handleOpenEmailModal}
          disabled={capturing}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Mail className="w-3.5 h-3.5 text-indigo-400" />
          <span>Email Dashboard</span>
        </button>
      </div>

      {/* Copy Toast Banner */}
      {toastMessage && (
        <div id="toast-banner" className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950/95 border border-emerald-500/40 text-emerald-200 shadow-2xl flex items-center gap-3 animate-slide-up backdrop-blur-md max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold leading-relaxed">{toastMessage}</div>
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-rose-950/95 border border-rose-500/40 text-rose-200 shadow-2xl flex items-center gap-3 animate-slide-up backdrop-blur-md max-w-md">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="text-xs font-semibold leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Email Sharing Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-3xl w-full rounded-2xl p-6 border border-slate-800 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Email Executive Dashboard Image</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-300 leading-relaxed">
                Perfectly trimmed executive briefing image preview:
              </p>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreLedgerInExport}
                  onChange={handleToggleLedgerExport}
                  className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span>Compact Trimmed Screenshot</span>
              </label>
            </div>

            {/* Rendered Preview Image */}
            <div className="border border-slate-700 rounded-xl overflow-hidden max-h-72 overflow-y-auto bg-slate-950 p-3 flex justify-center">
              {dataUrl ? (
                <img src={dataUrl} alt="Executive Dashboard Briefing" className="max-w-full rounded shadow-2xl border border-slate-800" />
              ) : (
                <div className="text-xs text-slate-500 py-8">Rendering perfectly trimmed image preview...</div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyScreenshot}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Trimmed Image</span>
                </button>

                <button
                  onClick={handleDownloadPng}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download PNG</span>
                </button>
              </div>

              <button
                onClick={handleComposeMailto}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Open Email Composer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

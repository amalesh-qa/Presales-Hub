import React from 'react';
import { Table, CheckCircle2, XCircle, Clock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { stripTimestampFromText, formatCleanDate } from '../../services/sheetService';
import { useTheme } from '../../context/ThemeContext';

export default function ProposalTable({ proposals = [], showTable = true, onToggleTable }) {
  const { themeConfig } = useTheme();

  if (!showTable) {
    return (
      <div id="proposal-ledger-container" className="hidden border-0 p-0 m-0 no-capture"></div>
    );
  }

  const getStatusBadge = (status) => {
    const isLight = themeConfig.mode === 'light';
    switch (status) {
      case 'Won':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
            isLight
              ? 'bg-emerald-100 text-emerald-900 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
          }`}>
            <CheckCircle2 className="w-3 h-3" />
            Won
          </span>
        );
      case 'Lost':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
            isLight
              ? 'bg-rose-100 text-rose-900 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}>
            <XCircle className="w-3 h-3" />
            Lost
          </span>
        );
      case 'On Hold':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
            isLight
              ? 'bg-blue-100 text-blue-900 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
              : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
          }`}>
            <AlertCircle className="w-3 h-3" />
            On Hold
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
            isLight
              ? 'bg-amber-100 text-amber-900 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          }`}>
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div id="proposal-ledger-container" className={`${themeConfig.tableContainer} overflow-hidden shadow-xl mb-12 transition-all duration-200`}>
      <div className={`p-5 border-b flex items-center justify-between ${themeConfig.tableRowBorder}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            themeConfig.mode === 'light'
              ? 'bg-blue-100 text-blue-800 border-2 border-slate-900 shadow-[1px_1px_0_0_#0f172a]'
              : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
          }`}>
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-sm ${themeConfig.cardHeader}`}>Detailed QE Proposals Ledger</h3>
            <p className={`text-[11px] ${themeConfig.cardSubtitle}`}>Full list of all proposal records from dataset</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono px-3 py-1 rounded-lg border ${
            themeConfig.mode === 'light'
              ? 'bg-slate-100 text-slate-800 border-2 border-slate-900 font-bold'
              : 'text-slate-400 bg-slate-900 border-slate-800'
          }`}>
            Showing all {proposals.length} proposals
          </span>
          <button
            onClick={onToggleTable}
            title="Ignore/Hide the Detailed QE Proposals Ledger table"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${themeConfig.buttonSecondary}`}
          >
            <EyeOff className="w-3.5 h-3.5 opacity-70" />
            <span>Ignore Ledger</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`text-[11px] font-bold uppercase tracking-wider ${themeConfig.tableHeaderRow}`}>
              <th className="py-3.5 px-4">Opportunity & Client</th>
              <th className="py-3.5 px-4">Region</th>
              <th className="py-3.5 px-4">QE Capability Scope</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Contract Value</th>
              <th className="py-3.5 px-4">Submission Date</th>
              <th className="py-3.5 px-4">Win/Loss Reason</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs ${themeConfig.tableRowBorder}`}>
            {proposals.length === 0 ? (
              <tr>
                <td colSpan={7} className={`py-8 text-center text-xs ${themeConfig.textMuted}`}>
                  No proposals found matching the filter criteria.
                </td>
              </tr>
            ) : (
              proposals.map((prop) => {
                const oppTitle = stripTimestampFromText(prop.opportunityName) || prop.opportunityName;
                const clientTitle = stripTimestampFromText(prop.clientName) || prop.clientName;
                const cleanDateStr = formatCleanDate(prop.submissionDate);

                return (
                  <tr key={prop.id} className={`${themeConfig.tableRowHover} transition-colors duration-150`}>
                    <td className="py-4 px-4">
                      <div className={`font-bold ${themeConfig.tableTextPrimary}`}>{oppTitle}</div>
                      <div className={`text-[11px] font-medium mt-0.5 ${themeConfig.tableTextSecondary}`}>{clientTitle}</div>
                    </td>
                    <td className={`py-4 px-4 font-semibold ${themeConfig.textSecondary}`}>
                      {prop.region}
                    </td>
                    <td className="py-4 px-4 font-medium">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] ${themeConfig.tableBadgeScope}`}>
                        {prop.qeScope}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(prop.status)}
                    </td>
                    <td className={`py-4 px-4 text-right font-mono font-bold ${themeConfig.textPrimary}`}>
                      ${(prop.contractValue || 0).toLocaleString()}
                    </td>
                    <td className={`py-4 px-4 font-mono text-[11px] ${themeConfig.textMuted}`}>
                      {cleanDateStr}
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className={`text-[11px] leading-relaxed ${themeConfig.textSecondary}`} title={prop.winLossReason}>
                        {prop.winLossReason || 'N/A'}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

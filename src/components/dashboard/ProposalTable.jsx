import React from 'react';
import { Table, CheckCircle2, XCircle, Clock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { stripTimestampFromText, formatCleanDate, reorderNameAndDate } from '../../services/sheetService';

export default function ProposalTable({ proposals = [], showTable = true, onToggleTable }) {
  if (!showTable) {
    return (
      <div id="proposal-ledger-container" className="hidden border-0 p-0 m-0 no-capture"></div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Won':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Won
          </span>
        );
      case 'Lost':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            Lost
          </span>
        );
      case 'On Hold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <AlertCircle className="w-3 h-3" />
            On Hold
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div id="proposal-ledger-container" className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl mb-12">
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Detailed QE Proposals Ledger</h3>
            <p className="text-[11px] text-slate-400 font-medium">Full list of all proposal records from dataset</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            Showing all {proposals.length} proposals
          </span>
          <button
            onClick={onToggleTable}
            title="Ignore/Hide the Detailed QE Proposals Ledger table"
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            <span>Ignore Ledger</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Opportunity & Client</th>
              <th className="py-3.5 px-4">Region</th>
              <th className="py-3.5 px-4">QE Capability Scope</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Contract Value</th>
              <th className="py-3.5 px-4">Submission Date</th>
              <th className="py-3.5 px-4">Win/Loss Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {proposals.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                  No proposals found matching the filter criteria.
                </td>
              </tr>
            ) : (
              proposals.map((prop) => {
                const oppTitle = stripTimestampFromText(prop.opportunityName) || prop.opportunityName;
                const clientTitle = stripTimestampFromText(prop.clientName) || prop.clientName;
                const cleanDateStr = formatCleanDate(prop.submissionDate);

                return (
                  <tr key={prop.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-100">{oppTitle}</div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">{clientTitle}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-300">
                      {prop.region}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-300">
                      <span className="bg-slate-800/80 text-indigo-300 px-2.5 py-1 rounded-md border border-slate-700 text-[11px]">
                        {prop.qeScope}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(prop.status)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-200">
                      ${(prop.contractValue || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                      {cleanDateStr}
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="text-slate-300 text-[11px] leading-relaxed" title={prop.winLossReason}>
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

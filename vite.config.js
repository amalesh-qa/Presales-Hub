import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Default proposal records for live dev testing and demonstration
const INITIAL_TEST_PROPOSALS = [
  {
    id: 'prop-101',
    opportunityName: 'Fintech Core Banking QE Automation',
    clientName: 'Apex Capital Group',
    region: 'North America',
    qeScope: 'Automation Testing',
    status: 'Won',
    contractValue: 350000,
    submissionDate: '2026-07-12',
    winLossReason: 'Superior Playwright/Cypress automation framework architecture shown in live POC with impressive 85% regression coverage reduction.'
  },
  {
    id: 'prop-102',
    opportunityName: 'OmniHealth Mobile App Quality Assurance',
    clientName: 'OmniHealth Care',
    region: 'North America',
    qeScope: 'Full QA Outsourcing',
    status: 'Won',
    contractValue: 520000,
    submissionDate: '2026-07-28',
    winLossReason: 'Strong HIPAA compliance expertise, integrated crowd-testing network, and past healthcare domain references.'
  },
  {
    id: 'prop-103',
    opportunityName: 'Global Retail Black Friday Performance QE',
    clientName: 'ShopSphere Global',
    region: 'EMEA',
    qeScope: 'Performance QE',
    status: 'Won',
    contractValue: 280000,
    submissionDate: '2026-08-04',
    winLossReason: 'Proven JMeter/k6 load testing strategy simulating 1.5 million concurrent user spikes during peak events.'
  },
  {
    id: 'prop-104',
    opportunityName: 'Automotive Embedded Systems QA',
    clientName: 'DriveTech Solutions',
    region: 'EMEA',
    qeScope: 'Security & Pen Testing',
    status: 'Lost',
    contractValue: 410000,
    submissionDate: '2026-08-18',
    winLossReason: 'Competitor offered a lower rate structure and already had ISO 26262 certified staff on site.'
  },
  {
    id: 'prop-105',
    opportunityName: 'AI-Driven Predictive Maintenance QE',
    clientName: 'Industrial IoT Corp',
    region: 'APAC',
    qeScope: 'AI / ML Testing',
    status: 'Won',
    contractValue: 310000,
    submissionDate: '2026-06-15',
    winLossReason: 'Innovative model validation techniques, synthetic data generation capability, and strong AI engineering team.'
  },
  {
    id: 'prop-106',
    opportunityName: 'Cloud Native Microservices DevSecOps',
    clientName: 'Skyline Cloud Systems',
    region: 'APAC',
    qeScope: 'Cloud QE & DevSecOps',
    status: 'Won',
    contractValue: 480000,
    submissionDate: '2026-06-29',
    winLossReason: 'Seamless integration of SonarQube and OWASP ZAP into GitHub Actions CI/CD pipeline demonstrated during presentation.'
  },
  {
    id: 'prop-107',
    opportunityName: 'Logistics Freight Tracking QE Overhaul',
    clientName: 'Pacific TransLogistics',
    region: 'APAC',
    qeScope: 'Automation Testing',
    status: 'Pending',
    contractValue: 195000,
    submissionDate: '2026-09-02',
    winLossReason: 'Proposal under executive evaluation; shortlist confirmation expected by end of month.'
  },
  {
    id: 'prop-108',
    opportunityName: 'Neobank Payment Gateway Security Audit',
    clientName: 'PayPulse Technologies',
    region: 'LATAM',
    qeScope: 'Security & Pen Testing',
    status: 'Won',
    contractValue: 230000,
    submissionDate: '2026-07-19',
    winLossReason: 'Comprehensive CREST-aligned penetration testing methodology and rapid vulnerability triage SLA.'
  },
  {
    id: 'prop-109',
    opportunityName: 'Telecom BSS/OSS Cloud Transformation QE',
    clientName: 'TelcoMax Global',
    region: 'EMEA',
    qeScope: 'Full QA Outsourcing',
    status: 'Lost',
    contractValue: 750000,
    submissionDate: '2026-05-11',
    winLossReason: 'Client delayed digital transformation initiative due to internal restructuring and budget freeze.'
  },
  {
    id: 'prop-110',
    opportunityName: 'E-Commerce Mobile App Performance Testing',
    clientName: 'Mercado Express',
    region: 'LATAM',
    qeScope: 'Performance QE',
    status: 'Pending',
    contractValue: 160000,
    submissionDate: '2026-09-10',
    winLossReason: 'Client reviewing technical architecture proposals and commercial terms.'
  },
  {
    id: 'prop-111',
    opportunityName: 'SaaS Multi-Tenant Automation Suite',
    clientName: 'CloudWorkplace Inc',
    region: 'North America',
    qeScope: 'Automation Testing',
    status: 'Won',
    contractValue: 390000,
    submissionDate: '2026-08-25',
    winLossReason: 'Outstanding automated cross-browser test matrix and visual regression testing capabilities.'
  },
  {
    id: 'prop-112',
    opportunityName: 'Healthcare Tele-Consultation Accessibility QA',
    clientName: 'MediConnect Health',
    region: 'North America',
    qeScope: 'Accessibility Testing',
    status: 'Pending',
    contractValue: 175000,
    submissionDate: '2026-09-15',
    winLossReason: 'Technical qualification meeting completed; pending final commercial negotiation and statement of work.'
  }
];

function liveSheetDevPlugin() {
  let liveProposals = JSON.parse(JSON.stringify(INITIAL_TEST_PROPOSALS));

  function generateCsv(rows) {
    const headers = [
      'Opportunity Name',
      'Client Name',
      'Geographic Region',
      'QE Capability Scope',
      'Status',
      'QE Estimated Deal Value ($)',
      'Submission Date',
      'Win/Loss Reason'
    ];
    const csvLines = [headers.map(h => `"${h}"`).join(',')];
    for (const r of rows) {
      csvLines.push([
        `"${(r.opportunityName || '').replace(/"/g, '""')}"`,
        `"${(r.clientName || '').replace(/"/g, '""')}"`,
        `"${(r.region || '').replace(/"/g, '""')}"`,
        `"${(r.qeScope || '').replace(/"/g, '""')}"`,
        `"${(r.status || '').replace(/"/g, '""')}"`,
        `"${r.contractValue ?? 0}"`,
        `"${(r.submissionDate || '').replace(/"/g, '""')}"`,
        `"${(r.winLossReason || '').replace(/"/g, '""')}"`
      ].join(','));
    }
    return csvLines.join('\n');
  }

  return {
    name: 'live-sheet-dev-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlObj = new URL(req.url, 'http://localhost');
        const pathname = urlObj.pathname;

        // 1. Live Test Sheet CSV & Data Endpoints
        if (pathname.startsWith('/api/live-test-sheet')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            return res.end();
          }

          // Return CSV endpoint (mimics Google Sheets export & gviz/tq)
          if (
            pathname.includes('/export') ||
            pathname.includes('/gviz/tq') ||
            pathname.endsWith('/csv') ||
            urlObj.searchParams.get('format') === 'csv' ||
            urlObj.searchParams.get('tqx') === 'out:csv'
          ) {
            const csvData = generateCsv(liveProposals);
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.statusCode = 200;
            return res.end(csvData);
          }

          // Edit Cell Endpoint
          if (pathname === '/api/live-test-sheet/edit-cell' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { id, field, value } = JSON.parse(body || '{}');
                const target = liveProposals.find(p => p.id === id);
                if (!target) {
                  res.statusCode = 404;
                  return res.end(JSON.stringify({ error: `Proposal ${id} not found` }));
                }
                target[field] = value;
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, updated: target, total: liveProposals.length }));
              } catch (e) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: e.message }));
              }
            });
            return;
          }

          // Add Row Endpoint
          if (pathname === '/api/live-test-sheet/add-row' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const newRow = JSON.parse(body || '{}');
                const nextId = `prop-live-${Date.now()}`;
                const proposal = {
                  id: nextId,
                  opportunityName: newRow.opportunityName || `New QE Proposal ${liveProposals.length + 1}`,
                  clientName: newRow.clientName || 'Global Enterprise',
                  region: newRow.region || 'North America',
                  qeScope: newRow.qeScope || 'Automation Testing',
                  status: newRow.status || 'Pending',
                  contractValue: Number(newRow.contractValue) || 250000,
                  submissionDate: newRow.submissionDate || new Date().toISOString().split('T')[0],
                  winLossReason: newRow.winLossReason || 'New active presales opportunity added live.'
                };
                liveProposals.unshift(proposal);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 201;
                return res.end(JSON.stringify({ success: true, added: proposal, total: liveProposals.length }));
              } catch (e) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: e.message }));
              }
            });
            return;
          }

          // Delete Row Endpoint
          if (pathname === '/api/live-test-sheet/delete-row' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { id } = JSON.parse(body || '{}');
                const initialLen = liveProposals.length;
                if (id) {
                  liveProposals = liveProposals.filter(p => p.id !== id);
                } else if (liveProposals.length > 0) {
                  liveProposals.pop(); // remove last row
                }
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, removedCount: initialLen - liveProposals.length, total: liveProposals.length }));
              } catch (e) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: e.message }));
              }
            });
            return;
          }

          // Reset Endpoint
          if (pathname === '/api/live-test-sheet/reset' && req.method === 'POST') {
            liveProposals = JSON.parse(JSON.stringify(INITIAL_TEST_PROPOSALS));
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, total: liveProposals.length }));
          }

          // Default JSON info
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify({
            status: 'online',
            description: 'Live Test Google Spreadsheet Simulator',
            recordCount: liveProposals.length,
            csvUrl: '/api/live-test-sheet/export?format=csv',
            sample: liveProposals.slice(0, 2)
          }));
        }

        // 2. CORS Proxy Endpoint for Remote Sheets
        if (pathname === '/api/sheet-proxy') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          const targetUrl = urlObj.searchParams.get('url');
          if (!targetUrl) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Missing target url query parameter' }));
          }

          fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          })
            .then(async remoteRes => {
              res.statusCode = remoteRes.status;
              const contentType = remoteRes.headers.get('content-type') || 'text/plain';
              res.setHeader('Content-Type', contentType);
              const text = await remoteRes.text();
              res.end(text);
            })
            .catch(err => {
              res.statusCode = 502;
              res.end(JSON.stringify({ error: `Proxy fetch failed: ${err.message}` }));
            });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss(),
    liveSheetDevPlugin()
  ],
});

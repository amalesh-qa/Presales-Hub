// Key Executive Insights Calculator & AI Win/Loss Summarizer

export function calculateExecutiveInsights(proposals) {
  if (!proposals || proposals.length === 0) {
    return {
      quarterlyWins: 0,
      quarterlyLosses: 0,
      highestDemandScope: 'N/A',
      highestOpportunityRegion: 'N/A',
      aiSummary: 'No proposal data available for AI analysis.'
    };
  }

  // 1. Quarterly Wins & Losses (Latest quarter e.g. Q3 2026 or most recent quarter in dataset)
  // Determine recent quarter from submission dates
  const sortedDates = [...proposals]
    .map(p => new Date(p.submissionDate))
    .filter(d => !isNaN(d))
    .sort((a, b) => b - a);

  let latestYear = 2026;
  let latestQuarterMonthRange = [6, 8]; // July-Sept (Q3)

  if (sortedDates.length > 0) {
    const latestDate = sortedDates[0];
    latestYear = latestDate.getFullYear();
    const month = latestDate.getMonth(); // 0-indexed
    const qIndex = Math.floor(month / 3);
    latestQuarterMonthRange = [qIndex * 3, qIndex * 3 + 2];
  }

  const latestQuarterProposals = proposals.filter(p => {
    const d = new Date(p.submissionDate);
    if (isNaN(d)) return false;
    return d.getFullYear() === latestYear && d.getMonth() >= latestQuarterMonthRange[0] && d.getMonth() <= latestQuarterMonthRange[1];
  });

  const quarterlyWins = latestQuarterProposals.filter(p => p.status === 'Won').length;
  const quarterlyLosses = latestQuarterProposals.filter(p => p.status === 'Lost').length;

  // 2. Highest Demand QE Scope
  const scopeCounts = {};
  proposals.forEach(p => {
    if (p.qeScope) {
      scopeCounts[p.qeScope] = (scopeCounts[p.qeScope] || 0) + 1;
    }
  });

  let maxScopeCount = 0;
  let highestDemandScope = 'N/A';
  Object.entries(scopeCounts).forEach(([scope, count]) => {
    if (count > maxScopeCount) {
      maxScopeCount = count;
      highestDemandScope = `${scope} (${count} proposals)`;
    }
  });

  // 3. Highest Opportunity Region (with TIE HANDLING)
  const regionCounts = {};
  proposals.forEach(p => {
    if (p.region) {
      regionCounts[p.region] = (regionCounts[p.region] || 0) + 1;
    }
  });

  let maxRegionCount = 0;
  Object.values(regionCounts).forEach(count => {
    if (count > maxRegionCount) maxRegionCount = count;
  });

  const tiedRegions = Object.entries(regionCounts)
    .filter(([_, count]) => count === maxRegionCount)
    .map(([region]) => region);

  const highestOpportunityRegion = tiedRegions.length > 1
    ? `${tiedRegions.join(', ')} (${maxRegionCount} proposals each)`
    : `${tiedRegions[0]} (${maxRegionCount} proposals)`;

  // 4. AI Win/Loss Analysis Synthesis
  const wonReasons = proposals
    .filter(p => p.status === 'Won' && p.winLossReason)
    .map(p => p.winLossReason);

  const lostReasons = proposals
    .filter(p => p.status === 'Lost' && p.winLossReason)
    .map(p => p.winLossReason);

  const aiSummary = generateAiSummary(wonReasons, lostReasons);

  return {
    quarterlyWins,
    quarterlyLosses,
    highestDemandScope,
    highestOpportunityRegion,
    aiSummary
  };
}

export function generateAiSummary(wonReasons, lostReasons) {
  if (wonReasons.length === 0 && lostReasons.length === 0) {
    return "AI Insight: Insufficient feedback data recorded to generate win/loss themes.";
  }

  // Common win keywords
  const winKeywords = [];
  const winText = wonReasons.join(' ').toLowerCase();
  if (winText.includes('poc') || winText.includes('demo') || winText.includes('presentation')) winKeywords.push('hands-on POC execution');
  if (winText.includes('automation') || winText.includes('framework') || winText.includes('playwright') || winText.includes('cypress')) winKeywords.push('robust test automation frameworks');
  if (winText.includes('compliance') || winText.includes('security') || winText.includes('hipaa') || winText.includes('crest')) winKeywords.push('deep domain & compliance standards');
  if (winText.includes('performance') || winText.includes('load') || winText.includes('k6') || winText.includes('jmeter')) winKeywords.push('proven high-concurrency load testing');
  if (winText.includes('ai') || winText.includes('model') || winText.includes('synthetic')) winKeywords.push('innovative AI model validation techniques');

  // Common loss keywords
  const lossKeywords = [];
  const lossText = lostReasons.join(' ').toLowerCase();
  if (lossText.includes('price') || lossText.includes('cost') || lossText.includes('rate') || lossText.includes('budget')) lossKeywords.push('aggressive competitor pricing');
  if (lossText.includes('delay') || lossText.includes('freeze') || lossText.includes('restructur')) lossKeywords.push('client internal budget freezes');
  if (lossText.includes('incumbent') || lossText.includes('existing')) lossKeywords.push('incumbent vendor preference');
  if (lossText.includes('certif') || lossText.includes('local') || lossText.includes('procure')) lossKeywords.push('specialized regional accreditation requirements');

  const winTheme = winKeywords.length > 0 ? winKeywords.slice(0, 2).join(' and ') : 'technical POC excellence';
  const lossTheme = lossKeywords.length > 0 ? lossKeywords.slice(0, 2).join(' and ') : 'commercial pricing pressure';

  return `AI Insight: Wins are driven primarily by ${winTheme}, while losses stem mainly from ${lossTheme}.`;
}

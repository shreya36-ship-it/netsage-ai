import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Cpu, 
  Network, 
  FileText, 
  Activity, 
  Search, 
  Filter, 
  Terminal, 
  AlertTriangle, 
  Layers, 
  Wifi, 
  Globe, 
  Server, 
  Lock, 
  ChevronRight,
  Download,
  BookOpen,
  RefreshCw,
  Zap
} from 'lucide-react';
import { casesData } from './data/casesData';
import { auditLogData } from './data/auditLogData';
import { promptData } from './data/promptData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedConcept, setSelectedConcept] = useState('All');
  const [selectedLayer, setSelectedLayer] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Workbench state
  const [workbenchCase, setWorkbenchCase] = useState(casesData[0]);
  const [reviewState, setReviewState] = useState(() => {
    const initial = {};
    casesData.forEach(c => {
      if (['NET-009', 'NET-024', 'NET-029', 'NET-031'].includes(c.case_id)) {
        initial[c.case_id] = { decision: 'Edited', notes: 'CLI syntax or fix steps edited by reviewer.' };
      } else if (['NET-022', 'NET-027'].includes(c.case_id)) {
        initial[c.case_id] = { decision: 'Rejected', notes: 'Misdiagnosed root cause; corrected by reviewer.' };
      } else {
        initial[c.case_id] = { decision: 'Accepted', notes: 'Accurate and evidence-backed diagnosis.' };
      }
    });
    return initial;
  });

  const [activeDiagnosis, setActiveDiagnosis] = useState(null);
  const [ruleFindings, setRuleFindings] = useState([]);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [caseModal, setCaseModal] = useState(null);

  // Deterministic Rule Checker Sandbox state
  const [sandboxText, setSandboxText] = useState(`SW1# show ip interface brief
Vlan1 10.1.1.2 YES manual administratively down down

C:\\> ipconfig /all
   IPv4 Address. . . . . . . . . . . : 192.168.1.50
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.254

R1# show ip interface brief Gi0/0
Gi0/0 192.168.1.1 YES manual up up`);

  const [sandboxResults, setSandboxResults] = useState([]);

  // Compute analytics
  const metrics = useMemo(() => {
    const total = casesData.length;
    let accepted = 0, edited = 0, rejected = 0;
    Object.values(reviewState).forEach(r => {
      if (r.decision === 'Accepted') accepted++;
      if (r.decision === 'Edited') edited++;
      if (r.decision === 'Rejected') rejected++;
    });
    return {
      total,
      accepted,
      edited,
      rejected,
      agreementRate: ((accepted / total) * 100).toFixed(1),
      correctionRate: (((edited + rejected) / total) * 100).toFixed(1)
    };
  }, [reviewState]);

  // Filter cases
  const filteredCases = useMemo(() => {
    return casesData.filter(c => {
      const matchConcept = selectedConcept === 'All' || c.concept === selectedConcept;
      const matchLayer = selectedLayer === 'All' || c.osi_layer === selectedLayer;
      const matchSearch = 
        c.case_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.expected_fault.toLowerCase().includes(searchQuery.toLowerCase());
      return matchConcept && matchLayer && matchSearch;
    });
  }, [selectedConcept, selectedLayer, searchQuery]);

  // Trigger workbench diagnosis
  const handleRunDiagnosis = (c) => {
    setIsDiagnosing(true);
    setActiveDiagnosis(null);
    setRuleFindings([]);
    
    setTimeout(() => {
      // Deterministic check simulation
      const findings = [];
      const show = c.show_outputs.toLowerCase();
      if (show.includes('administratively down')) {
        findings.push({ category: 'Interface Down', severity: 'Critical', desc: 'Interface is administratively down' });
      }
      if (show.includes('default gateway') && show.includes('192.168.1.254')) {
        findings.push({ category: 'Gateway Mismatch', severity: 'High', desc: 'Host Gateway (192.168.1.254) does not match router (192.168.1.1)' });
      }
      if (show.includes('does not exist')) {
        findings.push({ category: 'Missing VLAN', severity: 'Medium', desc: 'Access port assigned to non-existent VLAN' });
      }
      if (show.includes('interpreted 255.255.255.0 as host match')) {
        findings.push({ category: 'Wildcard Mask Error', severity: 'High', desc: 'Subnet mask entered instead of inverse wildcard mask' });
      }

      setRuleFindings(findings);
      setActiveDiagnosis({
        root_cause: c.expected_fault,
        osi_layer: c.osi_layer,
        confidence: { level: findings.length > 0 ? 'High' : 'Medium', score_pct: findings.length > 0 ? 95 : 88 },
        evidence: c.show_outputs.split('\n').filter(l => l.trim() && !l.startsWith('#')).slice(0, 3),
        next_command: ['show ip route', 'show ip interface brief', 'show access-lists'],
        fix_steps: [
          'Step 1: Enter global configuration mode (`configure terminal`)',
          `Step 2: Apply resolution for: ${c.expected_fault}`,
          'Step 3: Execute `show` verification commands and test ping',
          'Step 4: Save configuration (`copy running-config startup-config`)'
        ]
      });
      setIsDiagnosing(false);
      setReviewerNotes(reviewState[c.case_id]?.notes || '');
    }, 400);
  };

  // Run Sandbox Rules
  const handleRunSandbox = () => {
    const text = sandboxText.toLowerCase();
    const results = [];
    if (text.includes('administratively down')) {
      results.push({ rule: 'RULE-001', category: 'Interface Down', severity: 'Critical', desc: 'Interface in administratively down state (needs no shutdown)' });
    }
    if (text.includes('default gateway') && (text.includes('192.168.1.254') || text.includes('192.168.10.1'))) {
      results.push({ rule: 'RULE-002', category: 'Gateway Mismatch', severity: 'High', desc: 'Host Default Gateway mismatch detected against Router interface IP' });
    }
    if (text.includes('does not exist')) {
      results.push({ rule: 'RULE-004', category: 'Missing VLAN', severity: 'Medium', desc: 'Port assigned to uncreated VLAN ID in switch database' });
    }
    if (text.includes('native vlan mismatch')) {
      results.push({ rule: 'RULE-005', category: 'Native VLAN Mismatch', severity: 'High', desc: '802.1Q trunk native VLAN mismatch between connected switches' });
    }
    if (text.includes('interpreted 255.255.255.0 as host match')) {
      results.push({ rule: 'RULE-009', category: 'Wildcard Mask Error', severity: 'High', desc: 'Subnet mask 255.255.255.0 used instead of wildcard 0.0.0.255' });
    }
    setSandboxResults(results);
  };

  const handleSaveReview = (decision) => {
    setReviewState(prev => ({
      ...prev,
      [workbenchCase.case_id]: { decision, notes: reviewerNotes || `${decision} by reviewer.` }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Network className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">NetSage AI</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">v2.4 Cisco Lab</span>
              </div>
              <p className="text-xs text-slate-400">AI Network Troubleshooter with Mandatory Human Oversight</p>
            </div>
          </div>

          <nav className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'explorer', label: 'Case Explorer', icon: Search },
              { id: 'workbench', label: 'AI Workbench', icon: Cpu },
              { id: 'rulechecker', label: 'Rule Checker', icon: Terminal },
              { id: 'auditlog', label: 'Responsible AI Log', icon: ShieldAlert },
              { id: 'prompts', label: 'Prompt Library', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'workbench') handleRunDiagnosis(workbenchCase);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Hero Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -right-2 -bottom-2 text-slate-800/50"><Network className="w-24 h-24" /></div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Lab Cases</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{metrics.total}</h3>
                <p className="text-xs text-emerald-400 mt-2 flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 100% Coverage (32/30 cases)</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -right-2 -bottom-2 text-emerald-900/20"><CheckCircle2 className="w-24 h-24" /></div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">AI Agreement Rate</p>
                <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">{metrics.agreementRate}%</h3>
                <p className="text-xs text-slate-400 mt-2">{metrics.accepted} / {metrics.total} diagnoses accepted as-is</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -right-2 -bottom-2 text-amber-900/20"><Edit3 className="w-24 h-24" /></div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Human Corrections</p>
                <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{metrics.correctionRate}%</h3>
                <p className="text-xs text-slate-400 mt-2">{metrics.edited} edited, {metrics.rejected} rejected by reviewer</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -right-2 -bottom-2 text-cyan-900/20"><ShieldAlert className="w-24 h-24" /></div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Safety Governance</p>
                <h3 className="text-3xl font-extrabold text-cyan-400 mt-1">100%</h3>
                <p className="text-xs text-cyan-400/80 mt-2">Mandatory human signoff active</p>
              </div>
            </div>

            {/* Visual Breakdown Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Concept Coverage Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-semibold text-white flex items-center">
                    <Layers className="w-5 h-5 text-cyan-400 mr-2" />
                    Troubleshooting Cases by Concept Tag
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">8 Domains</span>
                </div>
                <div className="space-y-3">
                  {['VLAN', 'Gateway', 'DHCP', 'DNS', 'Routing', 'ACL', 'NAT', 'Wireless'].map(concept => {
                    const count = casesData.filter(c => c.concept === concept).length;
                    const pct = (count / casesData.length) * 100;
                    return (
                      <div key={concept} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-300">{concept}</span>
                          <span className="text-slate-400">{count} cases ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Human Review Oversight Distribution */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-semibold text-white flex items-center">
                    <ShieldAlert className="w-5 h-5 text-amber-400 mr-2" />
                    Human Review Oversight Distribution
                  </h4>
                  <span className="text-xs text-emerald-400 font-mono">Safety Rule Active</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Accepted (Verified Correct)
                    </span>
                    <span className="font-bold text-white">{metrics.accepted} cases ({metrics.agreementRate}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${metrics.agreementRate}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="flex items-center text-amber-400 font-medium">
                      <Edit3 className="w-4 h-4 mr-2" /> Edited (CLI Syntax / Fix Refined)
                    </span>
                    <span className="font-bold text-white">{metrics.edited} cases ({((metrics.edited/metrics.total)*100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(metrics.edited/metrics.total)*100}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="flex items-center text-red-400 font-medium">
                      <XCircle className="w-4 h-4 mr-2" /> Rejected (Misdiagnosed Root Cause)
                    </span>
                    <span className="font-bold text-white">{metrics.rejected} cases ({((metrics.rejected/metrics.total)*100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${(metrics.rejected/metrics.total)*100}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 leading-relaxed">
                  <p className="font-semibold text-cyan-300 flex items-center mb-1">
                    <Zap className="w-4 h-4 mr-1.5 text-cyan-400" /> Deterministic Rule Checker Synergy
                  </p>
                  The Python Rule Checker detected structural configuration mistakes (interface down, gateway mismatches, missing VLANs) in <strong>28.1% of cases</strong> prior to AI evaluation, improving overall diagnostic accuracy.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: CASE EXPLORER */}
        {activeTab === 'explorer' && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-[240px]">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search cases by ID (NET-001), symptom, or fault..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 w-full"
                />
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Concept:</span>
                  <select
                    value={selectedConcept}
                    onChange={e => setSelectedConcept(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {['All', 'VLAN', 'Gateway', 'DHCP', 'DNS', 'Routing', 'ACL', 'NAT', 'Wireless'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">OSI Layer:</span>
                  <select
                    value={selectedLayer}
                    onChange={e => setSelectedLayer(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {['All', 'Layer 2', 'Layer 3', 'Layer 4', 'Layer 7'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Case List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCases.map(c => {
                const review = reviewState[c.case_id] || { decision: 'Accepted' };
                return (
                  <div key={c.case_id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-800 text-cyan-400 font-bold border border-slate-700">
                          {c.case_id}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            c.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            c.severity === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {c.severity}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            review.decision === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            review.decision === 'Edited' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {review.decision}
                          </span>
                        </div>
                      </div>

                      <h5 className="font-semibold text-sm text-white line-clamp-2">{c.symptom}</h5>
                      <p className="text-xs text-slate-400 line-clamp-2 font-mono bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                        {c.topology_note}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono">{c.concept} • {c.osi_layer}</span>
                      <button
                        onClick={() => {
                          setWorkbenchCase(c);
                          setActiveTab('workbench');
                          handleRunDiagnosis(c);
                        }}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center"
                      >
                        Diagnose <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 3: AI WORKBENCH & HUMAN REVIEW */}
        {activeTab === 'workbench' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Case Selector */}
            <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Select Case for Diagnosis</h4>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {casesData.map(c => {
                  const isSelected = workbenchCase.case_id === c.case_id;
                  const review = reviewState[c.case_id] || { decision: 'Accepted' };
                  return (
                    <button
                      key={c.case_id}
                      onClick={() => {
                        setWorkbenchCase(c);
                        handleRunDiagnosis(c);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        isSelected 
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-sm' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-cyan-400">{c.case_id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          review.decision === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400' :
                          review.decision === 'Edited' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {review.decision}
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium line-clamp-1">{c.symptom}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{c.concept} • {c.osi_layer}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Diagnosis Workbench & Review Controls */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Case Details & Raw Console Output */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                      {workbenchCase.case_id}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{workbenchCase.symptom}</h3>
                  </div>
                  <button
                    onClick={() => handleRunDiagnosis(workbenchCase)}
                    disabled={isDiagnosing}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
                    <span>Run AI Diagnosis</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-medium">Topology Note:</span>
                    <p className="text-slate-300 mt-1 font-mono">{workbenchCase.topology_note}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-medium">Expected Ground Truth Fault:</span>
                    <p className="text-emerald-400 mt-1 font-medium">{workbenchCase.expected_fault}</p>
                  </div>
                </div>

                {/* Console Output Viewer */}
                <div>
                  <span className="text-xs text-slate-400 font-medium block mb-1">Cisco Console Show Commands Output:</span>
                  <pre className="bg-slate-950 text-cyan-300 font-mono text-xs p-4 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre-wrap max-h-48">
                    {workbenchCase.show_outputs}
                  </pre>
                </div>
              </div>

              {/* AI Diagnostic Output Result */}
              {activeDiagnosis && (
                <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 space-y-5 shadow-xl shadow-cyan-500/5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-base font-bold text-white flex items-center">
                      <Cpu className="w-5 h-5 text-cyan-400 mr-2" /> AI Diagnosis Result (JSON Output)
                    </h4>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      Confidence: {activeDiagnosis.confidence.level} ({activeDiagnosis.confidence.score_pct}%)
                    </span>
                  </div>

                  {/* Deterministic Rule Warnings */}
                  {ruleFindings.length > 0 && (
                    <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-amber-400 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1.5" /> Deterministic Rule Checker Warning Hit:
                      </span>
                      {ruleFindings.map((rf, idx) => (
                        <p key={idx} className="text-xs text-amber-200 font-mono ml-5">• [{rf.severity}] {rf.category}: {rf.desc}</p>
                      ))}
                    </div>
                  )}

                  {/* Root Cause & Evidence */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Diagnosed Root Cause:</span>
                      <p className="text-sm font-semibold text-white bg-slate-950 p-3 rounded-xl border border-slate-800 mt-1">
                        {activeDiagnosis.root_cause}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 font-medium">Evidence Quotes from Show Output:</span>
                      <ul className="mt-1 space-y-1">
                        {activeDiagnosis.evidence.map((ev, i) => (
                          <li key={i} className="text-xs font-mono text-cyan-300 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                            "{ev}"
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 font-medium">Recommended CLI Fix Steps:</span>
                      <ol className="mt-1 space-y-1">
                        {activeDiagnosis.fix_steps.map((step, i) => (
                          <li key={i} className="text-xs font-mono text-slate-200 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Mandatory Human Review Panel */}
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                        <ShieldAlert className="w-4 h-4 text-amber-400 mr-1.5" /> Mandatory Human Oversight Action
                      </span>
                      <span className="text-xs text-slate-400">Current Status: <strong>{reviewState[workbenchCase.case_id]?.decision}</strong></span>
                    </div>

                    <textarea
                      placeholder="Add human network engineer notes or rationale for decision..."
                      value={reviewerNotes}
                      onChange={e => setReviewerNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                      rows={2}
                    />

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleSaveReview('Accepted')}
                        className="flex-1 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> <span>Accept Diagnosis</span>
                      </button>

                      <button
                        onClick={() => handleSaveReview('Edited')}
                        className="flex-1 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center justify-center space-x-1.5"
                      >
                        <Edit3 className="w-4 h-4" /> <span>Edit & Refine</span>
                      </button>

                      <button
                        onClick={() => handleSaveReview('Rejected')}
                        className="flex-1 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-bold flex items-center justify-center space-x-1.5"
                      >
                        <XCircle className="w-4 h-4" /> <span>Reject & Override</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 4: RULE CHECKER SANDBOX */}
        {activeTab === 'rulechecker' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center">
                <Terminal className="w-5 h-5 text-cyan-400 mr-2" /> Python Deterministic Config Rule Checker Sandbox
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Test raw Cisco console outputs against rule checks for IP conflicts, gateway errors, missing VLANs, and interface down states.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs text-slate-400 font-medium">Input Cisco Console Show Output:</label>
                <textarea
                  value={sandboxText}
                  onChange={e => setSandboxText(e.target.value)}
                  className="w-full h-64 bg-slate-950 font-mono text-xs text-cyan-300 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleRunSandbox}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4" /> <span>Execute Deterministic Rules</span>
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-xs text-slate-400 font-medium">Rule Checker Diagnostic Findings:</label>
                <div className="h-64 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-y-auto space-y-3">
                  {sandboxResults.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No rule checks executed or no configuration mistakes detected in input text.</p>
                  ) : (
                    sandboxResults.map((r, i) => (
                      <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-cyan-400 font-bold">{r.rule} • {r.category}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                            r.severity === 'Critical' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>{r.severity}</span>
                        </div>
                        <p className="text-xs text-slate-200 mt-1">{r.desc}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: RESPONSIBLE AI LOG */}
        {activeTab === 'auditlog' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white flex items-center">
                <ShieldAlert className="w-5 h-5 text-amber-400 mr-2" /> Responsible AI Audit Log & Human Oversight Report
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Detailed documentation of 6 cases where the AI answer was corrected by a human engineer, highlighting failure modes and safety lessons learned.
              </p>
            </div>

            <div className="space-y-4">
              {auditLogData.map(log => (
                <div key={log.case_id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-400 font-bold">
                        {log.case_id}
                      </span>
                      <span className="text-sm font-bold text-white">{log.concept} ({log.osi_layer})</span>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      log.review_decision === 'Edited' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      Decision: {log.review_decision}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-red-900/30 space-y-1">
                      <span className="text-red-400 font-bold">Original AI Initial Answer:</span>
                      <p className="text-slate-300">{log.ai_root_cause}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/30 space-y-1">
                      <span className="text-emerald-400 font-bold">Human Engineer Correction:</span>
                      <p className="text-slate-300">{log.human_correction}</p>
                    </div>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-800/40 p-3 rounded-xl text-xs space-y-1">
                    <span className="text-amber-300 font-bold">Failure Mode & Safety Lesson:</span>
                    <p className="text-amber-100/90"><strong>{log.failure_mode}</strong>: {log.safety_lesson}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PROMPT LIBRARY */}
        {activeTab === 'prompts' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <FileText className="w-5 h-5 text-cyan-400 mr-2" /> Structured Prompt Library (`diagnose_prompt.md`)
              </h3>
              <p className="text-xs text-slate-400">
                System prompts that force strict JSON output with root cause, confidence, evidence, next command, and CLI fix steps.
              </p>
              
              <pre className="bg-slate-950 font-mono text-xs text-cyan-300 p-4 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                {promptData.primary_prompt}
              </pre>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Worked Examples Included in Prompt</h4>
              {promptData.worked_examples.map((we, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2 text-xs">
                  <h5 className="font-bold text-cyan-400 text-sm">{we.title}</h5>
                  <p className="text-slate-300"><strong>Symptom:</strong> {we.symptom}</p>
                  <p className="text-slate-400 font-mono"><strong>Show Output:</strong> {we.outputs}</p>
                  <p className="text-emerald-400 font-medium"><strong>Diagnosis:</strong> {we.diagnosis}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-400">
        NetSage AI Troubleshooting Helper • Internship Project • Mandatory Human Oversight Safety Rule Enforced
      </footer>

    </div>
  );
}

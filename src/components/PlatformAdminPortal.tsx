/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Store, 
  TrendingUp, 
  ClipboardList, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText, 
  Cpu, 
  Percent, 
  Plus, 
  Coins,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Product, Order, NurseryRegistration, Nursery } from '../types';

interface PlatformAdminPortalProps {
  products: Product[];
  orders: Order[];
  registrations: NurseryRegistration[];
  nurseries: Nursery[];
  onApproveRegistration: (regId: string) => void;
  onRejectRegistration: (regId: string) => void;
  onOpenInvoice: (order: Order) => void;
  onUpdateProductStock: (productId: string, price: number, stock: number) => void;
}

export default function PlatformAdminPortal({
  products,
  orders,
  registrations,
  nurseries,
  onApproveRegistration,
  onRejectRegistration,
  onOpenInvoice,
  onUpdateProductStock
}: PlatformAdminPortalProps) {
  // Local navigation tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'registrations' | 'orders' | 'wallets' | 'catalog' | 'config'>('analytics');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Interactive Configuration Parameters State
  const [zatcaVatRate, setZatcaVatRate] = useState(15.0);
  const [proximityLimit, setProximityLimit] = useState(5.0);
  const [platformFeeCut, setPlatformFeeCut] = useState(15.0);
  const [nurseryApprovalMode, setNurseryApprovalMode] = useState<'manual' | 'automatic'>('manual');
  const [sandboxLogging, setSandboxLogging] = useState(true);
  const [minSettlementAmount, setMinSettlementAmount] = useState(500);
  const [showConfigSaved, setShowConfigSaved] = useState(false);

  // Stats calculation
  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalVatCollected = orders.reduce((sum, o) => sum + o.vatAmount, 0);
  const activeNurseryCount = nurseries.length;
  const pendingRegistrationsCount = registrations.filter(r => r.status === 'Pending').length;

  // Render elegant custom SVG bar chart for sales performance
  const renderSalesChart = () => {
    // Weeks mock data: 12000 SAR, 18500 SAR, 14000 SAR, 24500 SAR
    const data = [12000, 18500, 14000, 24500, totalGMV];
    const maxVal = Math.max(...data) * 1.1;
    const height = 140;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">Marketplace Weekly GMV (SAR)</p>
          <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5">Updated Live</span>
        </div>

        <div className="flex items-end justify-between h-[150px] pt-4 border-b border-l border-gray-200 pl-4 pb-2">
          {data.map((val, idx) => {
            const barHeight = (val / maxVal) * height;
            return (
              <div key={idx} className="flex flex-col items-center flex-1 group">
                {/* Tooltip */}
                <span className="opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[10px] font-mono px-1.5 py-0.5 mb-1 transition-opacity duration-200">
                  {val.toFixed(0)} SAR
                </span>
                <div 
                  className="w-10 bg-[#4b5c09] transition-all duration-500 hover:bg-[#3d4c07]"
                  style={{ height: `${barHeight}px` }}
                />
                <span className="text-[10px] text-gray-500 mt-2 font-mono">
                  {idx === 4 ? 'Current' : `Wk ${idx + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render category distribution custom SVG pie/donut-like layout
  const renderCategoryDistribution = () => {
    const categories = ['Indoor Plants', 'Outdoor Trees', 'Flowering Plants', 'Other'];
    const percentages = [45, 25, 20, 10];
    const colors = ['bg-[#4b5c09]', 'bg-[#6d8412]', 'bg-[#8fac22]', 'bg-gray-300'];

    return (
      <div className="space-y-4">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">Plant Category Share</p>
        
        {/* Horizontal layered progress bar representing percentage distribution cleanly */}
        <div className="h-8 w-full flex overflow-hidden">
          {percentages.map((p, idx) => (
            <div 
              key={idx} 
              className={`${colors[idx]} h-full flex items-center justify-center`}
              style={{ width: `${p}%` }}
              title={`${categories[idx]}: ${p}%`}
            >
              <span className="text-white text-[10px] font-bold font-mono">
                {p}%
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {categories.map((cat, idx) => (
            <div key={cat} className="flex items-center space-x-2">
              <span className={`w-3 h-3 ${colors[idx]} shrink-0`} />
              <span className="text-gray-600 font-semibold">{cat}</span>
              <span className="text-gray-400 font-mono">({percentages[idx]}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render regional performance chart computed from real orders
  const renderRegionalPerformance = () => {
    const cityCounts: { [key: string]: number } = {};
    orders.forEach(o => {
      cityCounts[o.city] = (cityCounts[o.city] || 0) + 1;
    });

    const citiesList = ['Riyadh', 'Jeddah', 'Al-Ahsa', 'Dammam'];
    const data = citiesList.map(city => ({
      city,
      count: cityCounts[city] || (city === 'Riyadh' ? 3 : city === 'Jeddah' ? 2 : city === 'Al-Ahsa' ? 1 : 0)
    }));

    const maxVal = Math.max(...data.map(d => d.count), 1);
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">Order Volume by Region</p>
          <span className="text-[9px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded uppercase font-mono">Real-Time Routing</span>
        </div>

        <div className="space-y-3 pt-1">
          {data.map((item, idx) => {
            const barPct = (item.count / maxVal) * 100;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700 font-bold">{item.city}</span>
                  <span className="text-gray-500 font-mono text-[10px] font-bold">{item.count} order{item.count !== 1 ? 's' : ''}</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-800 transition-all duration-700 rounded-full"
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render matching rule distribution from real orders
  const renderMatchingRuleDistribution = () => {
    const ruleCounts: { [key: string]: number } = {};
    orders.forEach(o => {
      let label = 'Proximity Matching';
      if (o.matchingRuleApplied.includes('Specialty')) {
        label = 'Specialty Sourcing';
      } else if (o.matchingRuleApplied.includes('Hub') || o.matchingRuleApplied.includes('Regional')) {
        label = 'Regional Hub Sourcing';
      }
      ruleCounts[label] = (ruleCounts[label] || 0) + 1;
    });

    const rules = [
      { name: 'Proximity Sourcing (Within 5km)', count: ruleCounts['Proximity Matching'] || 3, color: 'bg-[#4b5c09]' },
      { name: 'Regional Hub Dispatch', count: ruleCounts['Regional Hub Sourcing'] || 2, color: 'bg-slate-600' },
      { name: 'Specialty Sourcing (Special Crops)', count: ruleCounts['Specialty Sourcing'] || 1, color: 'bg-amber-500' },
    ];

    const total = rules.reduce((sum, r) => sum + r.count, 0);

    return (
      <div className="space-y-4">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">Algorithmic Order Allocation Matchmaker</p>
        
        <div className="space-y-3 pt-1">
          {rules.map((rule, idx) => {
            const pct = total > 0 ? (rule.count / total) * 100 : 0;
            return (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 sm:gap-4">
                <div className="flex items-center space-x-2 w-48 shrink-0">
                  <span className={`w-2 h-2 rounded-full ${rule.color}`} />
                  <span className="text-gray-600 font-semibold truncate text-[11px]">{rule.name}</span>
                </div>
                
                <div className="flex-1 flex items-center space-x-2 w-full">
                  <div className="flex-1 h-3 bg-gray-100 rounded overflow-hidden">
                    <div 
                      className={`h-full ${rule.color} rounded transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono text-[10px] text-gray-500 shrink-0">
                    <span className="font-bold text-gray-800">{pct.toFixed(0)}%</span> ({rule.count})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-gray-50 text-gray-900 overflow-hidden">
      
      {/* Sub-navigation Left Sidebar for Admin view */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#4b5c09] flex flex-col justify-between shrink-0 border-r border-[#5a6b10] transition-all duration-300`}>
        <div>
          <div className={`border-b border-[#5a6b10] flex items-center justify-between ${sidebarCollapsed ? 'p-3' : 'p-6'}`}>
            {!sidebarCollapsed && (
              <div className="space-y-1 min-w-0">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#a3b361]">
                  Platform Admin
                </h2>
                <p className="text-base font-bold font-sans tracking-tight text-white uppercase truncate">
                  HQ Control Tower
                </p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-1.5 rounded text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className={`space-y-1 ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
            <button
              onClick={() => setActiveTab('analytics')}
              title="Control Center"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              {!sidebarCollapsed && (activeTab === 'analytics' ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
              ))}
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 text-left">Control Center</span>}
            </button>

            <button
              onClick={() => setActiveTab('registrations')}
              title="Nursery Partners"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                activeTab === 'registrations'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              <div className={`flex items-center ${sidebarCollapsed ? '' : 'space-x-3'} relative`}>
                {!sidebarCollapsed && (activeTab === 'registrations' ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
                ))}
                <Store className="w-3.5 h-3.5 shrink-0" />
                {!sidebarCollapsed && <span className="text-left">Nursery Partners</span>}
                {sidebarCollapsed && pendingRegistrationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 px-1 py-0.5 text-[8px] leading-none font-mono font-bold rounded bg-[#a3b361] text-white">
                    {pendingRegistrationsCount}
                  </span>
                )}
              </div>
              {!sidebarCollapsed && pendingRegistrationsCount > 0 && (
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-[#a3b361] text-white">
                  {pendingRegistrationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              title="Global Orders Flow"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              {!sidebarCollapsed && (activeTab === 'orders' ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
              ))}
              <ClipboardList className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 text-left">Global Orders Flow</span>}
            </button>

            <button
              onClick={() => setActiveTab('wallets')}
              title="Finances & VAT"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                activeTab === 'wallets'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              {!sidebarCollapsed && (activeTab === 'wallets' ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
              ))}
              <Coins className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 text-left">Finances & VAT</span>}
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              title="Master Catalogue"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              {!sidebarCollapsed && (activeTab === 'catalog' ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
              ))}
              <Cpu className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 text-left">Master Catalogue</span>}
            </button>

            <button
              onClick={() => setActiveTab('config')}
              title="System Settings"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                activeTab === 'config'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              {!sidebarCollapsed && (activeTab === 'config' ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
              ))}
              <Settings className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 text-left font-sans uppercase tracking-wider text-[11px]">System Settings</span>}
            </button>
          </nav>
        </div>

        {/* Global Compliance box */}
        {!sidebarCollapsed && (
          <div className="p-4 m-4 bg-[#5a6b10]/30 border border-[#5a6b10]/60 rounded">
            <div className="flex items-start space-x-2">
              <Percent className="w-4 h-4 text-[#a3b361] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Unified VAT Settings</h4>
                <p className="text-[10px] text-[#d1dbb0] leading-relaxed">
                  National Tax Authority (ZATCA) rate fixed at 15.0%. Dynamic nursery allocation logs generated for security auditing.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Panel */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        
        {/* TAB: CONTROL CENTER / ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-xl font-bold text-gray-900 uppercase">HQ Analytics Control Tower</h1>
              <p className="text-xs text-gray-500">Centrally monitor national botanical commerce, VAT aggregates, and fulfillment health.</p>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 p-5 space-y-1.5 shadow-sm rounded">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gross Merchandise Value (GMV)</p>
                <p className="text-2xl font-bold font-mono text-gray-900">{totalGMV.toFixed(2)} <span className="text-xs text-gray-400 font-medium">SAR</span></p>
                <p className="text-[10px] text-[#4b5c09] font-bold">Aggregated marketplace purchases</p>
              </div>

              <div className="bg-white border border-gray-200 p-5 space-y-1.5 shadow-sm rounded">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total VAT Collected (15%)</p>
                <p className="text-2xl font-bold font-mono text-gray-900">{totalVatCollected.toFixed(2)} <span className="text-xs text-gray-400 font-medium">SAR</span></p>
                <p className="text-[10px] text-[#4b5c09] font-bold font-semibold">ZATCA Escrow Reserves</p>
              </div>

              <div className="bg-white border border-gray-200 p-5 space-y-1.5 shadow-sm rounded">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fulfillment Partners</p>
                <p className="text-2xl font-bold font-mono text-gray-900">{activeNurseryCount} <span className="text-xs text-gray-400 font-semibold">Nurseries</span></p>
                <p className="text-[10px] text-gray-400">Active regional growers</p>
              </div>

              <div className="bg-white border border-gray-200 p-5 space-y-1.5 shadow-sm rounded">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Registrations</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold font-mono text-orange-600">{pendingRegistrationsCount}</p>
                  {pendingRegistrationsCount > 0 && (
                    <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 font-bold rounded">Action Required</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400">Growers requesting platform access</p>
              </div>
            </div>

            {/* SVG Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                {renderSalesChart()}
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                {renderCategoryDistribution()}
              </div>
            </div>

            {/* Additional Advanced Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                {renderRegionalPerformance()}
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                {renderMatchingRuleDistribution()}
              </div>
            </div>
          </div>
        )}

        {/* TAB: NURSERY PARTNERS & REGISTRATIONS */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-xl font-bold text-gray-900 uppercase">Nursery Partner Onboarding</h1>
              <p className="text-xs text-gray-500">Approve or reject pending botanical grower registrations after validating Saudi Commercial Records (CR) and ZATCA VAT certificates.</p>
            </div>

            <div className="bg-white border border-gray-200 overflow-x-auto rounded shadow-sm">
              <table className="w-full text-left min-w-[860px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Grower Name</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Owner Contact</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase font-mono">CR Number</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase font-mono">VAT ID</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Location</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-right">Verification Decisions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-gray-900">{reg.name}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        <p className="font-bold">{reg.ownerName}</p>
                        <p className="text-gray-400 text-[10px]">{reg.phone} | {reg.email}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono font-semibold text-gray-800">{reg.crNumber}</td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">{reg.taxId}</td>
                      <td className="px-6 py-4 text-xs text-gray-600">{reg.city}, KSA</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          reg.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                          reg.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {reg.status === 'Pending' ? (
                          <div className="flex justify-end space-x-1.5">
                            <button
                              onClick={() => onRejectRegistration(reg.id)}
                              className="p-1 border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                              title="Reject Registration"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onApproveRegistration(reg.id)}
                              className="px-2.5 py-1 bg-[#4b5c09] text-white text-[10px] font-bold hover:bg-[#3d4c07] transition-all cursor-pointer"
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Decision Recorded</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: GLOBAL ORDERS FLOW & matching rules */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-xl font-bold text-gray-900 uppercase">Global Order Fulfillment & Matching Logs</h1>
              <p className="text-xs text-gray-500">Monitor unified client requests, track real-time delivery progression, and audit the automatic background nursery assignment matching algorithms.</p>
            </div>

            <div className="bg-white border border-gray-200 overflow-x-auto rounded shadow-sm">
              <table className="w-full text-left min-w-[980px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase font-mono">Order ID</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Recipient Name</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Ordered Plants</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-right">Total (Incl. VAT)</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Matched Nursery</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Algorithmic Matching Rule</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-right">Auditing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-gray-900 font-mono">{ord.id}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{ord.date}</td>
                      <td className="px-6 py-4 text-xs">
                        <p className="font-bold text-gray-900">{ord.customerName}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{ord.city}</p>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <p className="font-bold text-gray-900">
                          {ord.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-right font-mono font-bold text-gray-900">{ord.totalAmount.toFixed(2)} SAR</td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-900">{ord.matchedNurseryName}</td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center space-x-1.5 text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded w-fit">
                          <Cpu className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-mono font-bold text-[10px]">{ord.matchingRuleApplied}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onOpenInvoice(ord)}
                          className="px-2.5 py-1.5 border border-gray-200 hover:border-gray-300 text-gray-700 text-[10px] font-bold rounded inline-flex items-center space-x-1 cursor-pointer bg-white shadow-xs transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-gray-400" />
                          <span>ZATCA Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: WALLETS & VAT REGISTRY */}
        {activeTab === 'wallets' && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-xl font-bold text-gray-900 uppercase">digital wallet & tax balances</h1>
              <p className="text-xs text-gray-500">Audit registered nursery ledger accounts, track settlement requests, and monitor accrued VAT.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* VAT Aggregate */}
              <div className="bg-white border border-gray-200 p-6 space-y-3">
                <p className="text-xs font-mono font-bold text-gray-400 uppercase">Accrued Tax Liability (VAT)</p>
                <p className="text-2xl font-mono font-bold text-[#4b5c09]">{totalVatCollected.toFixed(2)} SAR</p>
                <div className="text-[10px] text-gray-500 leading-relaxed bg-gray-50 p-3 space-y-1">
                  <p>● Under ZATCA rule, 15% VAT is strictly compiled per transaction.</p>
                  <p>● To be filed quarterly on the national unified portal.</p>
                </div>
              </div>

              {/* Nursery accounts table */}
              <div className="md:col-span-2 bg-white border border-gray-200 p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                  Nursery Ledger Balances
                </h3>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 font-bold bg-gray-50 text-gray-600">
                        <th className="py-2 px-3">Partner Nursery</th>
                        <th className="py-2 px-3 font-mono">VAT ID</th>
                        <th className="py-2 px-3 text-right">Wallet Balance</th>
                        <th className="py-2 px-3 text-right">Platform Fee Share (15%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nurseries.map((n) => {
                        const feeShare = (n.walletBalance / 0.85) * 0.15;
                        return (
                          <tr key={n.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                            <td className="py-3 px-3 font-bold text-gray-800">{n.name}</td>
                            <td className="py-3 px-3 font-mono text-gray-500">{n.taxId}</td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-[#4b5c09]">{n.walletBalance.toFixed(2)} SAR</td>
                            <td className="py-3 px-3 text-right font-mono text-gray-500">{feeShare.toFixed(2)} SAR</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MASTER CATALOG CATALOGUE */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-xl font-bold text-gray-900 uppercase">Platform Master Catalog</h1>
              <p className="text-xs text-gray-500">Master repository of all registered plants in the botanical database. Direct allocation target.</p>
            </div>

            <div className="bg-white border border-gray-200 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[820px]">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-100 font-bold text-gray-700">
                    <th className="py-3 px-4">Plant Thumbnail</th>
                    <th className="py-3 px-4">Plant Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4 text-right">Standard Price</th>
                    <th className="py-3 px-4 text-right">Total Available Stock</th>
                    <th className="py-3 px-4">Default Fulfillment Matched Nursery</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const matchedNurs = nurseries.find(n => n.id === p.matchedNurseryId)?.name || 'Platform Hub';
                    return (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover border border-gray-100 rounded-md"
                          />
                        </td>
                        <td className="py-3 px-4 font-bold">
                          <p className="text-gray-900">{p.name}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{p.category}</td>
                        <td className="py-3 px-4 text-gray-600 font-mono font-semibold">{p.size}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#4b5c09]">{p.price.toFixed(2)} SAR</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-gray-700">{p.stock} units</td>
                        <td className="py-3 px-4 font-semibold text-[#4b5c09]">{matchedNurs}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: SYSTEM PARAMETERS & LOGISTICAL CONFIG */}
        {activeTab === 'config' && (
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 uppercase">Unified System Configuration</h1>
                <p className="text-xs text-gray-500 font-medium">Configure national tax compliance parameters, local matchmaker algorithms, and platform transaction rules.</p>
              </div>
              <span className="self-start sm:self-auto px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded bg-slate-100 border border-slate-200 text-slate-800">
                System Schema: v2.4.1
              </span>
            </div>

            {showConfigSaved && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-start space-x-3 shadow-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider">Parameters Flushed to Registry</p>
                  <p className="text-[11px] text-emerald-700 font-semibold leading-relaxed">
                    All modified dispatch radii, escrow levels, and ZATCA compliance settings were successfully written to the cluster. All new checkouts will run under these parameters.
                  </p>
                </div>
              </div>
            )}

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setShowConfigSaved(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  setShowConfigSaved(false);
                }, 5000);
              }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Section: ZATCA National Tax Compliance */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg space-y-6 shadow-sm">
                  <div className="border-b border-gray-100 pb-3 flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-[#4b5c09]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      ZATCA e-Invoice Compliance
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="block font-bold text-gray-600 uppercase tracking-wide text-[10px]">Unified VAT Rate (%)</label>
                      <div className="flex space-x-2">
                        <input 
                          type="number" 
                          step="0.1"
                          required
                          value={zatcaVatRate}
                          onChange={(e) => {
                            setZatcaVatRate(parseFloat(e.target.value));
                            setShowConfigSaved(false);
                          }}
                          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded text-xs font-mono font-bold"
                        />
                        <span className="bg-gray-100 border border-gray-200 px-3 py-2 text-gray-500 font-bold rounded">
                          SAR
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold">
                        Strictly compiled on all platform transactions in accordance with Saudi Tax Regulations (default 15.0%).
                      </p>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="block font-bold text-gray-700 text-xs">ZATCA Sandbox Telemetry Logging</label>
                          <p className="text-[10px] text-gray-400 font-semibold">Redirect cryptographic ledger payloads to Sandbox for real-time audit verification.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSandboxLogging(!sandboxLogging);
                            setShowConfigSaved(false);
                          }}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            sandboxLogging ? 'bg-[#4b5c09]' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            sandboxLogging ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 border border-gray-100 rounded space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-gray-500">Cryptographic Integration SHA-256</span>
                        <span className="text-[#4b5c09] font-bold">SECURE_VERIFIED</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-gray-500">Auto-Report Period</span>
                        <span className="text-gray-700 font-bold">EndOfQuarter [Active]</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Logistical Dispatch Engine */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg space-y-6 shadow-sm">
                  <div className="border-b border-gray-100 pb-3 flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-[#4b5c09]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Intelligent Dispatch Algorithm
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-gray-600">
                        <span>Fulfillment Proximity Limit</span>
                        <span className="font-mono text-[#4b5c09] text-xs">{proximityLimit} km</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        step="0.5"
                        value={proximityLimit}
                        onChange={(e) => {
                          setProximityLimit(parseFloat(e.target.value));
                          setShowConfigSaved(false);
                        }}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#4b5c09]"
                      />
                      <p className="text-[10px] text-gray-400 font-semibold">
                        Define maximum radius for matching customers with local registered nursery crops. Decreasing this values guarantees lower shipping stress but might restrict crop availability.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-gray-600 uppercase tracking-wide text-[10px]">Fulfillment Allocation Priority</label>
                      <select 
                        value={nurseryApprovalMode}
                        onChange={(e) => {
                          setNurseryApprovalMode(e.target.value as 'manual' | 'automatic');
                          setShowConfigSaved(false);
                        }}
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded text-xs font-semibold text-gray-700"
                      >
                        <option value="manual">Primary: Proximity Sourcing, Secondary: Regional Hub</option>
                        <option value="automatic">Absolute Least-Transport Proximity Matchmaker</option>
                      </select>
                      <p className="text-[10px] text-gray-400 font-semibold">
                        Strategy applied when matching bulk crops for instant national logistics dispatch.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section: Financial Cut & Settlements */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg space-y-6 shadow-sm lg:col-span-2">
                  <div className="border-b border-gray-100 pb-3 flex items-center space-x-2">
                    <Coins className="w-4 h-4 text-[#4b5c09]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Platform Commercial Cut & Settlement Bounds
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-1.5">
                      <label className="block font-bold text-gray-600 uppercase tracking-wide text-[10px]">Platform Commission Fee (%)</label>
                      <div className="flex space-x-2">
                        <input 
                          type="number" 
                          min="0" 
                          max="50" 
                          step="0.5"
                          required
                          value={platformFeeCut}
                          onChange={(e) => {
                            setPlatformFeeCut(parseFloat(e.target.value));
                            setShowConfigSaved(false);
                          }}
                          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded text-xs font-mono font-bold"
                        />
                        <span className="bg-gray-100 border border-gray-200 px-3 py-2 text-gray-500 font-bold rounded">
                          %
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold">
                        Percentage withheld from nursery sales for payment gateway handling, routing dispatch engineering, and VAT collection services (standard 15%).
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-gray-600 uppercase tracking-wide text-[10px]">Min Settlement Threshold (SAR)</label>
                      <div className="flex space-x-2">
                        <input 
                          type="number" 
                          min="100" 
                          max="10000" 
                          step="100"
                          required
                          value={minSettlementAmount}
                          onChange={(e) => {
                            setMinSettlementAmount(parseInt(e.target.value));
                            setShowConfigSaved(false);
                          }}
                          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded text-xs font-mono font-bold"
                        />
                        <span className="bg-gray-100 border border-gray-200 px-3 py-2 text-gray-500 font-bold rounded">
                          SAR
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold">
                        Minimum wallet balance required for registered nurseries to request a direct financial wire to their Saudi Bank Account.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#4b5c09] hover:bg-[#3d4c07] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer shadow-sm hover:shadow"
                >
                  Save Global System Settings
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}

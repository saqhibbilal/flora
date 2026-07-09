/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  Layers, 
  Wallet, 
  Plus, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  UploadCloud, 
  ArrowUpRight, 
  Boxes, 
  ClipboardList, 
  RefreshCw,
  Truck,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  LogOut
} from 'lucide-react';
import { Product, Order, Nursery, OrderStatus } from '../types';

interface NurseryPortalProps {
  products: Product[];
  orders: Order[];
  nurseries: Nursery[];
  activeNurseryId: string;
  setActiveNurseryId: (id: string) => void;
  onUpdateProductStock: (productId: string, price: number, stock: number) => void;
  onAddNurseryProduct: (newProduct: Omit<Product, 'id'>) => void;
  onRemoveProduct: (productId: string) => void;
  onEditProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAcceptOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string) => void;
  onUploadInvoice: (orderId: string) => void;
  onOpenInvoice: (order: Order) => void;
  onRequestSettlement: (nurseryId: string, amount: number) => void;
}

export default function NurseryPortal({
  products,
  orders,
  nurseries,
  activeNurseryId,
  setActiveNurseryId,
  onUpdateProductStock,
  onAddNurseryProduct,
  onRemoveProduct,
  onEditProduct,
  onUpdateOrderStatus,
  onAcceptOrder,
  onRejectOrder,
  onUploadInvoice,
  onOpenInvoice,
  onRequestSettlement
}: NurseryPortalProps) {
  // Navigation inside Nursery Portal
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'inventory' | 'wallet'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Local states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editStock, setEditStock] = useState<string>('');

  // Add product form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdArName, setNewProdArName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Indoor Plants');
  const [newProdPrice, setNewProdPrice] = useState('150');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdSize, setNewProdSize] = useState('Medium');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdArDesc, setNewProdArDesc] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Find active nursery details
  const activeNursery = nurseries.find(n => n.id === activeNurseryId) || nurseries[0];

  // Filter products and orders belonging specifically to THIS nursery
  const nurseryProducts = products.filter(p => p.matchedNurseryId === activeNurseryId);
  const nurseryOrders = orders.filter(o => o.matchedNurseryId === activeNurseryId);

  // Stats calculation
  const pendingOrders = nurseryOrders.filter(o => o.status === 'Received');
  const activePreparations = nurseryOrders.filter(o => o.status === 'Preparing' || o.status === 'Shipped');
  const completedOrders = nurseryOrders.filter(o => o.status === 'Delivered');
  const totalGMV = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Handle Edit stock submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const priceVal = parseFloat(editPrice);
      const stockVal = parseInt(editStock, 10);
      if (!isNaN(priceVal) && !isNaN(stockVal)) {
        onUpdateProductStock(editingProduct.id, priceVal, stockVal);
        setEditingProduct(null);
      }
    }
  };

  // Handle mock image upload click
  const triggerMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadStatus('Uploading image securely to portal storage...');
      setTimeout(() => {
        setUploadStatus('Successfully parsed & optimized image under ZATCA metadata checks!');
      }, 1500);
    }
  };

  // Handle Add Product submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(newProdPrice);
    const parsedStock = parseInt(newProdStock, 10);

    if (newProdName && !isNaN(parsedPrice) && !isNaN(parsedStock)) {
      onAddNurseryProduct({
        name: newProdName,
        arabicName: newProdArName || newProdName,
        category: newProdCategory,
        price: parsedPrice,
        vatRate: 0.15,
        image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=600', // Beautiful generic nursery plant
        description: newProdDesc || 'Healthy high-grade nursery stock.',
        arabicDescription: newProdArDesc || 'نبات ذو جودة عالية.',
        rating: 5.0,
        reviewsCount: 0,
        stock: parsedStock,
        size: newProdSize,
        matchedNurseryId: activeNurseryId
      });
      
      // Reset form
      setNewProdName('');
      setNewProdArName('');
      setNewProdPrice('150');
      setNewProdStock('20');
      setNewProdDesc('');
      setNewProdArDesc('');
      setUploadStatus('');
      setShowAddForm(false);
    }
  };

  const handleSettleRequest = () => {
    if (activeNursery.walletBalance > 0) {
      onRequestSettlement(activeNurseryId, activeNursery.walletBalance);
    }
  };

  return (
    <div className="flex h-full bg-gray-50 text-gray-900 overflow-hidden">
      
      {/* Sub-navigation Left Sidebar for Nursery view */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#4b5c09] flex flex-col justify-between shrink-0 border-r border-[#5a6b10] transition-all duration-300`}>
        <div>
          <div className={`border-b border-[#5a6b10] ${sidebarCollapsed ? 'p-3' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#a3b361]">
                  Nursery Partner
                </h2>
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

            {/* Nursery Profile Selector to easily showcase separate data states to the client */}
            {!sidebarCollapsed && (
              <div className="pt-2">
                <label className="block text-[9px] text-[#a3b361] font-bold uppercase mb-1">Active Partner Profile</label>
                <select
                  value={activeNurseryId}
                  onChange={(e) => setActiveNurseryId(e.target.value)}
                  className="w-full bg-[#5a6b10] border border-[#a3b361]/40 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#a3b361] font-semibold text-white cursor-pointer"
                >
                  {nurseries.map(n => (
                    <option key={n.id} value={n.id} className="bg-[#4b5c09] text-white">{n.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <nav className={`space-y-1 ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
            <button
              onClick={() => setActiveTab('dashboard')}
              title="Dashboard Summary"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              {!sidebarCollapsed && (activeTab === 'dashboard' ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
              ))}
              <Layers className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 text-left">Dashboard Summary</span>}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              title="Orders Queue"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              <div className={`flex items-center ${sidebarCollapsed ? '' : 'space-x-3'} relative`}>
                {!sidebarCollapsed && (activeTab === 'orders' ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
                ))}
                <ClipboardList className="w-3.5 h-3.5 shrink-0" />
                {!sidebarCollapsed && <span className="text-left">Orders Queue</span>}
                {sidebarCollapsed && pendingOrders.length > 0 && (
                  <span className="absolute -top-2 -right-2 px-1 py-0.5 text-[8px] leading-none font-mono font-bold rounded bg-[#a3b361] text-white">
                    {pendingOrders.length}
                  </span>
                )}
              </div>
              {!sidebarCollapsed && pendingOrders.length > 0 && (
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-[#a3b361] text-white">
                  {pendingOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              title="Product Catalog"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                activeTab === 'inventory'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              {!sidebarCollapsed && (activeTab === 'inventory' ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
              ))}
              <Boxes className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 text-left">Product Catalog</span>}
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              title="Wallet Settlements"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                activeTab === 'wallet'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              {!sidebarCollapsed && (activeTab === 'wallet' ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
              ))}
              <Wallet className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 text-left">Wallet Settlements</span>}
            </button>
          </nav>
        </div>

        <div className="p-4 mt-auto border-t border-[#5a6b10]/50">
          <button
            onClick={() => window.location.reload()}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-2 justify-center'} px-3 py-2 text-xs font-bold rounded cursor-pointer transition-colors bg-[#5a6b10] text-white hover:opacity-90 shadow-sm`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        
        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900 uppercase">
                  {activeNursery.name} Partner Portal
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Registered Location: {activeNursery.location}
                </p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 font-bold border border-green-200 rounded-md">
                Active Partner
              </span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 p-5 space-y-2">
                <p className="text-xs font-mono font-bold text-gray-400 uppercase">Available Wallet</p>
                <p className="text-xl font-bold font-mono text-[#4b5c09]">{activeNursery.walletBalance.toFixed(2)} SAR</p>
                <p className="text-[10px] text-gray-400">Ready for Bank Transfer (Net of 15% Platform fee)</p>
              </div>

              <div className="bg-white border border-gray-200 p-5 space-y-2">
                <p className="text-xs font-mono font-bold text-gray-400 uppercase">Pending Allocations</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold font-mono text-amber-600">{pendingOrders.length} Orders</p>
                  {pendingOrders.length > 0 && (
                    <span className="animate-pulse bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 font-bold">New Notification</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400">Requires immediate acceptance decision</p>
              </div>

              <div className="bg-white border border-gray-200 p-5 space-y-2">
                <p className="text-xs font-mono font-bold text-gray-400 uppercase">Active Preparation</p>
                <p className="text-xl font-bold font-mono text-indigo-700">{activePreparations.length} Orders</p>
                <p className="text-[10px] text-gray-400">Under assembly or dispatched on courier</p>
              </div>

              <div className="bg-white border border-gray-200 p-5 space-y-2">
                <p className="text-xs font-mono font-bold text-gray-400 uppercase">Active Catalog Listings</p>
                <p className="text-xl font-bold font-mono text-gray-800">{nurseryProducts.length} Items</p>
                <p className="text-[10px] text-gray-400">Directly feeding standard platform matching</p>
              </div>
            </div>

            {/* Live activity / pending alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Notifications */}
              <div className="lg:col-span-2 bg-white border border-gray-200 p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <span>Real-time Operational Alert Stream</span>
                </h3>

                {pendingOrders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-500">
                    No pending orders requiring action. System logistics have zero backlog.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingOrders.map((ord) => (
                      <div key={ord.id} className="border border-amber-200 bg-amber-50/20 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="space-y-1">
                          <p className="text-xs font-mono font-bold text-amber-800">PENDING ALLOCATION: {ord.id}</p>
                          <p className="text-[11px] text-gray-500">Matched via: <span className="font-semibold text-gray-700">{ord.matchingRuleApplied}</span></p>
                          <p className="text-xs font-semibold text-gray-800">
                            {ord.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                          </p>
                          <p className="text-[11px] text-gray-400">Total order payout value: <span className="font-mono text-[#4b5c09] font-bold">{ord.totalAmount.toFixed(2)} SAR</span></p>
                        </div>

                        <div className="flex space-x-2 shrink-0">
                          <button
                            onClick={() => onRejectOrder(ord.id)}
                            className="px-2.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => onAcceptOrder(ord.id)}
                            className="px-3 py-1.5 bg-[#4b5c09] text-white text-[11px] font-bold hover:bg-[#3d4c07] transition-all cursor-pointer"
                          >
                            Accept & Prepare
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Settlement Quick overview */}
              <div className="bg-white border border-gray-200 p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                  Financial Settlement Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 border border-gray-100">
                    <p className="text-[11px] text-gray-400 uppercase font-mono">Net Settlement Share</p>
                    <p className="text-xl font-mono font-bold text-[#4b5c09]">{activeNursery.walletBalance.toFixed(2)} SAR</p>
                    <button
                      onClick={handleSettleRequest}
                      disabled={activeNursery.walletBalance <= 0}
                      className="w-full mt-3 py-1.5 bg-[#4b5c09] disabled:bg-gray-300 text-white text-[10px] font-bold hover:bg-[#3d4c07] transition-colors cursor-pointer"
                    >
                      Request Payout to Bank
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Recent Transfers</p>
                    {activeNursery.settlementHistory.map((s) => (
                      <div key={s.id} className="text-xs flex justify-between items-center border-b border-gray-50 pb-1.5">
                        <div>
                          <p className="font-semibold text-gray-800">{s.amount.toFixed(2)} SAR</p>
                          <p className="text-[10px] text-gray-400 font-mono">{s.referenceNumber}</p>
                        </div>
                        <span className="text-[10px] font-semibold bg-green-50 text-green-700 px-2 py-0.5 border border-green-100">
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ORDERS QUEUE & MANAGE PREPARATION */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-xl font-bold text-gray-900 uppercase">Orders Fulfillment Center</h1>
              <p className="text-xs text-gray-500">Monitor allocations, manage assembly preparation, and perform mandatory ZATCA Simplified Tax Invoicing workflows.</p>
            </div>

            {nurseryOrders.length === 0 ? (
              <div className="bg-white border border-gray-200 p-12 text-center text-gray-500 text-xs">
                No orders assigned to this nursery partner yet.
              </div>
            ) : (
              <div className="bg-white border border-gray-200 overflow-x-auto rounded shadow-sm">
                <table className="w-full text-left min-w-[720px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase font-mono">Order ID</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Date & Time</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Fulfillment Items</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-right">Payout Value</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Compliance Document</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {nurseryOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-xs font-bold text-gray-900 font-mono">{ord.id}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{ord.date}</td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-gray-900">
                            {ord.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-right text-gray-900 font-mono">{ord.totalAmount.toFixed(2)} SAR</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.status === 'Received' ? 'bg-orange-100 text-orange-700' :
                            ord.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                            ord.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {ord.invoiceUploadedByNursery ? (
                            <button
                              onClick={() => onOpenInvoice(ord)}
                              className="text-xs font-semibold text-[#4b5c09] hover:underline flex items-center space-x-1 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View ZATCA Tax Invoice</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onUploadInvoice(ord.id)}
                              className="text-xs font-bold text-amber-700 hover:underline flex items-center space-x-1 cursor-pointer"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Generate/Upload Invoice</span>
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            {ord.status === 'Received' && (
                              <>
                                <button
                                  onClick={() => onRejectOrder(ord.id)}
                                  className="p-1 border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                                  title="Reject Order"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onAcceptOrder(ord.id)}
                                  className="px-2 py-1 bg-[#4b5c09] text-white text-[10px] font-bold hover:bg-[#3d4c07] cursor-pointer"
                                >
                                  Accept
                                </button>
                              </>
                            )}
                            
                            {ord.status === 'Preparing' && (
                              <button
                                onClick={() => onUpdateOrderStatus(ord.id, 'Shipped')}
                                className="px-2.5 py-1 bg-[#4b5c09] text-white text-[10px] font-bold hover:bg-[#3d4c07] flex items-center space-x-1 cursor-pointer"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Ship Order</span>
                              </button>
                            )}

                            {ord.status === 'Shipped' && (
                              <button
                                onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                                className="px-2.5 py-1 bg-green-700 text-white text-[10px] font-bold hover:bg-green-800 flex items-center space-x-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark Delivered</span>
                              </button>
                            )}

                            {ord.status === 'Delivered' && (
                              <span className="text-[10px] text-gray-400 font-bold uppercase">Completed</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: INVENTORY / CATALOG MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900 uppercase">Product & Stock Master</h1>
                <p className="text-xs text-gray-500">Configure prices, adjust live stock, and sync custom botanical assets.</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-[#4b5c09] text-white text-xs font-bold hover:bg-[#3d4c07] flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Plant</span>
              </button>
            </div>

            {/* Simulated Add Product form */}
            {showAddForm && (
              <form onSubmit={handleAddProductSubmit} className="bg-white border border-gray-200 p-6 space-y-4 max-w-2xl rounded-md">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                  New Plant Registry Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-600 mb-1">Plant Name (English)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lavender Herb"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Price (SAR, VAT Inclusive)</label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Initial Quantity in Stock</label>
                    <input
                      type="number"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded-md text-xs"
                    >
                      <option value="Indoor Plants">Indoor Plants</option>
                      <option value="Outdoor Trees">Outdoor Trees</option>
                      <option value="Flowering Plants">Flowering Plants</option>
                      <option value="Succulents & Cacti">Succulents & Cacti</option>
                      <option value="Gardening Tools">Gardening Tools</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Size Specification</label>
                    <select
                      value={newProdSize}
                      onChange={(e) => setNewProdSize(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded-md text-xs"
                    >
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                      <option value="Extra Large">Extra Large</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <div>
                    <label className="block text-gray-600 mb-1">English Description</label>
                    <textarea
                      rows={2}
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded-md text-xs"
                    />
                  </div>
                </div>

                {/* Upload Section */}
                <div className="border border-dashed border-gray-300 p-4 text-center text-xs text-gray-500 bg-gray-50 rounded-md">
                  <label className="block cursor-pointer">
                    <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                    <span className="font-bold text-[#4b5c09]">Upload High-Resolution Product Image</span>
                    <p className="text-[10px] text-gray-400 mt-1">Supports PNG, JPG up to 10MB (Simulated Verification)</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={triggerMockUpload} 
                      className="sr-only" 
                    />
                  </label>
                  {uploadStatus && (
                    <p className="text-xs text-[#4b5c09] font-semibold mt-2">{uploadStatus}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4b5c09] text-white font-bold hover:bg-[#3d4c07] rounded-md cursor-pointer"
                  >
                    Save Plant To Platform
                  </button>
                </div>
              </form>
            )}

            {/* Inventory Listing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nurseryProducts.map((p) => (
                <div key={p.id} className="bg-white border border-gray-200 overflow-hidden flex flex-col justify-between rounded-lg">
                  <div>
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-32 object-cover border-b border-gray-100"
                    />
                    <div className="p-4 space-y-1.5">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{p.category}</p>
                      <h4 className="text-xs font-bold text-gray-900 leading-tight">{p.name}</h4>
                      
                      <div className="pt-2 flex justify-between text-xs font-mono">
                        <div>
                          <span className="text-gray-400 font-sans text-[10px]">Price:</span>
                          <p className="font-bold text-[#4b5c09]">{p.price.toFixed(2)} SAR</p>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 font-sans text-[10px]">Stock Qty:</span>
                          <p className={`font-bold ${p.stock < 10 ? 'text-red-600' : 'text-gray-800'}`}>{p.stock} units</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border-t border-gray-100 p-3 flex flex-wrap items-center justify-end gap-2">
                    <button
                      onClick={() => onRemoveProduct(p.id)}
                      className="px-2 py-1.5 border border-red-200 text-red-600 bg-white hover:bg-red-50 text-[11px] font-bold rounded-md flex items-center space-x-1 cursor-pointer"
                      title="Remove Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden xl:inline">Remove</span>
                    </button>
                    <button
                      onClick={() => onEditProduct(p.id)}
                      className="px-2 py-1.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-[11px] font-bold rounded-md flex items-center space-x-1 cursor-pointer"
                      title="Edit Product Details"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span className="hidden xl:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setEditPrice(p.price.toString());
                        setEditStock(p.stock.toString());
                      }}
                      className="px-2.5 py-1.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-[11px] font-bold rounded-md flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Adjust Stock</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: WALLET & SETTLEMENT HISTORY */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-xl font-bold text-gray-900 uppercase">Settlement Wallet Ledger</h1>
              <p className="text-xs text-gray-500">Inspect digital payouts, review platform fees, and coordinate Saudi local banking transfers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Wallet stats */}
              <div className="bg-white border border-gray-200 p-6 space-y-4 rounded-md">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                  Live Balance Details
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-bold">Unsettled Net Revenue</span>
                    <p className="text-2xl font-mono font-bold text-[#4b5c09]">{activeNursery.walletBalance.toFixed(2)} SAR</p>
                  </div>

                  <div className="text-xs text-gray-500 leading-relaxed space-y-1 bg-gray-50 p-3 border border-gray-100 rounded-md">
                    <p>● Platform Commission: <span className="font-semibold text-gray-700">15% Standard deduction</span></p>
                    <p>● Bank Transfer Cost: <span className="font-semibold text-gray-700">0.00 SAR (Free)</span></p>
                    <p>● Transferred Bank Account: <span className="font-mono text-gray-700 font-bold">Al Rajhi Bank *4012</span></p>
                  </div>

                  <button
                    onClick={handleSettleRequest}
                    disabled={activeNursery.walletBalance <= 0}
                    className="w-full py-2 bg-[#4b5c09] text-white text-xs font-bold hover:bg-[#3d4c07] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors rounded-md cursor-pointer"
                  >
                    Initiate Bank Settlement
                  </button>
                </div>
              </div>

              {/* Bank accounts/Transfers ledger */}
              <div className="md:col-span-2 bg-white border border-gray-200 p-6 space-y-4 rounded-md">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 flex items-center justify-between">
                  <span>Transfer Settlement Ledger</span>
                  <RefreshCw className="w-4.5 h-4.5 text-gray-400" />
                </h3>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 font-bold bg-gray-50 text-gray-600">
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Reference ID</th>
                        <th className="py-2 px-3">Target Bank</th>
                        <th className="py-2 px-3 text-right">Settled Amount</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeNursery.settlementHistory.map((s) => (
                        <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50/55">
                          <td className="py-3 px-3 font-mono">{s.date}</td>
                          <td className="py-3 px-3 font-mono">{s.referenceNumber}</td>
                          <td className="py-3 px-3">{s.bankName}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">{s.amount.toFixed(2)} SAR</td>
                          <td className="py-3 px-3 text-right">
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 font-semibold font-mono text-[10px]">
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* STOCK ADJUSTMENT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form 
            onSubmit={handleEditSubmit}
            className="bg-white text-gray-900 w-full max-w-sm rounded-lg p-6 space-y-4 shadow-xl border border-gray-200"
          >
            <div className="space-y-1 border-b border-gray-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Inventory Adjustments</h3>
              <p className="text-sm font-bold text-gray-900">{editingProduct.name}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Standard Listing Price (SAR, VAT Included)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Stock Level (Available Units)</label>
                <input
                  type="number"
                  required
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#4b5c09] text-white font-bold hover:bg-[#3d4c07] rounded-md cursor-pointer"
              >
                Apply Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

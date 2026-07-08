/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Store, 
  User, 
  ShieldCheck, 
  FileText,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Product, 
  Order, 
  Nursery, 
  NurseryRegistration, 
  CartItem, 
  OrderStatus, 
  AppPersona 
} from './types';
import { 
  MOCK_PRODUCTS, 
  MOCK_ORDERS, 
  MOCK_REGISTRATIONS, 
  MOCK_NURSERIES 
} from './data';
import CustomerPortal from './components/CustomerPortal';
import NurseryPortal from './components/NurseryPortal';
import PlatformAdminPortal from './components/PlatformAdminPortal';
import ZatcaInvoiceModal from './components/ZatcaInvoiceModal';

export default function App() {
  // Global Shared States
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [registrations, setRegistrations] = useState<NurseryRegistration[]>(MOCK_REGISTRATIONS);
  const [nurseries, setNurseries] = useState<Nursery[]>(MOCK_NURSERIES);
  
  // Active Persona Switch
  const [selectedPersona, setSelectedPersona] = useState<AppPersona>('customer');

  // Customer State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(MOCK_ORDERS[0]); // Default to show something initially
  const [customerView, setCustomerView] = useState<'browse' | 'cart' | 'checkout' | 'success' | 'tracking' | 'profile'>('browse');

  // Nursery Portal State
  const [activeNurseryId, setActiveNurseryId] = useState<string>('nursery-1');

  // Active Tax Invoice Modal
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  // ----------------------------------------------------
  // CUSTOMER FLOW ACTIONS
  // ----------------------------------------------------
  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart => prevCart.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  // Automated silent nursery routing rules
  const handleCheckout = (details: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    paymentMethod: 'mada' | 'visa' | 'mastercard';
  }) => {
    // 1. Determine nursery fulfillment match silently behind the scenes
    let assignedNurseryId = 'nursery-1';
    let matchingRule = 'Proximity (Within 5km) - Optimized Logistics';

    // Check if they ordered an Olive Tree (specialty crop)
    const hasOliveTree = cart.some(item => item.product.id === 'prod-2');
    if (hasOliveTree) {
      assignedNurseryId = 'nursery-3';
      matchingRule = 'Direct Specialty Sourcing (Exclusive Premium Olive Stock)';
    } else if (details.city.toLowerCase() === 'jeddah') {
      assignedNurseryId = 'nursery-2';
      matchingRule = 'Proximity (Jeddah Hub) - Direct Regional Match';
    } else if (details.city.toLowerCase() === 'al-ahsa') {
      assignedNurseryId = 'nursery-3';
      matchingRule = 'Proximity (Eastern Province Hub)';
    }

    const matchedNurseryObj = nurseries.find(n => n.id === assignedNurseryId) || nurseries[0];

    // Calculate totals
    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const vatAmt = cartTotal - (cartTotal / 1.15); // 15% VAT

    // Create unique order
    const newOrderId = `ord-${Date.now().toString().slice(-4)}`;
    const newOrder: Order = {
      id: newOrderId,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      customerName: details.name,
      customerPhone: details.phone,
      customerEmail: details.email,
      customerAddress: details.address,
      city: details.city,
      items: [...cart],
      totalAmount: cartTotal,
      vatAmount: vatAmt,
      status: 'Received',
      paymentMethod: details.paymentMethod,
      matchedNurseryId: assignedNurseryId,
      matchedNurseryName: matchedNurseryObj.name,
      matchingRuleApplied: matchingRule,
      zatcaInvoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${newOrderId.split('-')[1]}`,
      zatcaQrCodeValue: `Seller: ${matchedNurseryObj.name} | TaxID: ${matchedNurseryObj.taxId} | Date: ${new Date().toISOString()} | Total: ${cartTotal.toFixed(2)} SAR | VAT: ${vatAmt.toFixed(2)} SAR`,
      invoiceUploadedByNursery: false
    };

    // 2. Decrement plant stocks on global master list
    setProducts(prevProds => prevProds.map(p => {
      const cartItem = cart.find(item => item.product.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    }));

    // 3. Add to nursery digital wallet balance (85% net of total platform commission)
    setNurseries(prevNurseries => prevNurseries.map(n => {
      if (n.id === assignedNurseryId) {
        // Nursery receives 85% of standard price (the remaining is platform commission)
        const payout = cartTotal * 0.85;
        return { ...n, walletBalance: n.walletBalance + payout };
      }
      return n;
    }));

    // 4. Update global orders queue
    setOrders(prevOrders => [...prevOrders, newOrder]);

    // 5. Update local customer active states
    setActiveOrder(newOrder);
    setCart([]);
    setCustomerView('success');
  };

  const handleRateOrder = (orderId: string, deliveryRating: number, productRating: number, feedback: string) => {
    setOrders(prevOrders => prevOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          deliveryRating,
          productRating,
          ratingFeedback: feedback
        };
      }
      return o;
    }));
    setActiveOrder(prev => {
      if (prev && prev.id === orderId) {
        return {
          ...prev,
          deliveryRating,
          productRating,
          ratingFeedback: feedback
        };
      }
      return prev;
    });
  };

  // ----------------------------------------------------
  // NURSERY FLOW ACTIONS
  // ----------------------------------------------------
  const handleUpdateProductStock = (productId: string, price: number, stock: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, price, stock } : p
    ));
  };

  const handleAddNurseryProduct = (newProduct: Omit<Product, 'id'>) => {
    const generatedId = `prod-${Date.now().toString().slice(-4)}`;
    const fullProduct: Product = {
      ...newProduct,
      id: generatedId
    };
    setProducts(prev => [...prev, fullProduct]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status } : o
    ));
    setActiveOrder(prev => {
      if (prev && prev.id === orderId) {
        return { ...prev, status };
      }
      return prev;
    });
  };

  const handleAcceptOrder = (orderId: string) => {
    handleUpdateOrderStatus(orderId, 'Preparing');
  };

  const handleRejectOrder = (orderId: string) => {
    // Self-healing matching: re-route to next best nursery!
    setOrders(prevOrders => prevOrders.map(o => {
      if (o.id === orderId) {
        // Find next nursery
        const currentIdx = nurseries.findIndex(n => n.id === o.matchedNurseryId);
        const nextIdx = (currentIdx + 1) % nurseries.length;
        const nextNursery = nurseries[nextIdx];

        // Deduct balance from old nursery, add to new nursery
        setNurseries(prevNurs => prevNurs.map(n => {
          if (n.id === o.matchedNurseryId) {
            return { ...n, walletBalance: Math.max(0, n.walletBalance - (o.totalAmount * 0.85)) };
          }
          if (n.id === nextNursery.id) {
            return { ...n, walletBalance: n.walletBalance + (o.totalAmount * 0.85) };
          }
          return n;
        }));

        const reMatchedOrder: Order = {
          ...o,
          matchedNurseryId: nextNursery.id,
          matchedNurseryName: nextNursery.name,
          matchingRuleApplied: `Rerouted via Self-Healing Algorithm: Re-allocated to ${nextNursery.name} after original partner declined`,
          zatcaQrCodeValue: `Seller: ${nextNursery.name} | TaxID: ${nextNursery.taxId} | Date: ${o.date} | Total: ${o.totalAmount.toFixed(2)} SAR`
        };

        if (activeOrder?.id === orderId) {
          setActiveOrder(reMatchedOrder);
        }

        return reMatchedOrder;
      }
      return o;
    }));
  };

  const handleUploadInvoice = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, invoiceUploadedByNursery: true };
      }
      return o;
    }));
    setActiveOrder(prev => {
      if (prev && prev.id === orderId) {
        return { ...prev, invoiceUploadedByNursery: true };
      }
      return prev;
    });
  };

  const handleRequestSettlement = (nurseryId: string, amount: number) => {
    setNurseries(prev => prev.map(n => {
      if (n.id === nurseryId) {
        const reference = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
        return {
          ...n,
          walletBalance: Math.max(0, n.walletBalance - amount),
          settlementHistory: [
            {
              id: `settle-${Date.now()}`,
              date: new Date().toISOString().slice(0, 10),
              amount: amount,
              status: 'Transferred',
              referenceNumber: reference,
              bankName: 'Al Rajhi Bank'
            },
            ...n.settlementHistory
          ]
        };
      }
      return n;
    }));
  };

  // ----------------------------------------------------
  // PLATFORM ADMIN ACTIONS
  // ----------------------------------------------------
  const handleApproveRegistration = (regId: string) => {
    setRegistrations(prev => prev.map(r => 
      r.id === regId ? { ...r, status: 'Approved' } : r
    ));

    const approvedReg = registrations.find(r => r.id === regId);
    if (approvedReg) {
      // Create new nursery partner in live list
      const newNurseryId = `nursery-${Date.now()}`;
      const newNursery: Nursery = {
        id: newNurseryId,
        name: approvedReg.name,
        arabicName: approvedReg.arabicName,
        location: `${approvedReg.city}, KSA`,
        taxId: approvedReg.taxId,
        crNumber: approvedReg.crNumber,
        rating: 5.0,
        walletBalance: 0.0,
        settlementHistory: []
      };
      setNurseries(prev => [...prev, newNursery]);
    }
  };

  const handleRejectRegistration = (regId: string) => {
    setRegistrations(prev => prev.map(r => 
      r.id === regId ? { ...r, status: 'Rejected' } : r
    ));
  };


  return (
    <div className="h-screen overflow-hidden bg-gray-100 flex flex-col font-sans">
      
      {/* GLOBAL HEADER & PROMINENT PERSONA SWITCHER */}
      <header className="bg-white border-b border-gray-200 shadow-xs sticky top-0 z-40 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <span className="p-1.5 bg-[#4b5c09] text-white">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-gray-900 leading-tight">
                FLORA PORTALS
              </h1>
              <p className="text-[10px] text-[#4b5c09] font-bold font-mono tracking-widest uppercase">
                Saudi Botanical Market
              </p>
            </div>
          </div>

          {/* Persona Segmented Controller */}
          <div className="bg-gray-100 p-1 rounded-md flex border border-gray-200 overflow-x-auto scrollbar-none">
            {[
              { id: 'customer', label: 'Customer Portal', icon: User },
              { id: 'nursery', label: 'Nursery Partner', icon: Store },
              { id: 'admin', label: 'Platform Admin', icon: ShieldCheck }
            ].map((p) => {
              const IconComponent = p.icon;
              const isActive = selectedPersona === p.id;
              return (
                <button
                  key={p.id}
                  id={`persona-switch-${p.id}`}
                  onClick={() => setSelectedPersona(p.id as AppPersona)}
                  title={p.label}
                  className={`px-3 sm:px-4 py-1.5 text-xs font-bold tracking-wide flex items-center space-x-1.5 whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? 'bg-white text-[#4b5c09] rounded shadow-xs border border-gray-200' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{p.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* PORTALS WRAPPER */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {selectedPersona === 'customer' && (
            <motion.div
              key="customer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <CustomerPortal
                products={products}
                orders={orders}
                cart={cart}
                activeOrder={activeOrder}
                currentView={customerView}
                setView={setCustomerView}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateCartQty={handleUpdateCartQty}
                onCheckout={handleCheckout}
                onRateOrder={handleRateOrder}
                onSelectTrackOrder={setActiveOrder}
                onOpenInvoice={setActiveInvoiceOrder}
              />
            </motion.div>
          )}

          {selectedPersona === 'nursery' && (
            <motion.div
              key="nursery"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <NurseryPortal
                products={products}
                orders={orders}
                nurseries={nurseries}
                activeNurseryId={activeNurseryId}
                setActiveNurseryId={setActiveNurseryId}
                onUpdateProductStock={handleUpdateProductStock}
                onAddNurseryProduct={handleAddNurseryProduct}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onAcceptOrder={handleAcceptOrder}
                onRejectOrder={handleRejectOrder}
                onUploadInvoice={handleUploadInvoice}
                onOpenInvoice={setActiveInvoiceOrder}
                onRequestSettlement={handleRequestSettlement}
              />
            </motion.div>
          )}

          {selectedPersona === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <PlatformAdminPortal
                products={products}
                orders={orders}
                registrations={registrations}
                nurseries={nurseries}
                onApproveRegistration={handleApproveRegistration}
                onRejectRegistration={handleRejectRegistration}
                onOpenInvoice={setActiveInvoiceOrder}
                onUpdateProductStock={handleUpdateProductStock}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* COMPLIANT ZATCA INVOICE MODAL OVERLAY */}
      {activeInvoiceOrder && (
        <ZatcaInvoiceModal
          order={activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
        />
      )}

    </div>
  );
}

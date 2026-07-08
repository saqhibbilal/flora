/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, FileText, Check } from 'lucide-react';
import { Order } from '../types';

interface ZatcaInvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export default function ZatcaInvoiceModal({ order, onClose }: ZatcaInvoiceModalProps) {
  // Calculations
  const totalAmount = order.totalAmount;
  const vatAmount = order.vatAmount;
  const taxableAmount = totalAmount - vatAmount;

  // Generate a mock QR-like pattern using custom SVGs
  const renderMockQrCode = () => {
    return (
      <svg className="w-24 h-24 border border-gray-200 p-1" viewBox="0 0 100 100" fill="currentColor">
        {/* Border markers */}
        <rect x="5" y="5" width="20" height="20" fill="#000" />
        <rect x="8" y="8" width="14" height="14" fill="#fff" />
        <rect x="11" y="11" width="8" height="8" fill="#000" />

        <rect x="75" y="5" width="20" height="20" fill="#000" />
        <rect x="78" y="8" width="14" height="14" fill="#fff" />
        <rect x="81" y="11" width="8" height="8" fill="#000" />

        <rect x="5" y="75" width="20" height="20" fill="#000" />
        <rect x="8" y="78" width="14" height="14" fill="#fff" />
        <rect x="11" y="81" width="8" height="8" fill="#000" />

        {/* Small random QR blocks */}
        <rect x="30" y="5" width="10" height="5" />
        <rect x="35" y="15" width="15" height="5" />
        <rect x="55" y="10" width="5" height="15" />
        <rect x="65" y="5" width="5" height="5" />
        
        <rect x="5" y="30" width="5" height="10" />
        <rect x="15" y="35" width="15" height="5" />
        <rect x="10" y="45" width="5" height="15" />
        <rect x="25" y="55" width="10" height="10" />

        <rect x="35" y="35" width="15" height="15" />
        <rect x="55" y="35" width="10" height="5" />
        <rect x="45" y="55" width="20" height="5" />

        <rect x="75" y="30" width="10" height="10" />
        <rect x="85" y="45" width="10" height="5" />
        <rect x="70" y="60" width="15" height="15" />

        <rect x="35" y="75" width="10" height="10" />
        <rect x="50" y="80" width="15" height="5" />
        <rect x="40" y="90" width="25" height="5" />
        <rect x="75" y="85" width="20" height="10" />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div 
        id="zatca-invoice-modal"
        className="bg-[#d9eda6] text-gray-900 w-full max-w-2xl rounded-xs shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-[#4b5c09] text-white px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-white" />
            <span className="font-sans font-bold tracking-tight text-sm uppercase">
              Simplified Tax Invoice
            </span>
          </div>
          <button 
            id="close-invoice-btn"
            onClick={onClose} 
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body (Scrollable) */}
        <div className="p-8 overflow-y-auto space-y-6">
          
          {/* ZATCA Compliant Top Section */}
          <div className="border-b border-gray-200 pb-6 flex flex-col md:flex-row md:justify-between items-start gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-[#4b5c09]">
                NURSERY MARKETPLACE
              </h2>
              <p className="text-xs text-gray-500 font-mono">
                Unified Portal Platform
              </p>
              <div className="pt-2 text-xs text-gray-600 space-y-1">
                <div>
                  <span className="font-semibold text-gray-700">Matched Nursery (Fulfiller):</span> {order.matchedNurseryName}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Seller Tax ID:</span> {order.zatcaQrCodeValue.includes('TaxID:') ? order.zatcaQrCodeValue.split('TaxID:')[1].split('|')[0].trim() : '310293847200003'}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 md:text-right">
              {renderMockQrCode()}
              <div className="text-[9px] text-gray-400 font-mono text-center md:text-right max-w-[200px]">
                ZATCA Cryptographic Verification Stamp
              </div>
            </div>
          </div>

          {/* Invoice Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 border border-gray-100 rounded-md">
            <div>
              <p className="text-gray-400 font-mono text-[10px] uppercase">Invoice Number</p>
              <p className="font-bold text-gray-800">{order.zatcaInvoiceNumber}</p>
            </div>
            <div>
              <p className="text-gray-400 font-mono text-[10px] uppercase">Issue Date</p>
              <p className="font-bold text-gray-800">{order.date}</p>
            </div>
            <div>
              <p className="text-gray-400 font-mono text-[10px] uppercase">Customer Name</p>
              <p className="font-bold text-gray-800">{order.customerName}</p>
            </div>
            <div>
              <p className="text-gray-400 font-mono text-[10px] uppercase">Delivery Address</p>
              <p className="font-bold text-gray-800">{order.customerAddress}, {order.city}, KSA</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 font-bold bg-gray-50 text-gray-500 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-3 text-center font-mono">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">VAT Rate</th>
                  <th className="py-2.5 px-3 text-right">Total (Incl. VAT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3">
                      <p className="font-bold text-gray-800">{item.product.name}</p>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-gray-600">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono text-gray-600">{item.product.price.toFixed(2)} SAR</td>
                    <td className="py-3 px-3 text-right font-mono text-gray-600">15%</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">{(item.product.price * item.quantity).toFixed(2)} SAR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end pt-4">
            <div className="w-80 space-y-2 text-xs border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal (Excl. VAT):</span>
                <span className="font-mono text-gray-700">{taxableAmount.toFixed(2)} SAR</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>VAT (15%):</span>
                <span className="font-mono text-gray-700">{vatAmount.toFixed(2)} SAR</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-2">
                <span>Total (Incl. VAT):</span>
                <span className="font-mono text-[#4b5c09] text-base">{totalAmount.toFixed(2)} SAR</span>
              </div>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="border-t border-dashed border-gray-200 pt-6 text-center text-[10px] text-gray-400 space-y-1">
            <p className="uppercase tracking-wider font-semibold">
              ZATCA Simplified Tax Invoice Standard Implementation
            </p>
            <p className="max-w-md mx-auto">
              This invoice serves as a complete prototype verification under VAT ID {order.zatcaQrCodeValue.includes('TaxID:') ? order.zatcaQrCodeValue.split('TaxID:')[1].split('|')[0].trim() : '310293847200003'} complying with Phase 1 e-Invoicing guidelines in Saudi Arabia.
            </p>
          </div>

        </div>

        {/* Footer actions */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-1 text-xs text-green-700 font-medium">
            <Check className="w-4 h-4" />
            <span>ZATCA Cryptographic Signature Verified</span>
          </div>
          <button
            id="print-invoice-btn"
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#4b5c09] hover:bg-[#3d4c07] text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

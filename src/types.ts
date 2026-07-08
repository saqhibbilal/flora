/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  arabicName: string;
  category: string;
  price: number; // In SAR, VAT inclusive
  vatRate: number; // Usually 0.15 for 15%
  image: string;
  description: string;
  arabicDescription: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  size: string; // e.g. "Small", "Medium", "Large"
  matchedNurseryId: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Received' | 'Preparing' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  city: string;
  items: CartItem[];
  totalAmount: number; // SAR, includes VAT
  vatAmount: number; // SAR
  status: OrderStatus;
  paymentMethod: 'mada' | 'visa' | 'mastercard';
  matchedNurseryId: string;
  matchedNurseryName: string;
  matchingRuleApplied: string;
  zatcaInvoiceNumber: string;
  zatcaQrCodeValue: string;
  deliveryRating?: number;
  productRating?: number;
  ratingFeedback?: string;
  invoiceUploadedByNursery?: boolean;
  invoiceUrl?: string;
}

export interface Nursery {
  id: string;
  name: string;
  arabicName: string;
  location: string;
  taxId: string;
  crNumber: string;
  rating: number;
  walletBalance: number;
  settlementHistory: {
    id: string;
    date: string;
    amount: number;
    status: 'Transferred' | 'Pending';
    referenceNumber: string;
    bankName: string;
  }[];
}

export interface NurseryRegistration {
  id: string;
  name: string;
  arabicName: string;
  ownerName: string;
  crNumber: string;
  taxId: string;
  phone: string;
  email: string;
  city: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
}

export type AppPersona = 'customer' | 'nursery' | 'admin';

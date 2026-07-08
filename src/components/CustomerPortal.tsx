/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  CheckCircle, 
  Truck, 
  Package, 
  Star, 
  FileText, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Product, CartItem, Order, OrderStatus } from '../types';
import { CATEGORIES, SAUDI_CITIES } from '../data';

interface CustomerPortalProps {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  activeOrder: Order | null;
  currentView: 'browse' | 'cart' | 'checkout' | 'success' | 'tracking' | 'profile';
  setView: (view: 'browse' | 'cart' | 'checkout' | 'success' | 'tracking' | 'profile') => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateCartQty: (productId: string, quantity: number) => void;
  onCheckout: (details: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    paymentMethod: 'mada' | 'visa' | 'mastercard';
  }) => void;
  onRateOrder: (orderId: string, deliveryRating: number, productRating: number, feedback: string) => void;
  onSelectTrackOrder: (order: Order) => void;
  onOpenInvoice: (order: Order) => void;
}

const CAROUSEL_SLIDES = [
  {
    title: "Saudi Botanical Excellence",
    subtitle: "DIRECT FROM ACCREDITED LOCAL NURSERIES",
    description: "Experience smart, dynamic routing that dispatches your plant orders straight from local growers near you. Minimizes transport stress, preserves moisture, and builds local biodiversity.",
    tag: "Botanical Sourcing Engine",
    offer: "100% Quality & Match Guarantee",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200",
    badgeColor: "bg-[#6a760c] text-white border border-[#a3b361]"
  },
  {
    title: "Greening The Kingdom",
    subtitle: "LIMITED NATIONAL ENVIRONMENTAL CAMPAIGN OFFERS",
    description: "Get native, desert-hardy palms, indoor oxygenators, and flowering shrubs at exclusive rates. Curated specifically for KSA seasonal shifts and watering conservation.",
    tag: "National Campaign",
    offer: "Up to 20% Off on Selected Bulks",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1200",
    badgeColor: "bg-[#6a760c] text-white border border-[#a3b361]"
  },
  {
    title: "Over 250+ Premium Varieties",
    subtitle: "FROM THE COALITION OF LICENSED DOMESTIC GROWERS",
    description: "From Riyadh's signature desert-hardy acacia to pristine coastal bougainvilleas, browse plant varieties backed by official nursery compliance registers.",
    tag: "Extensive Range",
    offer: "Complimentary Expert Guide Included",
    image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=1200",
    badgeColor: "bg-[#6a760c] text-white border border-[#a3b361]"
  }
];

export default function CustomerPortal({
  products,
  orders,
  cart,
  activeOrder,
  currentView,
  setView,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQty,
  onCheckout,
  onRateOrder,
  onSelectTrackOrder,
  onOpenInvoice
}: CustomerPortalProps) {
  // Local state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Plants');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);
  
  // Checkout Form State
  const [checkoutName, setCheckoutName] = useState('Mohammed Al-Dosari');
  const [checkoutPhone, setCheckoutPhone] = useState('+966 50 882 1928');
  const [checkoutEmail, setCheckoutEmail] = useState('mohammed.dosari@outlook.com');
  const [checkoutAddress, setCheckoutAddress] = useState('Al-Malqa District, Street 4, Villa 18B');
  const [checkoutCity, setCheckoutCity] = useState('Riyadh');
  const [checkoutPayment, setCheckoutPayment] = useState<'mada' | 'visa' | 'mastercard'>('mada');

  // Rating Form State
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [productRating, setProductRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Auto-slide effect with a subtle interval for the hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.arabicName.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All Plants' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartVat = cartTotal - (cartTotal / 1.15); // 15% VAT included

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckout({
      name: checkoutName,
      phone: checkoutPhone,
      email: checkoutEmail,
      address: checkoutAddress,
      city: checkoutCity,
      paymentMethod: checkoutPayment
    });
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOrder) {
      onRateOrder(activeOrder.id, deliveryRating, productRating, feedbackText);
      setRatingSubmitted(true);
    }
  };

  return (
    <div className="flex h-full bg-gray-50 text-gray-900 overflow-hidden">
      
      {/* Sub-navigation Left Sidebar for Customer Views */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#4b5c09] flex flex-col justify-between shrink-0 border-r border-[#5a6b10] transition-all duration-300`}>
        <div>
          <div className={`border-b border-[#5a6b10] flex items-center justify-between ${sidebarCollapsed ? 'p-3' : 'p-6'}`}>
            {!sidebarCollapsed && (
              <div className="space-y-1 min-w-0">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#a3b361]">
                  Customer Portal
                </h2>
                <p className="text-base font-bold font-sans tracking-tight text-white uppercase truncate">
                  Flora Boutique
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
              id="cust-nav-browse"
              onClick={() => { setView('browse'); setRatingSubmitted(false); }}
              title="Browse Plants"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 text-xs font-bold rounded cursor-pointer transition-colors ${
                currentView === 'browse' || currentView === 'success'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              {!sidebarCollapsed && ((currentView === 'browse' || currentView === 'success') ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
              ))}
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 text-left">Browse Plants</span>}
            </button>

            <button
              id="cust-nav-cart"
              onClick={() => { setView('cart'); }}
              title="Shopping Cart"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 text-xs font-bold rounded cursor-pointer transition-colors ${
                currentView === 'cart' || currentView === 'checkout'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              <div className={`flex items-center ${sidebarCollapsed ? '' : 'space-x-3'} relative`}>
                {!sidebarCollapsed && ((currentView === 'cart' || currentView === 'checkout') ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
                ))}
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                {!sidebarCollapsed && <span className="text-left">Shopping Cart</span>}
                {sidebarCollapsed && cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 px-1 py-0.5 text-[8px] leading-none font-mono font-bold rounded bg-[#a3b361] text-white">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)}
                  </span>
                )}
              </div>
              {!sidebarCollapsed && cart.length > 0 && (
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-[#a3b361] text-white">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>

            <button
              id="cust-nav-tracking"
              onClick={() => {
                // Select the last order to track if none is selected
                if (!activeOrder && orders.length > 0) {
                  onSelectTrackOrder(orders[orders.length - 1]);
                }
                setView('tracking');
                setRatingSubmitted(false);
              }}
              title="Order Tracking"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 text-xs font-bold rounded cursor-pointer transition-colors ${
                currentView === 'tracking'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              {!sidebarCollapsed && (currentView === 'tracking' ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
              ))}
              <Truck className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 text-left">Order Tracking</span>}
            </button>

            <button
              id="cust-nav-profile"
              onClick={() => {
                setView('profile');
                setRatingSubmitted(false);
                setProfileSavedMsg(false);
              }}
              title="User Profile"
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 text-xs font-bold rounded cursor-pointer transition-colors ${
                currentView === 'profile'
                  ? 'bg-[#5a6b10] text-white shadow-sm'
                  : 'text-[#d1dbb0] hover:bg-[#5a6b10] hover:text-white'
              }`}
            >
              {!sidebarCollapsed && (currentView === 'profile' ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent border border-[#d1dbb0] shrink-0"></div>
              ))}
              <User className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="flex-1 text-left">User Profile</span>}
            </button>
          </nav>
        </div>

        {/* VAT Guarantee box */}
        {!sidebarCollapsed && (
          <div className="p-4 m-4 bg-[#5a6b10]/30 border border-[#5a6b10]/60 rounded">
            <div className="flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#a3b361] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Matched Dispatch</h4>
                <p className="text-[10px] text-[#d1dbb0] leading-relaxed">
                  Prices include standard 15% VAT. Partners are allocated dynamically to support local greenery.
                </p>
                <p className="text-[9px] text-[#a3b361] font-bold font-mono">
                  الأسعار تشمل ضريبة القيمة المضافة ١٥٪
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        
        {/* TOP BAR / BROWSE UTILITIES */}
        {currentView === 'browse' && (
          <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div className="flex-1 max-w-lg relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-4 h-4 text-gray-400" />
              </span>
              <input
                id="search-plants"
                type="text"
                placeholder="Search plants by name... / ابحث عن نباتات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border border-gray-200 pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#4b5c09] focus:bg-white"
              />
            </div>

            {/* Category horizontal bar */}
            <div className="flex space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap border cursor-pointer transition-colors rounded-md ${
                    selectedCategory === cat
                      ? 'bg-[#4b5c09] text-white border-[#4b5c09]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* INNER SCROLL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          
          {/* VIEW: CATALOGUE */}
          {currentView === 'browse' && (
            <div className="space-y-8">
              
              {/* SHARP HERO BANNER CAROUSEL */}
              <div className="relative overflow-hidden bg-slate-950 text-white p-8 md:p-10 shadow-lg border border-slate-800 rounded-xl transition-all duration-700 select-none flex flex-col justify-between min-h-[260px]">
                {/* High-resolution Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={CAROUSEL_SLIDES[currentSlide].image} 
                    alt={CAROUSEL_SLIDES[currentSlide].title} 
                    className="w-full h-full object-cover transition-all duration-700 scale-102 brightness-[0.35]" 
                    referrerPolicy="no-referrer"
                  />
                  {/* Premium protective overlay gradient featuring the signature #6a760c (olive green) theme */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-[#6a760c]/45 to-slate-950/90 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                </div>
                
                {/* Background botanical subtle grid pattern on top of overlay */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6a760c_1.5px,transparent_1.5px)] [background-size:24px_24px] z-0" />
                
                {/* Slide content block */}
                <div className="relative z-10 space-y-4 max-w-2xl bg-slate-950/40 backdrop-blur-[2px] p-4 rounded-lg border border-white/5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-white bg-[#6a760c] border border-[#a3b361]/30 px-2 py-0.5 rounded-md">
                      {CAROUSEL_SLIDES[currentSlide].tag}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${CAROUSEL_SLIDES[currentSlide].badgeColor}`}>
                      {CAROUSEL_SLIDES[currentSlide].offer}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono tracking-wider text-slate-300 font-bold uppercase">
                      {CAROUSEL_SLIDES[currentSlide].subtitle}
                    </p>
                    <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-white font-sans uppercase">
                      {CAROUSEL_SLIDES[currentSlide].title}
                    </h2>
                  </div>
                  
                  <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                    {CAROUSEL_SLIDES[currentSlide].description}
                  </p>
                </div>

                {/* Controls and Dots */}
                <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800/80 mt-6 bg-slate-950/30 px-4 py-2 rounded-md">
                  {/* Clickable Dots */}
                  <div className="flex space-x-1.5">
                    {CAROUSEL_SLIDES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                          currentSlide === i ? 'bg-[#a3b361] w-6' : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => setCurrentSlide(prev => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)}
                      className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all cursor-pointer shadow-md"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide(prev => (prev + 1) % CAROUSEL_SLIDES.length)}
                      className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all cursor-pointer shadow-md"
                      aria-label="Next Slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Left vertical brand accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6a760c]" />
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h1 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
                  Plant Collection
                </h1>
                <p className="text-xs text-gray-500">
                  Showing {filteredProducts.length} nursery plants matching Saudi standard rules.
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-gray-200 p-12 text-center rounded-md space-y-2">
                  <p className="text-gray-500 text-sm">No products found matching your search criteria.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All Plants'); }}
                    className="text-xs font-bold text-[#4b5c09] underline"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((p) => (
                    <div 
                      key={p.id} 
                      className="bg-white border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md hover:border-gray-300 transition-all rounded-md"
                    >
                      {/* Image container */}
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        <img 
                          src={p.image} 
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                        <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs px-2 py-1 text-[9px] font-bold font-mono tracking-wider border border-gray-200 text-gray-700 rounded-sm">
                          {p.size}
                        </span>
                      </div>

                      {/* Info Container */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{p.category}</p>
                          <h3 className="text-sm font-extrabold text-gray-900 font-sans group-hover:text-[#4b5c09] transition-colors">
                            {p.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">{p.arabicName}</p>
                          
                          <div className="flex items-center space-x-1 pt-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold font-mono text-gray-700">{p.rating}</span>
                            <span className="text-[10px] text-gray-400">({p.reviewsCount})</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-end justify-between">
                          <div>
                            <p className="text-sm font-bold font-mono text-gray-900">
                              {p.price.toFixed(2)} SAR
                            </p>
                            <p className="text-[9px] text-gray-400 uppercase">
                              VAT Inc
                            </p>
                          </div>

                          <div className="flex space-x-1">
                            <button
                              onClick={() => setSelectedProduct(p)}
                              className="px-2.5 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-[11px] font-bold cursor-pointer rounded-md transition-colors"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => onAddToCart(p)}
                              className="px-3 py-1.5 bg-[#4b5c09] text-white text-[11px] font-bold hover:bg-[#3d4c07] transition-colors cursor-pointer rounded-md"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: SHOPPING CART */}
          {currentView === 'cart' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h1 className="text-xl font-bold text-gray-900 uppercase">Your Cart</h1>
                <p className="text-xs text-gray-500">Review your plants before proceeding to secure Saudi checkout.</p>
              </div>

              {cart.length === 0 ? (
                <div className="bg-white border border-gray-200 p-12 text-center rounded-md space-y-4">
                  <p className="text-gray-500 text-sm">Your shopping cart is currently empty.</p>
                  <button
                    onClick={() => setView('browse')}
                    className="px-4 py-2 bg-[#4b5c09] text-white text-xs font-bold hover:bg-[#3d4c07] transition-colors rounded-md cursor-pointer"
                  >
                    Go Browse Plants
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Cart Items List */}
                  <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                      <div 
                        key={item.product.id} 
                        className="bg-white border border-gray-200 p-4 rounded-md flex items-center space-x-4"
                      >
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover border border-gray-100 rounded-md"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{item.product.name}</h4>
                          <p className="text-xs font-mono font-bold text-[#4b5c09] mt-1">
                            {item.product.price.toFixed(2)} SAR <span className="text-[9px] text-gray-400 font-normal">Inc VAT</span>
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 bg-gray-50 rounded-md">
                          <button
                            onClick={() => onUpdateCartQty(item.product.id, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded-l-md cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 py-1 text-xs font-bold font-mono">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateCartQty(item.product.id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded-r-md cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Summary Card */}
                  <div className="bg-white border border-gray-200 p-6 rounded-md flex flex-col justify-between h-fit space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                        Order Summary
                      </h3>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-gray-600">
                          <span>Items Subtotal:</span>
                          <span className="font-mono">{(cartTotal - cartVat).toFixed(2)} SAR</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Calculated VAT (15%):</span>
                          <span className="font-mono">{cartVat.toFixed(2)} SAR</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Delivery (Standard):</span>
                          <span className="font-mono font-bold text-green-700">FREE</span>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold text-gray-900">
                          <span>Total Amount:</span>
                          <span className="font-mono text-[#4b5c09]">{cartTotal.toFixed(2)} SAR</span>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 border border-gray-100 rounded-md text-[10px] text-gray-500 leading-relaxed space-y-1">
                        <p className="font-bold text-gray-700">Match Guarantee</p>
                        <p>Our intelligent system matches your order with the most appropriate high-quality local nursery behind the scenes.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setView('checkout')}
                      className="w-full py-2.5 bg-[#4b5c09] text-white text-xs font-bold hover:bg-[#3d4c07] transition-all rounded-md flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: CHECKOUT FORM */}
          {currentView === 'checkout' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h1 className="text-xl font-bold text-gray-900 uppercase">Secure Checkout</h1>
                <p className="text-xs text-gray-500">Provide shipping and payment details. All transactions are simulated for display purposes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Billing/Shipping Form */}
                <form onSubmit={handleCheckoutSubmit} className="md:col-span-2 space-y-4 bg-white border border-gray-200 p-6 rounded-md">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 mb-4">
                    Shipping & Tax Information
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-gray-600 mb-1 font-bold">Customer Full Name</label>
                      <input
                        type="text"
                        required
                        value={checkoutName}
                        onChange={(e) => setCheckoutName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] focus:bg-white transition-all text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={checkoutPhone}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          placeholder="+966 5x xxx xxxx"
                          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] focus:bg-white transition-all text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">Email Address</label>
                        <input
                          type="email"
                          required
                          value={checkoutEmail}
                          onChange={(e) => setCheckoutEmail(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] focus:bg-white transition-all text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">City</label>
                        <select
                          value={checkoutCity}
                          onChange={(e) => setCheckoutCity(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] focus:bg-white transition-all text-xs cursor-pointer"
                        >
                          {SAUDI_CITIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">Full Delivery Address</label>
                        <input
                          type="text"
                          required
                          value={checkoutAddress}
                          onChange={(e) => setCheckoutAddress(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] focus:bg-white transition-all text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment selection */}
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-700 mb-3">Payment Method</h4>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {/* MADA PAYMENT BAR */}
                      <label className={`border rounded-lg p-3 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                        checkoutPayment === 'mada' ? 'border-[#4b5c09] bg-green-50/20 shadow-xs' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={checkoutPayment === 'mada'} 
                          onChange={() => setCheckoutPayment('mada')} 
                          className="sr-only" 
                        />
                        {/* Custom mada logo style */}
                        <div className="h-6 flex items-center space-x-1 px-2 py-0.5 rounded bg-gradient-to-r from-blue-600 via-sky-500 to-green-500 text-[10px] font-black text-white uppercase italic tracking-tighter">
                          <span>mada</span>
                        </div>
                        <span className="text-[9px] text-gray-500 font-medium">Local Debit</span>
                      </label>

                      {/* VISA PAYMENT BAR */}
                      <label className={`border rounded-lg p-3 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                        checkoutPayment === 'visa' ? 'border-[#4b5c09] bg-green-50/20 shadow-xs' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={checkoutPayment === 'visa'} 
                          onChange={() => setCheckoutPayment('visa')} 
                          className="sr-only" 
                        />
                        {/* Custom Visa logo style */}
                        <div className="h-6 flex items-center justify-center px-2 py-0.5 rounded bg-[#1a1f71] text-white font-extrabold italic tracking-tight text-[11px]">
                          <span className="text-amber-400">V</span><span>ISA</span>
                        </div>
                        <span className="text-[9px] text-gray-500 font-medium">Credit Card</span>
                      </label>

                      {/* MASTERCARD PAYMENT BAR */}
                      <label className={`border rounded-lg p-3 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                        checkoutPayment === 'mastercard' ? 'border-[#4b5c09] bg-green-50/20 shadow-xs' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={checkoutPayment === 'mastercard'} 
                          onChange={() => setCheckoutPayment('mastercard')} 
                          className="sr-only" 
                        />
                        {/* Custom MasterCard logo style */}
                        <div className="h-6 flex items-center justify-center space-x-[-4px]">
                          <div className="w-4 h-4 rounded-full bg-[#eb001b] opacity-90"></div>
                          <div className="w-4 h-4 rounded-full bg-[#ff5f00] opacity-90"></div>
                        </div>
                        <span className="text-[9px] text-gray-500 font-medium">Credit Card</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-2.5 bg-[#4b5c09] text-white text-xs font-bold hover:bg-[#3d4c07] transition-all rounded-md cursor-pointer"
                  >
                    Confirm simulated payment of {cartTotal.toFixed(2)} SAR
                  </button>
                </form>

                {/* mini summary */}
                <div className="bg-white border border-gray-200 p-6 h-fit space-y-4 rounded-md">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                    Review Order
                  </h4>

                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-gray-800">{item.product.name} (x{item.quantity})</p>
                        </div>
                        <span className="font-mono text-gray-600">{(item.product.price * item.quantity).toFixed(2)} SAR</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal (Excl. VAT):</span>
                      <span className="font-mono">{(cartTotal - cartVat).toFixed(2)} SAR</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>VAT (15%):</span>
                      <span className="font-mono">{cartVat.toFixed(2)} SAR</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                      <span>Total:</span>
                      <span className="font-mono text-[#4b5c09]">{cartTotal.toFixed(2)} SAR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ORDER SUCCESS & SILENT MATCHING EXPLANATION */}
          {currentView === 'success' && activeOrder && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white border border-gray-200 p-8 text-center space-y-6 rounded-md">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-700 rounded-full">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-xl font-bold text-gray-900 uppercase">Payment Successful</h1>
                  <p className="text-xs text-green-700 font-mono">Reference ID: {activeOrder.id} | Authorized via {activeOrder.paymentMethod.toUpperCase()}</p>
                  <p className="text-xs text-gray-500 font-medium">Thank you, {activeOrder.customerName}. Your nursery order has been recorded successfully!</p>
                </div>

                {/* Highlight of Silent Matching Logic for the Client */}
                <div className="bg-amber-50 border border-amber-200 p-5 text-left space-y-3 rounded-md">
                  <div className="flex items-center space-x-2 text-amber-800">
                    <HelpCircle className="w-5 h-5 shrink-0" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Prototype Insight: Silent Matching Mechanism
                    </h3>
                  </div>
                  
                  <div className="text-xs text-amber-900 space-y-2 leading-relaxed">
                    <p>
                      <strong>How it works:</strong> The customer pays standard uniform prices on the marketplace. Behind the scenes, our platform automatically matched this order with:
                    </p>
                    <div className="bg-white p-3 border border-amber-100 rounded-md font-mono text-[11px] text-gray-800 space-y-1.5">
                      <div><strong>Assigned Nursery:</strong> {activeOrder.matchedNurseryName}</div>
                      <div><strong>Nursery Location:</strong> {activeOrder.city} area dispatch</div>
                      <div><strong>Matching Rule:</strong> {activeOrder.matchingRuleApplied}</div>
                    </div>
                    <p className="text-[10px] text-amber-700 italic">
                      Note: The customer is never shown which nursery is fulfilling the order. To them, the brand is purely Flora Boutique. You can verify this order inside the <strong>Nursery View</strong> or <strong>Platform Admin View</strong>.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center space-x-3 pt-2">
                  <button
                    onClick={() => setView('tracking')}
                    className="px-4 py-2 bg-[#4b5c09] text-white text-xs font-bold hover:bg-[#3d4c07] transition-colors rounded-md cursor-pointer"
                  >
                    Track Delivery Status
                  </button>
                  <button
                    onClick={() => onOpenInvoice(activeOrder)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors rounded-md flex items-center space-x-1 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View ZATCA Invoice</span>
                  </button>
                  <button
                    onClick={() => { setView('browse'); setRatingSubmitted(false); }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 text-xs font-bold hover:bg-gray-300 transition-colors rounded-md cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ORDER TRACKING & RATING FEEDBACK */}
          {currentView === 'tracking' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h1 className="text-xl font-bold text-gray-900 uppercase">Track Active Order</h1>
                <p className="text-xs text-gray-500">Monitor your order lifecycle from matching to dispatch. Experience the Saudi botanical delivery loop.</p>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white border border-gray-200 p-12 text-center rounded-md">
                  <p className="text-gray-500 text-xs font-medium">No orders placed in this session yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Active order selector */}
                  <div className="flex items-center space-x-2 overflow-x-auto py-1">
                    <span className="text-xs text-gray-500 font-bold whitespace-nowrap">Select Order:</span>
                    {orders.map((ord) => (
                      <button
                        key={ord.id}
                        onClick={() => {
                          onSelectTrackOrder(ord);
                          setRatingSubmitted(false);
                        }}
                        className={`px-3 py-1 text-xs font-mono border cursor-pointer rounded-md whitespace-nowrap transition-colors ${
                          activeOrder?.id === ord.id
                            ? 'bg-[#4b5c09] text-white border-[#4b5c09]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {ord.id} ({ord.status})
                      </button>
                    ))}
                  </div>

                  {activeOrder && (
                    <div className="bg-white border border-gray-200 p-6 rounded-md space-y-6">
                      {/* Top metadata */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 pb-4 gap-2">
                        <div className="space-y-1">
                          <p className="text-xs font-mono text-[#4b5c09] font-bold">ORDER REF: {activeOrder.id}</p>
                          <p className="text-[11px] text-gray-400">Placed: {activeOrder.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onOpenInvoice(activeOrder)}
                            className="px-3 py-1.5 border border-[#4b5c09] text-[#4b5c09] text-xs font-bold hover:bg-green-50 rounded-md transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Tax Invoice</span>
                          </button>
                          <span className="px-3 py-1.5 bg-gray-100 border border-gray-200 text-xs font-mono font-bold uppercase rounded-md text-gray-800">
                            {activeOrder.status}
                          </span>
                        </div>
                      </div>

                      {/* PROGRESS BAR STAGE */}
                      <div className="relative py-6">
                        {/* Connecting Line */}
                        <div className="absolute top-[39px] left-8 right-8 h-1 bg-gray-200 -z-0 rounded" />
                        <div 
                          className="absolute top-[39px] left-8 h-1 bg-[#4b5c09] transition-all duration-500 -z-0 rounded"
                          style={{
                            width: activeOrder.status === 'Received' ? '0%' :
                                   activeOrder.status === 'Preparing' ? '33%' :
                                   activeOrder.status === 'Shipped' ? '66%' : '100%'
                          }}
                        />

                        {/* Stages Nodes */}
                        <div className="relative z-10 flex justify-between">
                          {[
                            { key: 'Received', label: 'Order Placed', icon: Clock },
                            { key: 'Preparing', label: 'Preparing', icon: Package },
                            { key: 'Shipped', label: 'In Transit', icon: Truck },
                            { key: 'Delivered', label: 'Delivered', icon: CheckCircle },
                          ].map((stage, idx) => {
                            const isCompleted = 
                              (activeOrder.status === 'Received' && idx <= 0) ||
                               (activeOrder.status === 'Preparing' && idx <= 1) ||
                               (activeOrder.status === 'Shipped' && idx <= 2) ||
                               (activeOrder.status === 'Delivered');
                            
                            const IconComp = stage.icon;
                            
                            return (
                              <div key={stage.key} className="flex flex-col items-center space-y-1.5 text-center w-1/4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isCompleted
                                    ? 'bg-[#4b5c09] text-white border-[#4b5c09]'
                                    : 'bg-white text-gray-300 border-gray-200'
                                }`}>
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className={`text-[11px] font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{stage.label}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items & Shipping summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Shipment Details</h4>
                          <div className="space-y-2 text-xs text-gray-600">
                            <p><span className="font-semibold text-gray-800">Recipient:</span> {activeOrder.customerName}</p>
                            <p><span className="font-semibold text-gray-800">Phone:</span> {activeOrder.customerPhone}</p>
                            <p><span className="font-semibold text-gray-800">Address:</span> {activeOrder.customerAddress}, {activeOrder.city}</p>
                            <p><span className="font-semibold text-gray-800">Courier:</span> Integrated Platform Dispatch</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Order Contents</h4>
                          <div className="space-y-2">
                            {activeOrder.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs text-gray-700">
                                <span className="truncate max-w-[200px]">{item.product.name} (x{item.quantity})</span>
                                <span className="font-mono text-gray-900 font-semibold">{(item.product.price * item.quantity).toFixed(2)} SAR</span>
                              </div>
                            ))}
                            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900 text-xs">
                              <span>Total Paid:</span>
                              <span className="font-mono text-[#4b5c09]">{activeOrder.totalAmount.toFixed(2)} SAR</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* FEEDBACK / RATING COMPONENT (Only shown if delivered) */}
                      {activeOrder.status === 'Delivered' && (
                        <div className="border-t border-gray-200 pt-6 mt-6 bg-gray-50 p-4 rounded-md">
                          {!ratingSubmitted && !activeOrder.productRating ? (
                            <form onSubmit={handleRatingSubmit} className="space-y-4">
                              <h3 className="text-xs font-bold text-gray-900 uppercase">
                                Rate Your Order & Products
                              </h3>
                              <p className="text-[11px] text-gray-500">Your feedback helps nurseries maintain exceptional quality standards across the Kingdom.</p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Delivery Rating */}
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium text-gray-700">Delivery & Logistics Rating</label>
                                  <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        type="button"
                                        key={star}
                                        onClick={() => setDeliveryRating(star)}
                                        className="p-1 cursor-pointer"
                                      >
                                        <Star className={`w-5 h-5 ${star <= deliveryRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Product Quality Rating */}
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium text-gray-700">Plant & Product Quality Rating</label>
                                  <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        type="button"
                                        key={star}
                                        onClick={() => setProductRating(star)}
                                        className="p-1 cursor-pointer"
                                      >
                                        <Star className={`w-5 h-5 ${star <= productRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-xs font-medium text-gray-700">Feedback Review</label>
                                <textarea
                                  rows={2}
                                  placeholder="How were the plants? Are they healthy? ..."
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                  className="w-full text-xs bg-white border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09]"
                                />
                              </div>

                              <button
                                type="submit"
                                className="px-4 py-2 bg-[#4b5c09] text-white text-xs font-bold hover:bg-[#3d4c07] rounded-md cursor-pointer"
                              >
                                Submit Quality Feedback
                              </button>
                            </form>
                          ) : (
                            <div className="text-center py-4 text-xs font-medium text-green-700 space-y-1">
                              <CheckCircle className="w-8 h-8 text-green-700 mx-auto" />
                              <p className="font-bold text-gray-900 mt-2">Thank you! Your feedback has been submitted successfully.</p>
                              <p className="text-gray-500 font-normal">Ratings: Delivery ({activeOrder.deliveryRating || deliveryRating}★) | Product ({activeOrder.productRating || productRating}★)</p>
                              {feedbackText && <p className="text-gray-600 font-mono italic mt-1">"{feedbackText}"</p>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW: USER PROFILE */}
          {currentView === 'profile' && (
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-4">
                <h1 className="text-xl font-bold text-gray-900 uppercase">Your Profile</h1>
                <p className="text-xs text-gray-500">Manage your delivery addresses, billing coordinates, and dispatch regional routing rules.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Form */}
                <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-md space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">
                    Personal Settings & Delivery Destination
                  </h3>
                  
                  {profileSavedMsg && (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-3 text-xs font-bold rounded-md flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-700" />
                      <span>Profile updated successfully! These details will automatically auto-populate checkout requests.</span>
                    </div>
                  )}

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setProfileSavedMsg(true);
                    }} 
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="block font-semibold text-gray-600">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={checkoutName}
                          onChange={(e) => {
                            setCheckoutName(e.target.value);
                            setProfileSavedMsg(false);
                          }}
                          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded-md text-xs font-medium"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-semibold text-gray-600">Saudi Phone Number</label>
                        <input 
                          type="text" 
                          required
                          value={checkoutPhone}
                          onChange={(e) => {
                            setCheckoutPhone(e.target.value);
                            setProfileSavedMsg(false);
                          }}
                          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded-md text-xs font-mono font-medium"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-semibold text-gray-600">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={checkoutEmail}
                          onChange={(e) => {
                            setCheckoutEmail(e.target.value);
                            setProfileSavedMsg(false);
                          }}
                          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded-md text-xs font-mono font-medium"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-semibold text-gray-600">Default Dispatch City</label>
                        <select 
                          value={checkoutCity}
                          onChange={(e) => {
                            setCheckoutCity(e.target.value);
                            setProfileSavedMsg(false);
                          }}
                          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded-md text-xs font-bold text-gray-700"
                        >
                          {SAUDI_CITIES.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="block font-semibold text-gray-600">Standard Delivery Street Address</label>
                      <textarea 
                        required
                        rows={3}
                        value={checkoutAddress}
                        onChange={(e) => {
                          setCheckoutAddress(e.target.value);
                          setProfileSavedMsg(false);
                        }}
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4b5c09] rounded-md text-xs font-medium"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit"
                        className="px-5 py-2 bg-[#4b5c09] hover:bg-[#3d4c07] text-white text-xs font-bold rounded-md cursor-pointer transition-colors"
                      >
                        Save Profile Settings
                      </button>
                    </div>
                  </form>
                </div>

                {/* Account details & info sidebar */}
                <div className="space-y-6">
                  {/* Platinum Partner Status */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-md text-white space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#a3b361]/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono font-bold text-[#a3b361] tracking-widest uppercase">Verified Buyer Certificate</p>
                      <h4 className="text-base font-bold font-sans uppercase">Premium Green Tier</h4>
                    </div>

                    <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">VAT Credit Status</span>
                        <span className="text-green-400 font-bold">15.0% Standard Active</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Total Purchases</span>
                        <span className="text-white font-bold">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Account Verified</span>
                        <span className="text-[#a3b361] font-bold">KSA National Single Sign-On</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-3 border border-slate-800 rounded text-[10px] text-slate-400 leading-relaxed font-mono">
                      Your identity and default settings are registered in compliance with Saudi ecommerce rules.
                    </div>
                  </div>

                  {/* Quick Order History Link */}
                  <div className="bg-white border border-gray-200 p-6 rounded-md space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                      Recent Shipments
                    </h4>
                    
                    {orders.length === 0 ? (
                      <p className="text-xs text-gray-400">No previous orders recorded.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {orders.slice(-3).reverse().map((order) => (
                          <div 
                            key={order.id} 
                            onClick={() => {
                              onSelectTrackOrder(order);
                              setView('tracking');
                            }}
                            className="p-2.5 border border-gray-100 hover:border-gray-300 hover:bg-gray-50 rounded-md cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div className="space-y-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 font-mono">{order.id}</p>
                              <p className="text-[10px] text-gray-400">{order.date}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* DETAIL MODAL OVERLAY */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-gray-900 w-full max-w-md rounded-lg overflow-hidden shadow-xl border border-gray-200">
            <div className="p-5 space-y-4">
              <div className="relative aspect-video bg-gray-100 overflow-hidden border border-gray-100 rounded-md">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-gray-900">{selectedProduct.name}</h3>
                  <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 font-mono text-[9px] font-bold text-gray-700 uppercase rounded">
                    {selectedProduct.size} Size
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-gray-600">
                <p>{selectedProduct.description}</p>
              </div>

              <div className="bg-gray-50 p-3 border border-gray-100 rounded-md grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-400">Category</p>
                  <p className="font-bold text-gray-800">{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-gray-400">Fulfillment Match</p>
                  <p className="font-bold text-[#4b5c09]">Optimal Regional Nursery</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-base font-bold font-mono text-[#4b5c09]">
                    {selectedProduct.price.toFixed(2)} SAR
                  </p>
                  <p className="text-[9px] text-gray-400">
                    Includes 15% VAT
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold rounded-md cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      onAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="px-3 py-1.5 bg-[#4b5c09] text-white text-xs font-bold hover:bg-[#3d4c07] transition-colors rounded-md cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

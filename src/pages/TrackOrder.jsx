import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Printer,
  AlertCircle,
  HelpCircle,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { sampleOrders } from '../data/mockData';

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const [inputVal, setInputVal] = useState(queryId);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  // Load user placed orders from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('digital_dokan_orders');
      if (stored) {
        setUserOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load local orders', e);
    }
  }, []);

  // When query param changes or on mount, search only if queryId exists
  useEffect(() => {
    if (queryId) {
      setInputVal(queryId);
      performSearch(queryId);
    } else {
      // Do not auto-show any order if user has not searched yet
      setCurrentOrder(null);
      setSearched(false);
      setInputVal('');
    }
  }, [queryId]);

  const performSearch = (searchTerm) => {
    const term = searchTerm.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!term) {
      setCurrentOrder(null);
      setSearched(false);
      return;
    }

    // Search in user orders from localStorage first
    let found = userOrders.find((o) => {
      const oId = (o.id || o.trackingId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const oPhone = (o.customerPhone || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return oId.includes(term) || oPhone.includes(term);
    });

    // If not found in user orders, search in sampleOrders
    if (!found) {
      found = sampleOrders.find((o) => {
        const oId = (o.id || o.trackingId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const oPhone = (o.customerPhone || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return oId.includes(term) || oPhone.includes(term);
      });
    }

    setCurrentOrder(found || null);
    setSearched(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setCurrentOrder(null);
      setSearched(false);
      setSearchParams({});
      return;
    }
    setSearchParams({ id: inputVal.trim() });
    performSearch(inputVal);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputVal(val);
    if (!val.trim()) {
      setCurrentOrder(null);
      setSearched(false);
      setSearchParams({});
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Status configuration helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return {
          label: 'Delivered',
          color: 'bg-emerald-500 text-white',
          bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          icon: CheckCircle2,
          step: 5,
        };
      case 'out_for_delivery':
        return {
          label: 'Out for Delivery',
          color: 'bg-accent text-white',
          bgColor: 'bg-blue-50 border-blue-200 text-accent',
          icon: Truck,
          step: 4,
        };
      case 'shipped':
        return {
          label: 'In Transit',
          color: 'bg-indigo-500 text-white',
          bgColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
          icon: Package,
          step: 3,
        };
      case 'processing':
        return {
          label: 'Processing in Warehouse',
          color: 'bg-amber-500 text-white',
          bgColor: 'bg-amber-50 border-amber-200 text-amber-700',
          icon: Clock,
          step: 2,
        };
      case 'confirmed':
      default:
        return {
          label: 'Order Confirmed',
          color: 'bg-blue-500 text-white',
          bgColor: 'bg-blue-50 border-blue-200 text-blue-700',
          icon: CheckCircle2,
          step: 1,
        };
    }
  };

  const steps = [
    { num: 1, name: 'Confirmed', desc: 'Order received' },
    { num: 2, name: 'Processing', desc: 'Quality checked & packed' },
    { num: 3, name: 'In Transit', desc: 'Dispatched to courier' },
    { num: 4, name: 'Out for Delivery', desc: 'With delivery rider' },
    { num: 5, name: 'Delivered', desc: 'Package received' },
  ];

  const currentStep = currentOrder ? (currentOrder.statusStep || getStatusBadge(currentOrder.status).step) : 1;
  const statusInfo = currentOrder ? getStatusBadge(currentOrder.status) : null;

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-semibold">Track Your Order</span>
        </nav>

        {/* Hero & Search Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-primary-dark to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-bold uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5" /> Real-time Logistics Tracker
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Track Your <span className="text-accent">Delivery Live.</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Enter your Order Tracking ID (e.g., <strong>DD-10294</strong>) or Phone Number to monitor live courier progress, package verification, and expected arrival time.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative z-10 mt-8 max-w-xl">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={inputVal}
                  onChange={handleInputChange}
                  placeholder="Order ID (e.g. DD-10294) or Phone Number..."
                  className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 text-sm rounded-xl outline-none placeholder-gray-400 font-medium shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-xl text-sm font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] shrink-0 flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                Track Order
              </button>
            </div>
          </form>

          {/* Quick Demo Links */}
          <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-300">
            <span className="text-gray-400 font-semibold">Try sample orders:</span>
            {sampleOrders.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setInputVal(sample.id);
                  setSearchParams({ id: sample.id });
                  performSearch(sample.id);
                }}
                className={`px-3 py-1 rounded-lg border transition-all text-xs font-semibold ${
                  currentOrder?.id === sample.id
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white/10 border-white/15 hover:bg-white/20 text-gray-200'
                }`}
              >
                {sample.id} ({sample.status === 'out_for_delivery' ? 'Out for Delivery 🚚' : sample.status === 'delivered' ? 'Delivered ✅' : 'Processing 📦'})
              </button>
            ))}
          </div>

          {/* Background Decorative Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* User's Placed Orders Quick Selector (if placed locally) */}
        {userOrders.length > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-accent" /> Your Recent Placed Orders ({userOrders.length})
              </span>
              <span className="text-[11px] text-gray-400">Click to track</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {userOrders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => {
                    setInputVal(ord.id);
                    setSearchParams({ id: ord.id });
                    performSearch(ord.id);
                  }}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    currentOrder?.id === ord.id
                      ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                      : 'border-gray-100 hover:border-gray-200 bg-surface'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-1">
                    <span>{ord.id}</span>
                    <span className="text-[11px] font-semibold text-accent">${Number(ord.total || 0).toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">
                    {ord.items?.length || 1} item(s) • {ord.status || 'Confirmed'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Display */}
        {currentOrder ? (
          <div className="space-y-8 animate-fade-in">
            {/* Top Order Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                      Order {currentOrder.id}
                    </h2>
                    <button
                      onClick={() => handleCopyId(currentOrder.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                      title="Copy Tracking ID"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Placed on: {currentOrder.orderDate || 'Recently'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border ${statusInfo.bgColor}`}>
                    <statusInfo.icon className="w-4 h-4" />
                    {statusInfo.label}
                  </span>
                  <button
                    onClick={handlePrint}
                    className="p-2.5 bg-surface hover:bg-gray-100 text-gray-600 rounded-xl transition-colors border border-gray-200"
                    title="Print Invoice / Tracking Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Estimated Delivery Notice Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center shrink-0 shadow-md shadow-accent/20">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-accent block">
                      Estimated Delivery
                    </span>
                    <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                      {currentOrder.estimatedDelivery || 'In 1-2 business days'}
                    </span>
                  </div>
                </div>

                {currentOrder.courier && (
                  <div className="text-left sm:text-right text-xs space-y-0.5">
                    <span className="text-gray-500">Carrier Partner:</span>
                    <p className="font-bold text-gray-800">{currentOrder.courier}</p>
                    {currentOrder.courierTrackingCode && (
                      <p className="text-gray-400 font-mono text-[11px]">
                        Tracking: {currentOrder.courierTrackingCode}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Progress Stepper Timeline */}
              <div className="pt-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-6">
                  Shipment Progress
                </h3>

                {/* Desktop Stepper */}
                <div className="hidden md:block">
                  <div className="relative flex items-center justify-between">
                    {/* Connecting line */}
                    <div className="absolute top-5 left-6 right-6 h-1 bg-gray-100 z-0" />
                    <div
                      className="absolute top-5 left-6 h-1 bg-accent z-0 transition-all duration-700"
                      style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 95}%` }}
                    />

                    {steps.map((st) => {
                      const isCompleted = st.num <= currentStep;
                      const isCurrent = st.num === currentStep;

                      return (
                        <div key={st.num} className="relative z-10 flex flex-col items-center text-center max-w-[140px]">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                              isCompleted
                                ? isCurrent
                                  ? 'bg-accent text-white ring-4 ring-accent/20 scale-110'
                                  : 'bg-emerald-500 text-white'
                                : 'bg-white border-2 border-gray-200 text-gray-400'
                            }`}
                          >
                            {isCompleted && !isCurrent ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              st.num
                            )}
                          </div>
                          <span className={`text-xs font-bold mt-2.5 ${isCurrent ? 'text-accent' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {st.name}
                          </span>
                          <span className="text-[11px] text-gray-400 mt-0.5">
                            {st.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Stepper (Vertical) */}
                <div className="md:hidden space-y-4">
                  {steps.map((st) => {
                    const isCompleted = st.num <= currentStep;
                    const isCurrent = st.num === currentStep;

                    return (
                      <div key={st.num} className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isCompleted
                              ? isCurrent
                                ? 'bg-accent text-white ring-4 ring-accent/20'
                                : 'bg-emerald-500 text-white'
                              : 'bg-white border-2 border-gray-200 text-gray-400'
                          }`}
                        >
                          {isCompleted && !isCurrent ? <Check className="w-4 h-4" /> : st.num}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isCurrent ? 'text-accent' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {st.name}
                          </p>
                          <p className="text-[11px] text-gray-400">{st.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Split Details: Timeline & Order Items */}
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Detailed Activity Logs */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent" />
                    Tracking Activity Log
                  </h3>
                  <span className="text-xs font-semibold text-gray-400">
                    Live Updates
                  </span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-100">
                  {(currentOrder.timeline || currentOrder.activities || []).map((activity, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 bg-white ${
                          idx === 0
                            ? 'border-accent bg-accent ring-4 ring-accent/20'
                            : activity.completed
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-gray-300'
                        }`}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-bold ${idx === 0 ? 'text-accent' : 'text-gray-900'}`}>
                            {activity.title}
                          </h4>
                          <span className="text-[11px] font-semibold text-gray-400">
                            {activity.date}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Rider Note */}
                {currentOrder.courierRider && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="p-4 rounded-2xl bg-surface border border-gray-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-gray-400 block">
                            Courier Rider / Agent
                          </span>
                          <span className="text-xs font-bold text-gray-800">
                            {currentOrder.courierRider}
                          </span>
                        </div>
                      </div>
                      <a
                        href={`tel:${currentOrder.courierRider.split('(')[1]?.replace(')', '') || '+8801822998877'}`}
                        className="px-3.5 py-1.5 bg-white border border-gray-200 text-accent text-xs font-bold rounded-xl hover:bg-accent hover:text-white transition-colors"
                      >
                        Call Rider
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items & Customer Receipt */}
              <div className="lg:col-span-5 space-y-6">
                {/* Items in this order */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
                  <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
                    Items in Package ({currentOrder.items?.length || 1})
                  </h3>

                  <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                    {(currentOrder.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-surface transition-colors">
                        <div className="w-14 h-14 bg-surface rounded-xl p-1 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Qty: {item.quantity || 1} × ${Number(item.price || 0).toFixed(2)}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-gray-800">
                          ${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Breakdown */}
                  <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-800">${Number(currentOrder.subtotal || currentOrder.total || 0).toFixed(2)}</span>
                    </div>
                    {Number(currentOrder.discount || 0) > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Coupon Discount</span>
                        <span className="font-semibold">-${Number(currentOrder.discount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-gray-800">
                        {Number(currentOrder.shippingFee || 0) === 0 ? 'FREE' : `$${Number(currentOrder.shippingFee).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-black text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-accent">${Number(currentOrder.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address & Contact Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-accent" /> Destination Address
                  </h4>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-gray-900 text-sm">{currentOrder.customerName || 'Customer'}</p>
                    <p className="text-gray-600 leading-relaxed">{currentOrder.customerAddress || 'Delivery Address Provided'}</p>
                    <p className="text-gray-500 pt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" /> {currentOrder.customerPhone || 'N/A'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Payment:</span>
                    <span className="font-bold text-gray-800">{currentOrder.paymentMethod || 'Cash on Delivery'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : searched ? (
          /* Not Found State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order Not Found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              We couldn't find any order matching "<strong>{inputVal}</strong>". Please double check your Order ID or phone number.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => {
                  const first = sampleOrders[0];
                  setInputVal(first.id);
                  setSearchParams({ id: first.id });
                  performSearch(first.id);
                }}
                className="px-5 py-2.5 bg-accent text-white rounded-xl text-xs font-bold hover:bg-accent-dark transition-colors"
              >
                View Sample Order (DD-10294)
              </button>
              <Link
                to="/shop"
                className="px-5 py-2.5 bg-surface text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
              >
                Back to Shop
              </Link>
            </div>
          </div>
        ) : (
          /* Initial Ready / Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-gray-100 dark:border-slate-800 shadow-sm max-w-xl mx-auto space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ready to Track Your Order</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1.5 max-w-md mx-auto">
                Enter your <strong>Tracking ID</strong> (e.g., DD-10294) or your contact number above to view real-time courier updates, dispatched route, and package details.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Or try a sample order:</span>
              {sampleOrders.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setInputVal(sample.id);
                    setSearchParams({ id: sample.id });
                    performSearch(sample.id);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-surface dark:bg-slate-800 hover:bg-accent hover:text-white text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 transition-all text-xs font-semibold"
                >
                  {sample.id}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Support & Assistance Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Need Assistance With Your Delivery?</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Our customer logistics support team is active 24/7. Call us at <strong>+880 1800-000000</strong> or message via Live Support.
              </p>
            </div>
          </div>
          <Link
            to="/about"
            className="px-5 py-2.5 bg-surface hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
          >
            Help & FAQs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

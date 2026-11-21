import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle, X, Send, Bot, User, Sparkles,
  PhoneCall, ExternalLink, RotateCcw, CheckCheck,
  Package, Laptop, ShieldCheck, Tag, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    sender: 'bot',
    text: "👋 Hi there! Welcome to Digital Dokan. I'm your AI shopping assistant. How can I assist you today?",
    time: 'Just now',
    chips: [
      { id: 'track', label: '🚚 Track My Order', action: 'track' },
      { id: 'laptops', label: '💻 Best Laptops 2026', action: 'laptops' },
      { id: 'discount', label: '🎟️ Promo Coupon', action: 'discount' },
      { id: 'warranty', label: '🛡️ Warranty & Return', action: 'warranty' },
      { id: 'whatsapp', label: '💬 WhatsApp Support', action: 'whatsapp' },
    ]
  }
];

export default function LiveChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('digital_dokan_chat_history');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem('digital_dokan_chat_history', JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const handleSend = (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Save inquiry to localStorage so store admin can review in Admin Dashboard
    try {
      const stored = localStorage.getItem('digital_dokan_customer_inquiries');
      let existingInquiries = [];
      try {
        existingInquiries = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(existingInquiries)) existingInquiries = [];
      } catch {
        existingInquiries = [];
      }

      const newInquiry = {
        id: `inq_${Date.now()}`,
        user: user ? (user.username || user.email || 'Registered Customer') : 'Website Visitor #' + Math.floor(1000 + Math.random() * 9000),
        message: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'New',
        phone: user?.phone || '+880 1700-000000'
      };

      const updated = [newInquiry, ...existingInquiries.slice(0, 49)];
      localStorage.setItem('digital_dokan_customer_inquiries', JSON.stringify(updated));

      // Dispatch custom events for real-time reactivity in current tab and across tabs
      window.dispatchEvent(new CustomEvent('digital_dokan_new_inquiry', { detail: newInquiry }));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.warn('Could not save customer inquiry:', e);
    }

    // Simulate smart agent response
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 850);
  };

  const handleChipClick = (action, label) => {
    handleSend(label);
  };

  const generateBotResponse = (query) => {
    const q = query.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (q.includes('track') || q.includes('order') || q.includes('delivery status')) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "You can track your order live using your Order ID (e.g. DD-10294) or phone number. Check out our real-time tracker below:",
        time,
        link: {
          to: '/track-order',
          text: 'Open Live Order Tracker →'
        },
        chips: [
          { id: 'delivery_time', label: '⏱️ Delivery Timeframes', action: 'delivery_time' },
          { id: 'whatsapp', label: '💬 Talk to Agent', action: 'whatsapp' }
        ]
      };
    }

    if (q.includes('laptop') || q.includes('macbook') || q.includes('notebook') || q.includes('xps') || q.includes('thinkpad')) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "We have updated our 2026 laptop catalog with 16 premier models from Apple, Dell XPS, ASUS ROG Zephyrus, Lenovo ThinkPad, HP Spectre, and Razer Blade!",
        time,
        link: {
          to: '/category/laptops',
          text: 'Browse All 16+ Laptops →'
        },
        chips: [
          { id: 'macbook', label: '🍏 MacBook Pro M3', action: 'macbook' },
          { id: 'gaming_laptops', label: '🎮 Gaming Laptops', action: 'gaming_laptops' }
        ]
      };
    }

    if (q.includes('phone') || q.includes('iphone') || q.includes('samsung') || q.includes('pixel') || q.includes('mobile')) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "Looking for top-tier smartphones? We feature the iPhone 16 Pro Max, Samsung Galaxy S24 Ultra, and Google Pixel 9 Pro with official warranties and fast delivery.",
        time,
        link: {
          to: '/category/smartphones',
          text: 'Explore Flagship Phones →'
        }
      };
    }

    if (q.includes('promo') || q.includes('coupon') || q.includes('discount') || q.includes('offer') || q.includes('voucher')) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "🎉 Exclusive Live Chat Offer: Use coupon code DOKAN2026 during checkout to receive an extra 10% discount on your order!",
        time,
        link: {
          to: '/deals',
          text: 'View All Hot Deals (Up to 50% Off) →'
        }
      };
    }

    if (q.includes('warranty') || q.includes('return') || q.includes('replacement') || q.includes('guarantee')) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "🛡️ Digital Dokan Guarantee:\n• 100% genuine, brand-new sealed items\n• 7 Days easy replacement warranty\n• 1 to 2 Years official manufacturer warranty",
        time,
        chips: [
          { id: 'track', label: '🚚 Track an Order', action: 'track' },
          { id: 'whatsapp', label: '💬 Chat on WhatsApp', action: 'whatsapp' }
        ]
      };
    }

    if (q.includes('payment') || q.includes('bkash') || q.includes('nagad') || q.includes('cod') || q.includes('cash on delivery')) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "We support multiple secure payment options:\n• Cash on Delivery (COD) nationwide\n• bKash & Nagad instant payment\n• Visa, Mastercard, and American Express\n• EMI available on select credit cards",
        time
      };
    }

    if (q.includes('whatsapp') || q.includes('human') || q.includes('agent') || q.includes('call') || q.includes('number') || q.includes('helpline')) {
      return {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "Our human support executives are available on WhatsApp and Phone Hotline:\n📞 Hotline: +880 1700-000000 (10 AM - 10 PM)\n💬 WhatsApp: Instant 1-on-1 assistance",
        time,
        externalLink: {
          url: 'https://wa.me/8801700000000?text=Hello%20Digital%20Dokan%20Support!%20I%20have%20an%20inquiry.',
          text: 'Open WhatsApp Chat 💬'
        }
      };
    }

    // Default intelligent fallback
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: "Thank you for reaching out! You can browse our shop catalog, track any active order, or connect directly with our support team on WhatsApp.",
      time,
      chips: [
        { id: 'track', label: '🚚 Track Order', action: 'track' },
        { id: 'laptops', label: '💻 Laptops Catalog', action: 'laptops' },
        { id: 'discount', label: '🎟️ Promo Coupon', action: 'discount' },
        { id: 'whatsapp', label: '💬 WhatsApp Support', action: 'whatsapp' }
      ]
    };
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    try {
      sessionStorage.removeItem('digital_dokan_chat_history');
    } catch {}
  };

  return (
    <>
      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[390px] max-w-[420px] h-[540px] max-h-[80vh] flex flex-col bg-white dark:bg-[#0f172a] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95 origin-bottom-right"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-dark via-primary to-accent p-4 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-accent-light shadow-inner">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                {/* Green live dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-primary-dark rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
                  Digital Dokan Assistant
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                  Online • Typically replies instantly
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Restart Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40 px-3.5 py-1.5 text-[11px] text-blue-700 dark:text-blue-300 flex items-center justify-between shrink-0">
            <span>🎁 Code <strong>DOKAN2026</strong> for 10% off</span>
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noreferrer"
              className="font-bold hover:underline inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 ml-2"
            >
              WhatsApp <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 dark:bg-[#0b1120] text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-sm ${
                      isUser
                        ? 'bg-accent text-white rounded-br-none shadow-accent/20'
                        : 'bg-white dark:bg-[#162033] text-gray-800 dark:text-slate-100 rounded-bl-none border border-gray-100 dark:border-slate-800 shadow-slate-200/50 dark:shadow-none'
                    }`}
                  >
                    <p>{m.text}</p>

                    {/* In-chat Internal Route Link */}
                    {m.link && (
                      <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-slate-700/60">
                        <Link
                          to={m.link.to}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1.5 font-bold text-accent dark:text-accent-light hover:underline text-xs"
                        >
                          {m.link.text}
                        </Link>
                      </div>
                    )}

                    {/* In-chat External Link */}
                    {m.externalLink && (
                      <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-slate-700/60">
                        <a
                          href={m.externalLink.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 hover:underline text-xs"
                        >
                          {m.externalLink.text}
                        </a>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-gray-400 dark:text-slate-500 px-1">
                    {m.time}
                  </span>

                  {/* Suggestion Chips */}
                  {m.chips && m.chips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                      {m.chips.map((chip) => (
                        <button
                          key={chip.id}
                          onClick={() => handleChipClick(chip.action, chip.label)}
                          className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1a253a] hover:bg-accent hover:text-white dark:hover:bg-accent border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-[11px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#162033] border border-gray-100 dark:border-slate-800 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-white dark:bg-[#162033] border border-gray-100 dark:border-slate-800 px-3 py-2 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-[#0f172a] border-t border-gray-100 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about orders, laptops, deals..."
              className="flex-1 bg-slate-50 dark:bg-[#162033] border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-accent hover:bg-accent-dark disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-accent/20 cursor-pointer disabled:cursor-not-allowed active:scale-95"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ── Floating Launcher Trigger Button ── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 px-4 py-3 sm:px-4 sm:py-3.5 rounded-full bg-gradient-to-r from-accent via-blue-600 to-indigo-600 hover:from-accent-dark hover:to-indigo-700 text-white shadow-2xl shadow-accent/40 hover:shadow-accent/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none"
        aria-label="Open Live Chat"
      >
        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-5 h-5 transition-transform duration-200" />
          ) : (
            <MessageCircle className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          )}

          {/* Unread badge & pulsing indicator when closed */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border border-white" />
            </span>
          )}
        </div>

        <span className="font-extrabold text-xs tracking-wide hidden sm:inline-block">
          {isOpen ? 'Close Chat' : 'Live Chat'}
        </span>

        {/* Small live status pill */}
        {!isOpen && (
          <span className="hidden sm:inline-block text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">
            Online
          </span>
        )}
      </button>
    </>
  );
}

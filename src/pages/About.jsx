import { ShieldCheck, Truck, Headphones, Award, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-surface min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-gray-100 shadow-sm text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase font-bold text-accent tracking-widest">
            About Us
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Welcome to <span className="text-accent">Digital Dokan</span>
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Digital Dokan is your ultimate modern destination for authentic mobile devices, laptops, smart accessories, and gaming gears. We connect tech lovers with top global brands without hassle.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center space-y-3">
            <div className="w-14 h-14 bg-blue-50 text-accent rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">100% Original Products</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every device is officially sourced with manufacturer guarantee and sealed packaging.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Swift Doorstep Delivery</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Fast, insured shipping straight to your home with real-time order verification.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center space-y-3">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <Headphones className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Dedicated Support</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our knowledgeable tech support team is available 7 days a week to help with your queries.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-primary-dark to-primary rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold">Our Mission & Promise</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              To deliver the latest high-tech gadgets at honest, competitive prices while offering frictionless checkout, transparent warranties, and genuine customer care.
            </p>
          </div>
          <Link
            to="/shop"
            className="px-8 py-3.5 bg-accent hover:bg-accent-dark text-white rounded-xl font-bold text-sm transition-colors shadow-lg shrink-0"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}


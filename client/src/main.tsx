import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Router, Route, Switch } from "wouter";
import Home from "@/pages/home/Home";
import EarlyAccess from "@/pages/early-access";
import HostApplication from "@/pages/HostApplication";
import Client from "@/pages/Client";
import "./index.css";
import './integrations/forms';

// FlipCard Component for Problems ↔ Solutions
interface FlipCardProps {
  id: string;
  problemTitle: string;
  problemText: string;
  solutionTitle: string;
  solutionText: string;
}

function FlipCard({ id, problemTitle, problemText, solutionTitle, solutionText }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggle = () => setIsFlipped(!isFlipped);

  return (
    <div className="group perspective fade-in">
      <button
        type="button"
        onClick={toggle}
        onKeyDown={(e) => { 
          if (e.key === "Enter" || e.key === " ") { 
            e.preventDefault(); 
            toggle(); 
          }
        }}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? "Show problem" : "Show solution"}
        className="relative w-full h-72 focus:outline-none transform hover:scale-[1.01] transition-transform duration-200 touch-tap"
      >
        <div className={`preserve-3d duration-700 ease-out relative w-full h-full ${isFlipped ? "rotate-y-180" : ""} hover:shadow-[var(--shadow-lg)]`}>
          {/* Problem side (front) */}
          <div className="absolute inset-0 backface-hidden card p-6 border-red-100 bg-gradient-to-br from-red-50 to-red-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⚠️</span>
              </div>
              <p className="text-sm font-bold text-red-700 uppercase tracking-wide">Problem</p>
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-3 leading-tight">{problemTitle}</h3>
            <p className="text-sm text-red-900/90 leading-relaxed mb-4">{problemText}</p>
            <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-red-600 font-semibold bg-red-200/50 px-3 py-1.5 rounded-full">
              <span>Tap 🔄 for solution</span>
            </div>
          </div>
          
          {/* Solution side (back) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 card p-6 border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-sm font-bold text-emerald-700 uppercase tracking-wide">Solution</p>
            </div>
            <h3 className="text-xl font-bold text-emerald-800 mb-3 leading-tight">{solutionTitle}</h3>
            <p className="text-sm text-emerald-900/90 leading-relaxed mb-4">{solutionText}</p>
            <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-200/50 px-3 py-1.5 rounded-full">
              <span>Tap 🔄 for problem</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

// Minimal Early Access Form - No external dependencies causing React context issues
function EarlyAccessForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    console.log("[early-access] mounted successfully");
    document.title = "Request Early Access | Alchemy Premium EV Charging Network";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Add immediate dopamine feedback
    const submitBtn = e.currentTarget.querySelector('button[type="submit"]') as HTMLElement;
    const form = e.currentTarget as HTMLElement;
    
    if (submitBtn) {
      submitBtn.classList.add('haptic-heavy');
      setTimeout(() => submitBtn.classList.remove('haptic-heavy'), 300);
    }
    
    try {
      // Map to match server schema - need ALL required fields
      const submissionData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        vehicleType: "Model S", // Default values for required fields
        chargingFrequency: "Weekly",
        location: "Not specified"
      };
      
      const response = await fetch('/api/early-access-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      
      if (response.ok) {
        // Success dopamine burst
        if (submitBtn) {
          submitBtn.classList.add('success-pop');
          submitBtn.innerHTML = '✓ Success!';
          submitBtn.style.background = 'var(--gold)';
        }
        if (form) {
          form.classList.add('haptic-bounce');
        }
        
        setTimeout(() => {
          setSubmitted(true);
        }, 600);
      } else {
        const error = await response.json();
        console.error('Submission error:', error);
        if (submitBtn) {
          submitBtn.classList.add('haptic-shake');
          setTimeout(() => submitBtn.classList.remove('haptic-shake'), 300);
        }
      }
    } catch (error) {
      console.error('Submission failed:', error);
      if (submitBtn) {
        submitBtn.classList.add('haptic-shake');
        setTimeout(() => submitBtn.classList.remove('haptic-shake'), 300);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Add haptic feedback for typing
    const input = document.activeElement as HTMLElement;
    if (input && input.tagName === 'INPUT') {
      input.classList.add('haptic-light');
      setTimeout(() => input.classList.remove('haptic-light'), 100);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center success-pop">
          <div className="animate-bounce text-6xl mb-4">🎉</div>
          <h1 className="h1-premium text-gold mb-6 animate-pulse-gold">Thank You!</h1>
          <p className="subcopy mb-8">Your application has been submitted successfully. We'll contact you within 24-48 hours.</p>
          <a href="/" className="btn-primary touch-tap">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="backdrop-blur-md bg-white/70 supports-[backdrop-filter]:bg-white/50 border-b border-black/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <a href="/" className="hover:text-gold transition-colors">
            ← Back to Home
          </a>
          <img 
            src="/assets/au-logo.png" 
            alt="Alchemy United Logo"
            className="h-8 w-auto"
          />
          <div></div>
        </div>
      </nav>

      <main className="pt-8 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl px-4">
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center">
              Request <span className="text-gold">Early Access</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-neutral-700 text-center">
              Join the exclusive waitlist for premium EV charging
            </p>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="card p-6 md:p-8 mt-6 reveal space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-white font-medium mb-2">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full bg-white/10 border border-white/30 text-white placeholder:text-white/60 rounded-lg px-3 py-2 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all touch-tap"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-white font-medium mb-2">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full bg-white/10 border border-white/30 text-white placeholder:text-white/60 rounded-lg px-3 py-2 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all touch-tap"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-white/10 border border-white/30 text-white placeholder:text-white/60 rounded-lg px-3 py-2 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all touch-tap"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-white font-medium mb-2">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-white/10 border border-white/30 text-white placeholder:text-white/60 rounded-lg px-3 py-2 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all touch-tap"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div className="mt-6 rounded-2xl p-3 bg-white/70 border border-[#D4AF37]/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]">
              <button 
                type="submit" 
                className="w-full rounded-xl px-5 py-3.5 font-semibold text-black
                  bg-[linear-gradient(180deg,#F5D36B_0%,#D4AF37_60%,#B89022_100%)]
                  shadow-[0_10px_26px_rgba(212,175,55,.45)] transition-transform duration-150 hover:-translate-y-0.5"
              >
                Request Early Access
              </button>
              <p className="mt-2 text-xs text-neutral-600 text-center">No spam. 60-second signup.</p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

// Simplified Home Component that works with current setup
function HomeComponent() {
  useEffect(() => {
    console.log("[home] mounted successfully");
    document.title = "Alchemy Network | Premium EV Charging for Drivers & Hosts";
    
    // Scroll reveal animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          entry.target.classList.add('animate-fadeInUp');
        }
      });
    }, { threshold: 0.1 });

    // Initialize all reveal elements
    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });

    // Immediately show elements that are already in view
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('in');
        }
      });
    }, 100);

    // Optimized dopamine micro-interactions using event delegation
    const handleInteraction = (e: Event) => {
      const el = e.target as HTMLElement;
      const isInteractive = el.matches('button, a, input, select, [role="button"]');
      
      if (!isInteractive) return;
      
      if (e.type === 'touchstart') {
        el.classList.add('haptic-medium');
        setTimeout(() => el.classList.remove('haptic-medium'), 200);
      } else if (e.type === 'mousedown') {
        el.classList.add('haptic-light');
        setTimeout(() => el.classList.remove('haptic-light'), 100);
      } else if (e.type === 'focus') {
        el.style.outline = '2px solid var(--gold)';
        el.style.outlineOffset = '2px';
      }
    };

    // Use event delegation for better performance
    document.addEventListener('touchstart', handleInteraction, { passive: true });
    document.addEventListener('mousedown', handleInteraction);
    document.addEventListener('focus', handleInteraction, true);

    return () => {
      observer.disconnect();
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('mousedown', handleInteraction);
      document.removeEventListener('focus', handleInteraction);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Router>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/early-access" component={EarlyAccess} />
          <Route path="/host-application" component={HostApplicationForm} />
          <Route path="/client" component={Client} />
          <Route>
            <div>Page not found</div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

// Host Application Form Component
function HostApplicationForm() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactFirstName: '',
    contactLastName: '',
    email: '',
    phone: '',
    propertyType: '',
    propertyAddress: '',
    parkingSpaces: '',
    electricalCapacity: '',
    expectedTraffic: '',
    operatingHours: '',
    currentAmenities: '',
    partnershipInterest: '',
    timeline: '',
    additionalInfo: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    console.log("[host-application] mounted successfully");
    document.title = "Host Application | Alchemy Premium EV Charging Network";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Host application submitted:', formData);
    
    try {
      const response = await fetch('/api/host-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitted(true);
        window.location.href = '/thank-you';
      } else {
        const error = await response.json();
        console.error('Host application submission error:', error);
      }
    } catch (error) {
      console.error('Host application submission failed:', error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gold">Application Submitted!</h1>
          <p className="text-xl mb-8">We'll contact you within 2-3 business days.</p>
          <a href="/" className="bg-gold text-black px-6 py-3 rounded-full font-bold">Return Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <a href="/">
            <img 
              src="/assets/au-logo.png" 
              alt="Alchemy United Premium EV Charging Network"
              className="h-8 w-auto"
            />
          </a>
          <a href="/" className="text-gray-700 hover:text-[var(--gold)] transition-colors">← Back to Home</a>
        </div>
      </nav>

      {/* Form Content */}
      <main className="pt-8 sm:pt-16 mx-auto max-w-2xl px-4 pb-12">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">Become a Host Partner</h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-700">
            Join our premium EV charging network and generate revenue while providing exceptional service to EV drivers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 md:p-8 mt-6 fade-in">
          {/* Business Information */}
          <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Your Business Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    required
                    value={formData.propertyType}
                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    <option value="">Select Property Type</option>
                    <option value="hotel">Hotel/Resort</option>
                    <option value="retail">Retail/Shopping Center</option>
                    <option value="restaurant">Restaurant/Dining</option>
                    <option value="office">Office Building</option>
                    <option value="parking">Parking Facility</option>
                    <option value="residential">Residential Complex</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactFirstName}
                    onChange={(e) => setFormData({...formData, contactFirstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Your First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactLastName}
                    onChange={(e) => setFormData({...formData, contactLastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Your Last Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Property Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Address *
                  </label>
                  <textarea
                    required
                    value={formData.propertyAddress}
                    onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    rows={3}
                    placeholder="Full address of the property"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Parking Spaces *
                    </label>
                    <select
                      required
                      value={formData.parkingSpaces}
                      onChange={(e) => setFormData({...formData, parkingSpaces: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">Select Parking Spaces</option>
                      <option value="2-5">2-5 spaces</option>
                      <option value="6-10">6-10 spaces</option>
                      <option value="11-20">11-20 spaces</option>
                      <option value="21-50">21-50 spaces</option>
                      <option value="50+">50+ spaces</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Electrical Capacity *
                    </label>
                    <select
                      required
                      value={formData.electricalCapacity}
                      onChange={(e) => setFormData({...formData, electricalCapacity: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">Select Electrical Capacity</option>
                      <option value="unknown">Not sure/Need assessment</option>
                      <option value="sufficient">Sufficient for EV charging</option>
                      <option value="upgrade-needed">May need upgrades</option>
                      <option value="high-capacity">High capacity available</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Operations */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Operations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Daily Traffic *
                  </label>
                  <select
                    required
                    value={formData.expectedTraffic}
                    onChange={(e) => setFormData({...formData, expectedTraffic: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    <option value="">Select Traffic Level</option>
                    <option value="low">Low (0-50 visitors/day)</option>
                    <option value="medium">Medium (50-200 visitors/day)</option>
                    <option value="high">High (200-500 visitors/day)</option>
                    <option value="very-high">Very High (500+ visitors/day)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating Hours *
                  </label>
                  <select
                    required
                    value={formData.operatingHours}
                    onChange={(e) => setFormData({...formData, operatingHours: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    <option value="">Select Operating Hours</option>
                    <option value="24/7">24/7</option>
                    <option value="extended">Extended (6 AM - 11 PM)</option>
                    <option value="business">Business Hours (9 AM - 6 PM)</option>
                    <option value="retail">Retail Hours (10 AM - 9 PM)</option>
                    <option value="custom">Custom Schedule</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Partnership Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Partnership Interest</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partnership Model Interest *
                  </label>
                  <select
                    required
                    value={formData.partnershipInterest}
                    onChange={(e) => setFormData({...formData, partnershipInterest: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    <option value="">Select Partnership Model</option>
                    <option value="revenue-share">Revenue sharing partnership</option>
                    <option value="lease">Site lease agreement</option>
                    <option value="purchase">Equipment purchase option</option>
                    <option value="discuss">Open to discussion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Implementation Timeline *
                  </label>
                  <select
                    required
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    <option value="">Select Timeline</option>
                    <option value="asap">As soon as possible</option>
                    <option value="1-3-months">1-3 months</option>
                    <option value="3-6-months">3-6 months</option>
                    <option value="6-12-months">6-12 months</option>
                    <option value="12+-months">12+ months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Amenities
                  </label>
                  <textarea
                    value={formData.currentAmenities}
                    onChange={(e) => setFormData({...formData, currentAmenities: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    rows={3}
                    placeholder="Describe current amenities (WiFi, restrooms, food service, etc.)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    rows={4}
                    placeholder="Any additional information about your property or questions about the partnership"
                  />
                </div>
              </div>
            </div>

          {/* Submit Button */}
          <div className="mt-6 rounded-2xl p-3 bg-white/70 border border-[#D4AF37]/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]">
            <button 
              type="submit" 
              className="w-full rounded-xl px-5 py-3.5 font-semibold text-black
                         bg-[linear-gradient(180deg,#F5D36B_0%,#D4AF37_60%,#B89022_100%)]
                         shadow-[0_10px_26px_rgba(212,175,55,.45)]
                         transition-transform duration-150 hover:-translate-y-0.5"
            >
              Submit Host Application
            </button>
            <p className="mt-2 text-xs text-neutral-600 text-center">
              Your information is secure. We reply within 2–3 business days.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

// Simple routing based on pathname
function App() {
  const path = window.location.pathname;
  
  if (path === '/early-access') {
    return <EarlyAccessForm />;
  }
  
  // For other routes, redirect to home using window.location
  if (path !== '/' && path !== '/host-application' && path !== '/thank-you') {
    window.location.href = '/';
    return <div>Redirecting...</div>;
  }
  
  if (path === '/host-application') {
    return <HostApplication />;
  }
  
  if (path === '/thank-you') {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center reveal">
        <h1 className="h1-premium">Thank You!</h1>
        <p className="subcopy mt-4">Your application has been received.</p>
        <a href="/" className="btn-secondary touch-tap mt-6 inline-block">Return Home</a>
      </div>
    </div>;
  }
  
  return <HomeComponent />;
}

const el = document.getElementById("root");
if (!el) throw new Error("No #root element");

createRoot(el).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (typeof window !== 'undefined') {
  const show = () => {
    document.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
      const r = el.getBoundingClientRect();
      const enter = r.top < window.innerHeight * 0.9;
      if (enter) el.classList.add('in');
    });
  };
  ['scroll','resize','load'].forEach(ev=>window.addEventListener(ev, show, {passive:true}));
  show();
}

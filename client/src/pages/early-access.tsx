import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function EarlyAccess() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/signups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name:  formData.lastName,
          email:      formData.email,
          phone:      formData.phone || ""
        }),
      });
      
      if (response.ok) {
        // Success - redirect to thank you page
        window.location.href = '/thank-you?type=early-access';
      } else {
        const error = await response.json();
        console.error('Submission error:', error);
        alert('There was an error submitting your application. Please try again.');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('There was an error submitting your application. Please check your internet connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 sm:p-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-white hover:text-gold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <img 
          src="/assets/au-logo.png" 
          alt="Alchemy United Logo"
          className="h-8 w-auto filter brightness-125"
        />
        <div></div>
      </nav>
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-[#f0f1f2]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 font-display">
              Request <span className="text-gold">Early Access</span>
            </h1>
            <p className="text-xl text-white/80">
              Join the exclusive waitlist for premium EV charging
            </p>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="text-white font-medium">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="lastName" className="text-white font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-white font-medium">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-[#F5D36B] via-[#D4AF37] to-[#B89022] hover:from-[#FFE066] hover:via-[#E6C766] hover:to-[#C4A332] text-black font-black py-6 rounded-2xl text-xl shadow-[0_8px_32px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.6)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-[#D4AF37] font-display"
              >
                🚀 Request Early Access
              </Button>
              <p className="text-center text-white/60 text-sm mt-4 font-medium">
                No spam. Cancel anytime. Your data is secure.
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
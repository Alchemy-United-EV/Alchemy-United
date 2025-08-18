import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function HostApplication() {
  const [formData, setFormData] = useState({
    business_name: '',
    property_type: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    property_address: '',
    parking_spaces: '',
    electrical_capacity: '',
    daily_traffic: '',
    operating_hours: '',
    partnership_model: '',
    implementation_timeline: '',
    amenities: '',
    additional_info: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      business_name: '',
      property_type: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      property_address: '',
      parking_spaces: '',
      electrical_capacity: '',
      daily_traffic: '',
      operating_hours: '',
      partnership_model: '',
      implementation_timeline: '',
      amenities: '',
      additional_info: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Use backend API instead of direct Supabase client
      const response = await fetch('/api/host-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      setMessage('Host application submitted successfully! We will contact you soon.');
      setMessageType('success');
      resetForm();
      
      // Redirect to thank you page after a short delay
      setTimeout(() => {
        window.location.href = '/thank-you';
      }, 1500);
    } catch (error: any) {
      console.error('Error submitting host application:', error);
      setMessage(`Error submitting application: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
              Become a Host Partner
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join the Alchemy United network and transform your property into a premium EV charging destination.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                messageType === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-100' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-100'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Business Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                    placeholder="Your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Property Type *
                  </label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="">Select property type</option>
                    <option value="Retail">Retail</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Property Information */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Property Address *
                </label>
                <input
                  type="text"
                  name="property_address"
                  value={formData.property_address}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                  placeholder="Full property address"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Available Parking Spaces *
                  </label>
                  <input
                    type="number"
                    name="parking_spaces"
                    value={formData.parking_spaces}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                    placeholder="Number of spaces"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Electrical Capacity
                  </label>
                  <input
                    type="text"
                    name="electrical_capacity"
                    value={formData.electrical_capacity}
                    onChange={handleInputChange}
                    className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                    placeholder="e.g., 400A, 800A"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Daily Traffic
                  </label>
                  <input
                    type="text"
                    name="daily_traffic"
                    value={formData.daily_traffic}
                    onChange={handleInputChange}
                    className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                    placeholder="Average daily visitors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    name="operating_hours"
                    value={formData.operating_hours}
                    onChange={handleInputChange}
                    className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                    placeholder="e.g., 6 AM - 10 PM"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Preferred Partnership Model
                  </label>
                  <input
                    type="text"
                    name="partnership_model"
                    value={formData.partnership_model}
                    onChange={handleInputChange}
                    className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                    placeholder="Revenue share, lease, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Implementation Timeline
                  </label>
                  <input
                    type="text"
                    name="implementation_timeline"
                    value={formData.implementation_timeline}
                    onChange={handleInputChange}
                    className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                    placeholder="Preferred start date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Amenities
                </label>
                <textarea
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                  placeholder="Describe amenities available (restaurant, shopping, WiFi, etc.)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Additional Information
                </label>
                <textarea
                  name="additional_info"
                  value={formData.additional_info}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-600 bg-black/30 text-white p-2 rounded focus:border-yellow-500 focus:outline-none"
                  placeholder="Any additional details you'd like to share about your property or partnership goals"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-500 text-white px-4 py-3 rounded hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Host Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';

export default function HostApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const form = new FormData(e.currentTarget);
      const payload = Object.fromEntries(form.entries()); // keys must match column names

      // Submit to API route
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/host-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();

      setMessage('Host application submitted successfully! We will contact you soon.');
      setMessageType('success');
      e.currentTarget.reset();
    } catch (error: any) {
      console.error('[host_applications submit]', error);
      setMessage(`Submission failed: ${error?.message || 'Unknown error'}`);
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
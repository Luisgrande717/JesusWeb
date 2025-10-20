import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const Services = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceType: 'oil_change',
    customService: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: '',
    carInfo: {
      make: '',
      model: '',
      year: '',
      licensePlate: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const services = [
    { value: 'oil_change', label: 'Oil Change', price: '$49.99' },
    { value: 'brake_service', label: 'Brake Service', price: '$149.99' },
    { value: 'tire_rotation', label: 'Tire Rotation', price: '$39.99' },
    { value: 'engine_diagnostic', label: 'Engine Diagnostic', price: '$89.99' },
    { value: 'transmission_service', label: 'Transmission Service', price: '$199.99' },
    { value: 'battery_replacement', label: 'Battery Replacement', price: '$129.99' },
    { value: 'ac_service', label: 'A/C Service', price: '$99.99' },
    { value: 'general_inspection', label: 'General Inspection', price: '$59.99' },
    { value: 'custom', label: 'Custom Service', price: 'Varies' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('car')) {
      const carField = name.replace('car', '').toLowerCase();
      setFormData({
        ...formData,
        carInfo: { ...formData.carInfo, [carField]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/services' } });
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.post('/appointments', formData);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="card max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Appointment Booked!</h2>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-600">Book your appointment today</p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {services.filter(s => s.value !== 'custom').map((service) => (
            <div key={service.value} className="card text-center">
              <h3 className="font-semibold text-lg mb-2">{service.label}</h3>
              <p className="text-2xl font-bold text-primary-600 mb-2">{service.price}</p>
            </div>
          ))}
        </div>

        {/* Booking Form */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Book an Appointment</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="input-field" required>
                  {services.map((service) => (
                    <option key={service.value} value={service.value}>{service.label}</option>
                  ))}
                </select>
              </div>

              {formData.serviceType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Describe Service</label>
                  <input type="text" name="customService" value={formData.customService} onChange={handleChange} className="input-field" required />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} className="input-field" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input type="time" name="scheduledTime" value={formData.scheduledTime} onChange={handleChange} className="input-field" required />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                  <input type="text" name="carMake" value={formData.carInfo.make} onChange={handleChange} className="input-field" required placeholder="Toyota" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <input type="text" name="carModel" value={formData.carInfo.model} onChange={handleChange} className="input-field" required placeholder="Camry" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input type="number" name="carYear" value={formData.carInfo.year} onChange={handleChange} className="input-field" required placeholder="2020" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                  <input type="text" name="carLicensePlate" value={formData.carInfo.licensePlate} onChange={handleChange} className="input-field" placeholder="ABC-1234" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} className="input-field" rows="3" placeholder="Any specific concerns or requests..."></textarea>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Services;

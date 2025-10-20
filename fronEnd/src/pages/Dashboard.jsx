import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { useWebSocket } from '../hooks/useWebSocket';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const { messages } = useWebSocket(token);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Handle WebSocket messages for real-time updates
    messages.forEach((msg) => {
      if (msg.type === 'repair_update' || msg.type === 'appointment_status') {
        fetchData();
      }
    });
  }, [messages]);

  const fetchData = async () => {
    try {
      const [appointmentsRes, invoicesRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/invoices'),
      ]);
      setAppointments(appointmentsRes.data.data);
      setInvoices(invoicesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      confirmed: 'badge-confirmed',
      in_progress: 'badge-in-progress',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
    };
    return badges[status] || 'badge';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Repairs</p>
                <p className="text-3xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'in_progress').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Invoices</p>
                <p className="text-3xl font-bold text-gray-900">
                  {invoices.filter(i => i.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
          {appointments.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">No appointments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {appointment.serviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <span className={getStatusBadge(appointment.status)}>
                          {appointment.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        {appointment.carInfo?.make} {appointment.carInfo?.model} ({appointment.carInfo?.year})
                      </p>
                      <p className="text-gray-600 text-sm">
                        Scheduled: {new Date(appointment.scheduledDate).toLocaleDateString()} at {appointment.scheduledTime}
                      </p>
                      {appointment.assignedMechanic && (
                        <p className="text-gray-600 text-sm mt-1">
                          Mechanic: {appointment.assignedMechanic.name}
                        </p>
                      )}
                    </div>
                    {appointment.estimatedCost && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Estimated</p>
                        <p className="text-2xl font-bold text-primary-600">${appointment.estimatedCost}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoices */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Invoices</h2>
          {invoices.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">No invoices yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice._id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Invoice #{invoice.invoiceNumber}</h3>
                      <p className="text-gray-600 text-sm">
                        Created: {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900 mb-2">${invoice.total}</p>
                      <span className={invoice.status === 'paid' ? 'badge-completed' : 'badge-pending'}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

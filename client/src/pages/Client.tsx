import { useState, useEffect } from 'react';

interface Signup {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface HostApplication {
  id: string;
  created_at: string;
  business_name: string;
  email: string;
  phone: string;
  property_address: string;
  [key: string]: any; // For additional fields in details modal
}

interface TableData {
  rows: any[];
  total: number;
}

export default function Client() {
  const [clientKey, setClientKey] = useState<string | null>(
    localStorage.getItem('client_key')
  );
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'signups' | 'host-applications'>('signups');
  
  // Data states
  const [signups, setSignups] = useState<TableData>({ rows: [], total: 0 });
  const [hostApps, setHostApps] = useState<TableData>({ rows: [], total: 0 });
  const [loading, setLoading] = useState(false);
  
  // Search and pagination
  const [signupsSearch, setSignupsSearch] = useState('');
  const [hostAppsSearch, setHostAppsSearch] = useState('');
  const [signupsOffset, setSignupsOffset] = useState(0);
  const [hostAppsOffset, setHostAppsOffset] = useState(0);
  const [detailsModal, setDetailsModal] = useState<HostApplication | null>(null);
  
  const limit = 50;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      // Test the key with a simple API call
      const response = await fetch(`${baseUrl}/api/client/signups?limit=1`, {
        headers: { 'x-client-key': passwordInput }
      });
      
      if (response.status === 401) {
        setAuthError('Invalid password');
        return;
      }
      
      if (!response.ok) {
        setAuthError('Connection error');
        return;
      }
      
      // Success - save key and proceed
      if (rememberMe) {
        localStorage.setItem('client_key', passwordInput);
      }
      setClientKey(passwordInput);
    } catch (error) {
      setAuthError('Network error');
    }
  };

  const fetchData = async (endpoint: string, search: string, offset: number) => {
    if (!clientKey) return;
    
    setLoading(true);
    try {
      const url = `${baseUrl}/api/client/${endpoint}?search=${encodeURIComponent(search)}&limit=${limit}&offset=${offset}`;
      const response = await fetch(url, {
        headers: { 'x-client-key': clientKey }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('client_key');
        setClientKey(null);
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = (endpoint: string) => {
    if (!clientKey) return;
    
    const url = `${baseUrl}/api/client/export/${endpoint}.csv`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${endpoint}-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    
    // Add auth header via fetch and blob download
    fetch(url, {
      headers: { 'x-client-key': clientKey }
    })
    .then(response => response.blob())
    .then(blob => {
      const downloadUrl = window.URL.createObjectURL(blob);
      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    });
  };

  useEffect(() => {
    if (clientKey && activeTab === 'signups') {
      fetchData('signups', signupsSearch, signupsOffset).then(data => {
        if (data) setSignups(data);
      });
    }
  }, [clientKey, activeTab, signupsSearch, signupsOffset]);

  useEffect(() => {
    if (clientKey && activeTab === 'host-applications') {
      fetchData('host-applications', hostAppsSearch, hostAppsOffset).then(data => {
        if (data) setHostApps(data);
      });
    }
  }, [clientKey, activeTab, hostAppsSearch, hostAppsOffset]);

  if (!clientKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Client Dashboard</h2>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {authError}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full bg-slate-900 text-white rounded px-3 py-2 hover:opacity-90"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('client_key');
              setClientKey(null);
            }}
            className="bg-gray-600 text-white rounded px-3 py-2 hover:opacity-90"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('signups')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'signups'
                    ? 'border-slate-500 text-slate-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Signups ({signups.total})
              </button>
              <button
                onClick={() => setActiveTab('host-applications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'host-applications'
                    ? 'border-slate-500 text-slate-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Host Applications ({hostApps.total})
              </button>
            </nav>
          </div>
        </div>

        {/* Signups Tab */}
        {activeTab === 'signups' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <input
                type="text"
                placeholder="Search signups..."
                value={signupsSearch}
                onChange={(e) => {
                  setSignupsSearch(e.target.value);
                  setSignupsOffset(0);
                }}
                className="border rounded p-2 w-64"
              />
              <button
                onClick={() => exportCSV('signups')}
                className="bg-slate-900 text-white rounded px-3 py-2 hover:opacity-90"
              >
                Export CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">First Name</th>
                    <th className="px-4 py-2 text-left">Last Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : signups.rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No signups found
                      </td>
                    </tr>
                  ) : (
                    signups.rows.map((signup: Signup) => (
                      <tr key={signup.id} className="border-t border-gray-200">
                        <td className="px-4 py-2">
                          {new Date(signup.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">{signup.first_name}</td>
                        <td className="px-4 py-2">{signup.last_name}</td>
                        <td className="px-4 py-2">{signup.email}</td>
                        <td className="px-4 py-2">{signup.phone}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-700">
                Showing {signupsOffset + 1} to {Math.min(signupsOffset + limit, signups.total)} of {signups.total}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setSignupsOffset(Math.max(0, signupsOffset - limit))}
                  disabled={signupsOffset === 0}
                  className="bg-slate-900 text-white rounded px-3 py-2 hover:opacity-90 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setSignupsOffset(signupsOffset + limit)}
                  disabled={signupsOffset + limit >= signups.total}
                  className="bg-slate-900 text-white rounded px-3 py-2 hover:opacity-90 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Host Applications Tab */}
        {activeTab === 'host-applications' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <input
                type="text"
                placeholder="Search host applications..."
                value={hostAppsSearch}
                onChange={(e) => {
                  setHostAppsSearch(e.target.value);
                  setHostAppsOffset(0);
                }}
                className="border rounded p-2 w-64"
              />
              <button
                onClick={() => exportCSV('host-applications')}
                className="bg-slate-900 text-white rounded px-3 py-2 hover:opacity-90"
              >
                Export CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Business Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Address</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : hostApps.rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No host applications found
                      </td>
                    </tr>
                  ) : (
                    hostApps.rows.map((app: HostApplication) => (
                      <tr key={app.id} className="border-t border-gray-200">
                        <td className="px-4 py-2">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">{app.business_name}</td>
                        <td className="px-4 py-2">{app.email}</td>
                        <td className="px-4 py-2">{app.phone}</td>
                        <td className="px-4 py-2">{app.property_address}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => setDetailsModal(app)}
                            className="text-slate-600 hover:text-slate-900 underline"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-700">
                Showing {hostAppsOffset + 1} to {Math.min(hostAppsOffset + limit, hostApps.total)} of {hostApps.total}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setHostAppsOffset(Math.max(0, hostAppsOffset - limit))}
                  disabled={hostAppsOffset === 0}
                  className="bg-slate-900 text-white rounded px-3 py-2 hover:opacity-90 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setHostAppsOffset(hostAppsOffset + limit)}
                  disabled={hostAppsOffset + limit >= hostApps.total}
                  className="bg-slate-900 text-white rounded px-3 py-2 hover:opacity-90 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {detailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Application Details</h3>
                <button
                  onClick={() => setDetailsModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-3">
                {Object.entries(detailsModal).map(([key, value]) => (
                  <div key={key}>
                    <strong className="text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </strong>
                    <span className="ml-2 text-gray-900">
                      {value || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
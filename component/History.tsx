'use client'

import React, { useState, useEffect } from 'react';

interface HistoryLog {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  data?: any;
}

const HistoryDashboard: React.FC = () => {
  const [logs, setLogs] = useState<HistoryLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token'); 
      
      const response = await fetch(`http:localhost:5000/api/v1/logs/get`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setLogs(result.data);
      } else {
        setError(result.error || 'Failed to fetch history');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
    
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Medical History</h1>
          <p className="text-gray-600 mt-1">Your training data records</p>
        </div>
        <button 
          onClick={fetchHistory}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your history...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && logs.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No History Found</h3>
          <p className="text-gray-600 mb-4">You don't have any medical training data yet.</p>
          <button 
            onClick={fetchHistory}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Refresh to check again
          </button>
        </div>
      )}

      {/* History List */}
      {!loading && !error && logs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Showing {logs.length} record{logs.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {logs.map((log, index) => (
            <div key={log.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 text-blue-800 rounded-lg px-3 py-1 text-sm font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Record ID: {log.id.slice(0, 8)}...
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created: {formatDate(log.createdAt)}
                      </p>
                      {log.updatedAt !== log.createdAt && (
                        <p className="text-sm text-gray-500">
                          Updated: {formatDate(log.updatedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>

                {/* Data Preview */}
                {log.data && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Data Preview:</h4>
                    <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {typeof log.data === 'string' 
                          ? log.data.slice(0, 200) 
                          : JSON.stringify(log.data, null, 2).slice(0, 200)
                        }
                        {(typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)).length > 200 && '...'}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center justify-end space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    View Details
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors">
                    Export
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryDashboard;
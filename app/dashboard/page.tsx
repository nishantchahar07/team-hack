'use client'

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  FileText,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Heart,
  Download
} from 'lucide-react';

interface TestData {
  name: string;
  value: number | string | null;
  riskCategory: string;
  interpretation: string;
  referenceRange: string;
}

interface PatientData {
  age: number;
  name: string;
  gender: string;
}

interface StructuredData {
  tests: TestData[];
  patient: PatientData;
  summary: string;
}

interface ReportData {
  id: string;
  structuredData: {
    filename: string;
    timestamp: string;
    session_id: string;
    structured_data: StructuredData;
    raw_extracted_data: string;
  };
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data: ReportData[];
}

const Dashboard: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setReports(result.data);
      } else {
        setError('Failed to fetch medical reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
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

  const getRiskColor = (riskCategory: string) => {
    switch (riskCategory.toLowerCase()) {
      case 'optimal':
      case 'normal':
      case 'low risk':
      case 'no risk':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'borderline':
      case 'near or above-optimal':
      case 'average risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high risk':
      case 'high':
      case 'moderate risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'very high risk':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (riskCategory: string) => {
    switch (riskCategory.toLowerCase()) {
      case 'optimal':
      case 'normal':
      case 'low risk':
      case 'no risk':
        return <CheckCircle className="w-4 h-4" />;
      case 'borderline':
      case 'near or above-optimal':
      case 'average risk':
        return <AlertTriangle className="w-4 h-4" />;
      case 'high risk':
      case 'high':
      case 'moderate risk':
      case 'very high risk':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTestIcon = (testName: string) => {
    if (testName.toLowerCase().includes('cholesterol')) {
      return <Heart className="w-5 h-5" />;
    }
    if (testName.toLowerCase().includes('triglycerides')) {
      return <TrendingUp className="w-5 h-5" />;
    }
    if (testName.toLowerCase().includes('troponin')) {
      return <Activity className="w-5 h-5" />;
    }
    return <BarChart3 className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Medical Dashboard</h1>
            <p className="text-lg text-gray-600 mt-1">Your health reports and analysis</p>
          </div>
          <button
            onClick={fetchReports}
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
            <p className="text-gray-600">Loading your reports...</p>
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
        {!loading && !error && reports.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reports Found</h3>
            <p className="text-gray-600 mb-4">You haven&apos;t uploaded any medical reports yet.</p>
            <button
              onClick={fetchReports}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Refresh to check again
            </button>
          </div>
        )}

        {/* Reports Grid */}
        {!loading && !error && reports.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                Showing {reports.length} report{reports.length !== 1 ? 's' : ''}
              </p>
            </div>

            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{report.structuredData.structured_data.patient.name}</h3>
                        <p className="text-blue-100">
                          {report.structuredData.structured_data.patient.age} years old, {report.structuredData.structured_data.patient.gender}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-blue-100">Report Date</p>
                      <p className="font-medium">{formatDate(report.createdAt)}</p>
                    </div>
                  </div>

                  {/* Filename */}
                  <div className="mt-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">File:</span>
                        <span className="font-medium text-sm truncate">{report.structuredData.filename}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Summary Section */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Medical Summary</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{report.structuredData.structured_data.summary}</p>
                    </div>
                  </div>

                  {/* Test Results */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Test Results</h4>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {report.structuredData.structured_data.tests
                        .filter(test => test.value !== null && test.value !== "")
                        .map((test, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              {getTestIcon(test.name)}
                              <h5 className="font-medium text-gray-800 text-sm">{test.name}</h5>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-gray-900">{test.value}</span>
                                {test.riskCategory && (
                                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(test.riskCategory)}`}>
                                    {getRiskIcon(test.riskCategory)}
                                    <span className="ml-1">{test.riskCategory}</span>
                                  </div>
                                )}
                              </div>
                              
                              {test.referenceRange && (
                                <p className="text-xs text-gray-500">
                                  Range: {test.referenceRange}
                                </p>
                              )}
                              
                              {test.interpretation && (
                                <p className="text-xs text-gray-600">
                                  {test.interpretation}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-lg font-bold text-blue-800">{report.structuredData.structured_data.patient.age}</div>
                      <div className="text-xs text-blue-600">Age (Years)</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <div className="text-lg font-bold text-purple-800">{report.structuredData.structured_data.patient.gender}</div>
                      <div className="text-xs text-purple-600">Gender</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <div className="text-lg font-bold text-green-800">{report.structuredData.structured_data.tests.length}</div>
                      <div className="text-xs text-green-600">Tests</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Processed: {formatDate(report.structuredData.timestamp)}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Award,
  Clock,
  Search,
  Filter,
  Users,
  Heart,
  Star,
  CheckCircle,
  Calendar,
  Globe
} from 'lucide-react';

interface Location {
  id: string;
  lat: number;
  lng: number;
  address: string;
}

interface NurseData {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  language: string;
  gender: string;
  phone: string;
  email: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  locationId: string;
  Location: Location;
  distance?: number;
}

interface ApiResponse {
  success: boolean;
  data: NurseData[];
}

export default function Nurses() {
  const [nurses, setNurses] = useState<NurseData[]>([]);
  const [filteredNurses, setFilteredNurses] = useState<NurseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'distance' | 'experience'>('name');

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }, []);

  // Get user's current location
  const getUserLocation = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      }
    });
  }, []);

  // Initialize user location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const position = await getUserLocation();
        setUserCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationError('');
      } catch (error) {
        console.warn('Could not get user location:', error);
        setLocationError('Location access denied. Distance calculation unavailable.');
      }
    };

    initializeLocation();
  }, [getUserLocation]);

  const fetchNurses = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nurses/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch nurses');
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        let nursesData = result.data;
        
        // Calculate distances if user coordinates are available
        if (userCoordinates) {
          nursesData = nursesData.map(nurse => ({
            ...nurse,
            distance: calculateDistance(
              userCoordinates.lat,
              userCoordinates.lng,
              nurse.Location.lat,
              nurse.Location.lng
            )
          }));
          
          // Sort by distance
          nursesData.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        }
        
        setNurses(nursesData);
        setFilteredNurses(nursesData);
      } else {
        setError('Failed to fetch nurses data');
      }
    } catch (error) {
      console.error('Error fetching nurses:', error);
      setError('Network error occurred while fetching nurses');
    } finally {
      setLoading(false);
    }
  }, [userCoordinates, calculateDistance]);

  useEffect(() => {
    fetchNurses();
  }, [fetchNurses]);

  useEffect(() => {
    let filtered = nurses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(nurse =>
        nurse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nurse.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialization
    if (filterSpecialization) {
      filtered = filtered.filter(nurse => nurse.specialization === filterSpecialization);
    }

    // Filter by gender
    if (filterGender) {
      filtered = filtered.filter(nurse => nurse.gender === filterGender);
    }

    // Filter by language
    if (filterLanguage) {
      filtered = filtered.filter(nurse => nurse.language === filterLanguage);
    }

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          if (!a.distance && !b.distance) return 0;
          if (!a.distance) return 1;
          if (!b.distance) return -1;
          return a.distance - b.distance;
        case 'experience':
          return b.experienceYears - a.experienceYears;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredNurses(filtered);
  }, [nurses, searchTerm, filterSpecialization, filterGender, filterLanguage, sortBy]);

  const getSpecializations = () => {
    return [...new Set(nurses.map(nurse => nurse.specialization))];
  };

  const getLanguages = () => {
    return [...new Set(nurses.map(nurse => nurse.language))];
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSpecialization('');
    setFilterGender('');
    setFilterLanguage('');
    setSortBy('name');
  };

  const getSpecializationIcon = (specialization: string) => {
    switch (specialization.toLowerCase()) {
      case 'general':
        return <Users className="w-5 h-5" />;
      case 'pediatrics':
        return <Heart className="w-5 h-5" />;
      case 'emergency care':
        return <Award className="w-5 h-5" />;
      case 'geriatrics':
        return <Clock className="w-5 h-5" />;
      case 'neurology':
        return <Star className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Our Professional Nurses
          </h1>
          <p className="text-lg text-gray-600">
            Find qualified healthcare professionals ready to assist you
          </p>
          {locationError && (
            <div className="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2 inline-block">
              {locationError}
            </div>
          )}
          {userCoordinates && (
            <div className="mt-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-2 inline-block">
              📍 Location detected - distances calculated
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'distance' | 'experience')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="distance">Sort by Distance</option>
                <option value="experience">Sort by Experience</option>
              </select>
            </div>

            {/* Specialization Filter */}
            <div>
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Specializations</option>
                {getSpecializations().map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Languages</option>
                {getLanguages().map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Showing {filteredNurses.length} of {nurses.length} nurses
              </span>
              {(searchTerm || filterSpecialization || filterGender || filterLanguage || sortBy !== 'name') && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <button
              onClick={fetchNurses}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading nurses...</p>
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
        {!loading && !error && filteredNurses.length === 0 && nurses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Nurses Found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && nurses.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Nurses Available</h3>
            <p className="text-gray-600 mb-4">There are currently no nurses in our system.</p>
            <button
              onClick={fetchNurses}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Refresh to check again
            </button>
          </div>
        )}

        {/* Nurses Grid */}
        {!loading && !error && filteredNurses.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNurses.map((nurse) => (
              <div
                key={nurse.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{nurse.name}</h3>
                        <div className="flex items-center space-x-1">
                          {getSpecializationIcon(nurse.specialization)}
                          <span className="text-blue-100 text-sm">{nurse.specialization}</span>
                        </div>
                      </div>
                    </div>

                    {/* Availability Badge */}
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      nurse.available 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {nurse.available ? 'Available' : 'Busy'}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-lg font-bold text-blue-800">{nurse.experienceYears}y</div>
                      <div className="text-xs text-blue-600">Experience</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <div className="text-lg font-bold text-purple-800 capitalize">
                        {nurse.gender.toLowerCase()}
                      </div>
                      <div className="text-xs text-purple-600">Gender</div>
                    </div>
                  </div>

                  {/* Distance Display */}
                  {nurse.distance && (
                    <div className="flex items-center justify-center mb-4 p-2 bg-green-50 rounded-lg">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {nurse.distance.toFixed(1)} km away
                      </span>
                    </div>
                  )}

                  {/* Language */}
                  <div className="flex items-center justify-center mb-4 p-2 bg-gray-50 rounded-lg">
                    <Globe className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{nurse.language}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{nurse.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-green-500" />
                      <span className="truncate">{nurse.email}</span>
                    </div>
                    <div className="flex items-start text-gray-600">
                      <Globe className="w-4 h-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                      <span className="text-xs leading-relaxed">{nurse.Location.address}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Book Appointment</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
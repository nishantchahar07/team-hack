import React, { useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Award, User, Calendar } from 'lucide-react';
import axios from 'axios';

export default function NurseProfileCard() {

    const id = 1;

    const [nurseData, setNurseData] = React.useState({
        "id": "",
        "name": "",
        "specialization": "",
        "experienceYears": 0,
        "language": "",
        "gender": "",
        "phone": "",
        "email": "",
        "available": true,
        "Location": {
            "id": "",
            "lat": 0,
            "lng": 0,
            "address": ""
        }
    });

    useEffect(() => {
        const fetchNurseData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nurses/${id}`);
                setNurseData(response.data);
            } catch (error) {
                console.error('Error fetching nurse data:', error);
            }
        };

        fetchNurseData();
    }, []);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 flex items-center justify-center">
            <div className="max-w-2xl w-full">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-gray-100">
                    {/* Header Section */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-8 text-white">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="relative z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                                        <User className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold mb-1">{nurseData.name}</h1>
                                        <p className="text-blue-100 text-lg font-medium">{nurseData.specialization} Specialist</p>
                                        <p className="text-blue-200 text-sm">{nurseData.experienceYears} years of experience</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${nurseData.available
                                        ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                                        : 'bg-red-500/20 text-red-100 border border-red-400/30'
                                        }`}>
                                        <div className={`w-2 h-2 rounded-full mr-2 ${nurseData.available ? 'bg-green-400' : 'bg-red-400'
                                            }`}></div>
                                        {nurseData.available ? 'Available' : 'Unavailable'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                                <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-blue-800">{nurseData.experienceYears}</div>
                                <div className="text-sm text-blue-600 font-medium">Years Experience</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                                <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <div className="text-lg font-bold text-purple-800 capitalize">{nurseData.gender.toLowerCase()}</div>
                                <div className="text-sm text-purple-600 font-medium">Gender</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl border border-pink-200">
                                <div className="text-lg font-bold text-pink-800">{nurseData.language}</div>
                                <div className="text-sm text-pink-600 font-medium">Language</div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4 mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                Contact Information
                            </h3>

                            <div className="grid gap-4">
                                <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <Phone className="w-5 h-5 text-green-600 mr-4" />
                                    <div>
                                        <div className="font-medium text-gray-800">Phone</div>
                                        <div className="text-gray-600">{nurseData.phone}</div>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <Mail className="w-5 h-5 text-blue-600 mr-4" />
                                    <div>
                                        <div className="font-medium text-gray-800">Email</div>
                                        <div className="text-gray-600">{nurseData.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <MapPin className="w-5 h-5 text-red-600 mr-4" />
                                    <div>
                                        <div className="font-medium text-gray-800">Location</div>
                                        <div className="text-gray-600">{nurseData.Location.address}</div>
                                        <div className="text-sm text-gray-500">
                                            Coordinates: {nurseData.Location.lat}, {nurseData.Location.lng}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Information */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                                Profile Timeline
                            </h3>

                            
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8">
                            <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Contact Nurse
                            </button>
                            <button className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                                View Schedule
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile ID Footer */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                        Profile ID: <span className="font-mono text-gray-600">{nurseData.id}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
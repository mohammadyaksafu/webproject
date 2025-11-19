import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";

const HallInfo = () => {
  const [hallInfo, setHallInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHallInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const hallName = user.hallName;

        if (!hallName) {
          setError("No hall name found. Please login first.");
          setLoading(false);
          return;
        }

        // Fetch hall by name
        const response = await axios.get(
          `http://localhost:8080/api/halls/name/${encodeURIComponent(hallName)}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setHallInfo(response.data);
      } catch (err) {
        console.error("Error fetching hall info:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch hall information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHallInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#00df9a] mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading hall information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center py-12 px-4">
        <div className="bg-red-900 border border-red-700 rounded-lg p-8 max-w-md w-full">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-400 mr-3" />
            <h2 className="text-xl font-bold text-red-100">Error</h2>
          </div>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!hallInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 text-lg">No hall information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-[#00df9a] to-green-500 rounded-full mb-6">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#00df9a] mb-2">
            Hall Information
          </h1>
          <p className="text-gray-400">
            {hallInfo.hallName} ({hallInfo.hallCode})
          </p>
        </div>

        {/* Main Info Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden mb-8">
          {/* Hall Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={
                hallInfo.imageUrl ||
                "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
              alt={hallInfo.hallName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-3xl font-bold text-white">
                {hallInfo.hallName}
              </h2>
              <p className="text-gray-300">{hallInfo.hallCode}</p>
            </div>
          </div>

          {/* Hall Details */}
          <div className="p-8">
            {/* Description */}
            {hallInfo.description && (
              <p className="text-gray-300 mb-8 leading-relaxed">
                {hallInfo.description}
              </p>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Capacity Info */}
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-[#00df9a] mr-3" />
                  <h3 className="text-lg font-bold text-white">Capacity</h3>
                </div>
                <p className="text-3xl font-bold text-[#00df9a] mb-2">
                  {hallInfo.capacity}
                </p>
                <p className="text-gray-400">
                  Current: {hallInfo.currentOccupancy}
                </p>
                <p className="text-sm text-gray-500">
                  Available: {hallInfo.capacity - hallInfo.currentOccupancy}
                </p>
              </div>

              {/* Hall Type */}
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Building2 className="h-6 w-6 text-[#00df9a] mr-3" />
                  <h3 className="text-lg font-bold text-white">Hall Type</h3>
                </div>
                <p className="text-2xl font-bold text-[#00df9a]">
                  {hallInfo.type === "MALE" ? "Male Hall" : "Female Hall"}
                </p>
                <p className="text-gray-400 mt-2">
                  {hallInfo.isActive ? (
                    <span className="text-green-400">● Active</span>
                  ) : (
                    <span className="text-red-400">● Inactive</span>
                  )}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-[#00df9a]/10 to-green-500/10 rounded-lg p-6 border border-[#00df9a]/20 mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-[#00df9a]" />
                Contact Information
              </h3>

              <div className="space-y-4">
                {/* Provost */}
                {hallInfo.provost && (
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-[#00df9a] mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Provost</p>
                      <p className="text-white font-semibold">
                        {hallInfo.provost}
                      </p>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {hallInfo.phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-[#00df9a] mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <a
                        href={`tel:${hallInfo.phone}`}
                        className="text-white font-semibold hover:text-[#00df9a] transition-colors"
                      >
                        {hallInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {hallInfo.email && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-[#00df9a] mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a
                        href={`mailto:${hallInfo.email}`}
                        className="text-white font-semibold hover:text-[#00df9a] transition-colors break-all"
                      >
                        {hallInfo.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Office Location */}
                {hallInfo.officeLocation && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-[#00df9a] mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Office Location</p>
                      <p className="text-white font-semibold">
                        {hallInfo.officeLocation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Office Hours */}
            {hallInfo.officeHours && (
              <div className="bg-gray-700 rounded-lg p-6 mb-8">
                <h4 className="text-lg font-bold text-white mb-2">
                  Office Hours
                </h4>
                <p className="text-gray-300">{hallInfo.officeHours}</p>
              </div>
            )}

            {/* Facilities */}
            {hallInfo.facilities && (
              <div>
                <h4 className="text-lg font-bold text-white mb-4">
                  Available Facilities
                </h4>
                <div className="flex flex-wrap gap-3">
                  {hallInfo.facilities.split(",").map((facility, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-[#00df9a] to-green-500 text-black px-4 py-2 rounded-full font-semibold text-sm"
                    >
                      {facility.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallInfo;
import React, { useState, useEffect } from "react";
import {   Users,  MapPin,   Building2,   Star,   Wifi,   Utensils,   BookOpen,   Phone,   Mail,  Search, Filter, ChevronDown,  ChevronUp,  Shield,  Dumbbell,  TreePine, Eye,  Loader2  } from "lucide-react";
import Footer from "../../components/common/Footer";

export default function AboutHall() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [expandedHall, setExpandedHall] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalHalls: 0,
    totalCapacity: 0,
    totalOccupancy: 0,
    availableSeats: 0
  });

  // Fetch halls data from backend
  useEffect(() => {
    const fetchHallsData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/halls');
        
        if (!response.ok) {
          throw new Error('Failed to fetch halls data');
        }
        
        const hallsData = await response.json();
        setHalls(hallsData);
        
        
        const totalCapacity = hallsData.reduce((sum, hall) => sum + hall.capacity, 0);
        const totalOccupancy = hallsData.reduce((sum, hall) => sum + hall.currentOccupancy, 0);
        const availableSeats = totalCapacity - totalOccupancy;
        
        setStats({
          totalHalls: hallsData.length,
          totalCapacity,
          totalOccupancy,
          availableSeats
        });
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching halls data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHallsData();
  }, []);

  
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [capacityRes, occupancyRes, availableRes] = await Promise.all([
          fetch('http://localhost:8080/api/halls/statistics/capacity'),
          fetch('http://localhost:8080/api/halls/statistics/occupancy'),
          fetch('http://localhost:8080/api/halls/statistics/available')
        ]);

        if (capacityRes.ok && occupancyRes.ok && availableRes.ok) {
          const capacity = await capacityRes.json();
          const occupancy = await occupancyRes.json();
          const available = await availableRes.json();

          setStats(prev => ({
            ...prev,
            totalCapacity: capacity,
            totalOccupancy: occupancy,
            availableSeats: available
          }));
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
      }
    };

    if (halls.length > 0) {
      fetchStatistics();
    }
  }, [halls]);

  
  const filteredHalls = halls.filter(hall => {
    const matchesSearch = hall.hallName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hall.hallCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hall.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "All" || 
                       (selectedType === "Male" && hall.type === "MALE") ||
                       (selectedType === "Female" && hall.type === "FEMALE");
    
    return matchesSearch && matchesType;
  });

  const facilityIcons = {
    "Wi-Fi": <Wifi className="h-4 w-4" />,
    "Common Room": <Users className="h-4 w-4" />,
    "Dining": <Utensils className="h-4 w-4" />,
    "Library": <BookOpen className="h-4 w-4" />,
    "Gym": <Dumbbell className="h-4 w-4" />,
    "Sports": <Star className="h-4 w-4" />,
    "Security": <Shield className="h-4 w-4" />,
    "Study Room": <BookOpen className="h-4 w-4" />,
    "Gardens": <TreePine className="h-4 w-4" />
  };

  const getFacilitiesArray = (facilitiesString) => {
    if (!facilitiesString) return [];
    return facilitiesString.split(',').map(facility => facility.trim());
  };

  const getOccupancyPercentage = (capacity, occupancy) => {
    return capacity > 0 ? Math.round((occupancy / capacity) * 100) : 0;
  };

  const getOccupancyColor = (percentage) => {
    if (percentage < 60) return "bg-green-500";
    if (percentage < 85) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#00df9a] mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading hall information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Eye className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#00df9a] text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search halls by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-5 w-5" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hall Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00df9a] focus:border-transparent"
                  >
                    <option value="All">All Halls</option>
                    <option value="Male">Male Halls</option>
                    <option value="Female">Female Halls</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-[#00df9a] mb-2">{stats.totalHalls}</div>
            <div className="text-gray-600 font-medium">Residential Halls</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-[#00df9a] mb-2">{stats.totalCapacity}</div>
            <div className="text-gray-600 font-medium">Total Capacity</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-[#00df9a] mb-2">{stats.totalOccupancy}</div>
            <div className="text-gray-600 font-medium">Current Residents</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-[#00df9a] mb-2">{stats.availableSeats}</div>
            <div className="text-gray-600 font-medium">Available Seats</div>
          </div>
        </div>

        {/* Halls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredHalls.map((hall) => (
            <div
              key={hall.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
            >
              {/* Hall Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hall.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                  alt={hall.hallName}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    hall.type === "MALE" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-pink-100 text-pink-800"
                  }`}>
                    {hall.type === "MALE" ? "Male" : "Female"}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">{hall.hallName}</h3>
                  <p className="text-white/90 text-sm">{hall.hallCode}</p>
                </div>
              </div>

              {/* Hall Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{hall.currentOccupancy}/{hall.capacity} students</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {getOccupancyPercentage(hall.capacity, hall.currentOccupancy)}% occupied
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full ${getOccupancyColor(getOccupancyPercentage(hall.capacity, hall.currentOccupancy))}`}
                    style={{ width: `${getOccupancyPercentage(hall.capacity, hall.currentOccupancy)}%` }}
                  ></div>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {hall.description || "Comfortable residential facility with modern amenities."}
                </p>

                {/* Contact Info */}
                {expandedHall === hall.id && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Provost: {hall.provost || "TBA"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{hall.phone || "Not available"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{hall.email || "Not available"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{hall.officeLocation || "Hall Administration Office"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Facilities */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Facilities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {getFacilitiesArray(hall.facilities).slice(0, 4).map((facility, idx) => (
                      <div
                        key={idx}
                        className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-xs text-gray-600 border border-gray-200"
                      >
                        {facilityIcons[facility] || <Star className="h-3 w-3" />}
                        <span className="ml-1">{facility}</span>
                      </div>
                    ))}
                    {getFacilitiesArray(hall.facilities).length > 4 && (
                      <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-xs text-gray-600 border border-gray-200">
                        <span>+{getFacilitiesArray(hall.facilities).length - 4} more</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setExpandedHall(expandedHall === hall.id ? null : hall.id)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
                  >
                    {expandedHall === hall.id ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Less Info
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        More Info
                      </>
                    )}
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-gray-900 to-black text-white py-2 rounded-lg font-semibold hover:from-[#00df9a] hover:to-green-500 transition-all duration-300 flex items-center justify-center text-sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHalls.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No halls found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
        <div className="mb-10"></div>
      <Footer/> 
      </div>
       
    </div>
  );
}
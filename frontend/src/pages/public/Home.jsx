import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Loader2, Eye } from "lucide-react";
import axios from 'axios';
import Feature from "../../components/Feature";
import Footer from "../../components/common/Footer";
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

 useEffect(() => {
  const fetchHallsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/halls');
      
      setHalls(response.data);
      setError(null);

    } catch (err) {
      console.error('Error fetching halls data:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchHallsData();
}, []);
  


  
  useEffect(() => {
    if (halls.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % halls.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [halls.length]);

  const nextSlide = () => {
    if (halls.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % halls.length);
  };

  const prevSlide = () => {
    if (halls.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + halls.length) % halls.length);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-20">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            SUST Hall Management
            <span className="block text-[#00df9a]">System</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Streamlining hall operations and enhancing student campus experience at Shahjalal University of Science & Technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-[#00df9a] text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-white transition-all duration-300 transform hover:scale-105"
            >
              Student Login
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
            >
              New Registration
            </Link>
          </div>
        </div>
      </section>

      {/* Halls Carousel Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Halls
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the comfortable and modern residential facilities at SUST
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {halls.map((hall, index) => (
                  <div key={hall.id || index} className="w-full flex-shrink-0">
                    <div className="relative h-96 md:h-[500px]">
                      <img
                        src={hall.imageUrl}
                        alt={hall.hallName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                          <h3 className="text-2xl md:text-3xl font-bold mb-2">
                            {hall.hallName} ({hall.hallCode})
                          </h3>
                          <p className="text-lg text-gray-200">
                            {hall.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            {halls.length > 0 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                >
                  <ArrowRight className="h-6 w-6" />
                </button>

                {/* Indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                  {halls.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-[#00df9a]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      
      <Feature />
      <Footer />
    </div>
  );
};

export default Home;
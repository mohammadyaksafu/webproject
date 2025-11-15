// App.js
import React from 'react';
import Navbar from './components/common/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto mt-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Hall Management System
          </h1>
          <p className="text-gray-600 text-center">
            Welcome to our comprehensive hall management platform. Browse our services and facilities.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
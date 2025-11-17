import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import { routes } from "./routes";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}

          {/* fallback (optional) */}
          <Route path="*" element={<div className="p-10">Page not found</div>} />
        </Routes>
      </main>
    </Router>
  );
}

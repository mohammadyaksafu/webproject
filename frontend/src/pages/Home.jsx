import React from "react";

export default function Home() {
  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Welcome to SUST Hall Management System</h2>

      <p className="text-lg text-gray-700 leading-7">
        This Hall Management System is designed for SUST students to easily manage hall-related services.
        Before signing in, you can explore basic information about halls, facilities, and the system workflow.
      </p>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold">What You Can Do:</h3>
        <ul className="list-disc pl-6 mt-2 text-gray-700">
          <li>Know SUST hall overview</li>
          <li>Learn rules and regulations</li>
          <li>See available facilities</li>
          <li>Know how seat allocation works</li>
          <li>Contact hall authority</li>
        </ul>
      </div>
    </div>
  );
}
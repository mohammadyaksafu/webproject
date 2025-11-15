import React from "react";

export default function AboutHall() {
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">About SUST Halls</h2>
      <p className="text-lg text-gray-700 leading-7">
        Shahjalal University of Science & Technology (SUST) has several residential halls
        for students. Here you'll get basic information about halls, seat plans, facilities,
        and other important notices.
      </p>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold">Hall List:</h3>
        <ul className="list-disc pl-6 mt-2 text-gray-700">
          <li>Shah Paran Hall (SHPH)</li>
          <li>Bijoy 24 Hall (B24H)</li>
          <li>Syed Mujtaba Ali Hall (SMAH)</li>
          <li>Ayesha Siddiqa Hall (ASH)</li>
          <li>Begum Sirajunnesa Chowdhury Hall (BSCH)</li>
          <li>Fatimah Tuz Zahra Hall (FTZH)</li>
        </ul>
      </div>
    </div>
  );
}
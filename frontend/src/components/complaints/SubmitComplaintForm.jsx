import React from "react";

export default function SubmitComplaintForm({
  formData,
  handleChange,
  handleSubmit,
  categories,
  loading
}) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Submit New Complaint</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Complaint title"
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
          required
        />

        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
          required
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Priority */}
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
          required
        />

        <button
          type="submit"
          className="px-8 py-3 bg-[#00df9a] text-black rounded-lg font-bold"
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}

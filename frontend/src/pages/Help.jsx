import React, { useState } from "react";
import HelpCard from "../components/HelpCard";
import { useNavigate } from "react-router-dom";

const Help = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const topics = [
    { title: "Ride fare related Issues", icon: "🛵", path: "/help/fares" },
    { title: "Captain and Vehicle related issues", icon: "🚗", path: "/help/captain" },
    { title: "Pass and Payment related Issues", icon: "💸", path: "/help/payment" },
    { title: "Parcel Related Issues", icon: "📦", path: "/help/parcel" },
    { title: "Other Topics", icon: "⚙️", path: "/help/other" },
  ];

  const filteredTopics = topics.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <i
          className="ri-arrow-left-line text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        ></i>
        <h1 className="text-xl font-semibold">Help</h1>
        <button className="px-4 py-2 border rounded-lg text-sm">
          🎟️ Tickets
        </button>
      </div>

      <input
        type="text"
        placeholder="Search Help Topics"
        className="w-full p-3 mb-4 rounded-xl border focus:outline-none focus:ring-1 focus:ring-yellow-400"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div>
        {filteredTopics.map((topic, i) => (
          <HelpCard key={i} {...topic} />
        ))}
      </div>
    </div>
  );
};

export default Help;

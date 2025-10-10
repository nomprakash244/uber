import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const faqsData = {
  fares: {
    title: "Ride fare related Issues",
    questions: [
      "I have been charged higher than the estimated fare",
      "I have been charged a cancellation fee",
      "I didn’t take the ride but was charged",
      "I didn't receive cashback in my wallet",
      "Billing Related Issues",
    ],
  },
  captain: {
    title: "Captain and Vehicle related issues",
    questions: [
      "Captain was rude or unprofessional",
      "Captain was driving dangerously",
      "Captain asked me to cancel the ride",
      "Captain was demanding extra cash",
      "Captain/Vehicle details didn't match",
      "I left an item in the vehicle",
    ],
  },
  payment: {
    title: "Pass and Payment related Issues",
    questions: ["Payment & Wallets", "Rapido Coins", "Power Pass"],
  },
  parcel: {
    title: "Parcel Related Issues",
    questions: [
      "My order was not delivered",
      "Items are damaged",
      "Few items are missing",
      "I am unable to contact the captain",
      "I have an issue with the payment",
    ],
  },
  other: {
    title: "Other Topics",
    questions: ["My issue is not mentioned above", "Contact Support"],
  },
};

const Faqs = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const data = faqsData[category];

  if (!data) return <div className="p-4">Invalid Category</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <i
          className="ri-arrow-left-line text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        ></i>
        <h1 className="text-xl font-semibold">{data.title}</h1>
        <button className="px-4 py-2 border rounded-lg text-sm">
          🎟️ Tickets
        </button>
      </div>

      <div className="space-y-3">
        {data.questions.map((q, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/help/${category}/${i}`)}
          >
            <p>{q}</p>
            <i className="ri-arrow-right-s-line text-2xl text-gray-400"></i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;

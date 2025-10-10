import React from "react";
import { useNavigate } from "react-router-dom";

const HelpCard = ({ icon, title, path }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center bg-white p-4 mb-3 rounded-xl shadow-sm cursor-pointer hover:bg-gray-100 transition"
      onClick={() => navigate(path)}
    >
      <div className="text-3xl mr-4">{icon}</div>
      <div className="flex justify-between w-full">
        <p className="font-medium">{title}</p>
        <i className="ri-arrow-right-s-line text-2xl text-gray-400"></i>
      </div>
    </div>
  );
};

export default HelpCard;

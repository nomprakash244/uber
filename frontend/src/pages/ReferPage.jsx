import React from "react";
import { motion } from "framer-motion";
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";

const ReferPage = () => {

    const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] font-sans relative overflow-hidden">
      {/* --- HEADER --- */}
      <motion.div
        className="bg-[#1A73E8] text-white p-6 rounded-b-3xl shadow-md relative"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <i
        className="ri-arrow-left-line text-2xl cursor-pointer"
        onClick={() => navigate(-1)}
      ></i>

          {/* Title */}
          <h2 className="text-lg font-semibold">Refer Friends</h2>

          {/* FAQs */}
          <i className="ri-question-line text-2xl cursor-pointer"></i>
        </div>

        {/* Heading Text */}
        <div className="text-center mt-6">
          <motion.h3
            className="text-xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Earn upto ₹50 per friend you invite to Speedo
          </motion.h3>

          <motion.div
            className="mt-4 inline-flex items-center gap-3 bg-white text-[#1A73E8] font-mono px-4 py-2 rounded-lg border border-dashed border-[#1A73E8]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span>SPD1234</span>
            <i className="ri-file-copy-line text-xl cursor-pointer"></i>
          </motion.div>
        </div>

        {/* Illustration */}
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          
        </motion.div>
      </motion.div>

      {/* --- INVITE BOX --- */}
      <motion.div
        className="bg-white mx-4 mt-[-30px] rounded-xl shadow-md z-10 p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <i className="ri-user-add-line text-2xl"></i>
          <p className="font-medium">Invite Friends to Speedo</p>
        </div>
        <button className="text-[#1A73E8] font-semibold">Invite</button>
      </motion.div>

      {/* --- HOW IT WORKS SECTION --- */}
      <motion.div
        className="bg-white mx-4 mt-4 rounded-xl shadow-md p-5"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">How it works?</h3>
          <p className="text-[#1A73E8] text-sm cursor-pointer">T&Cs</p>
        </div>

        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Your friend completes 1 order</p>
            <p className="text-sm text-gray-500">
              within 7 days of registration
            </p>
            <p className="text-sm text-green-600 mt-1">Friend earns ₹25 coins</p>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 bg-[#FFF8E1] border border-yellow-300 rounded-lg px-3 py-1">
              <img
                src="https://cdn-icons-png.flaticon.com/512/8146/8146003.png"
                alt="Coin"
                className="w-5 h-5"
              />
              <span className="font-semibold text-yellow-600">₹50</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">you earn</p>
          </div>
        </div>
      </motion.div>

      {/* --- FOOTER BUTTONS --- */}
      <motion.div
        className="mt-auto p-6 space-y-3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <button className="w-full py-3 border border-gray-400 rounded-lg font-medium hover:bg-gray-50">
          Invite 478 Friends to Speedo
        </button>

        <button className="w-full py-3 bg-[#FFC107] rounded-lg font-semibold text-black hover:bg-[#ffcd29] transition">
          Refer Now
        </button>
      </motion.div>
    </div>
  );
};

export default ReferPage;

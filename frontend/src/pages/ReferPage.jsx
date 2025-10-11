import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";

const ReferPage = () => {
  const navigate = useNavigate();
  const referralCode = "SPD1234";

  const [showToast, setShowToast] = useState(false);

  // ✅ Copy to clipboard with toast
  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // ✅ WhatsApp share
  const handleWhatsAppShare = () => {
    const message = `🚀 Join Speedo now and earn rewards!\nUse my referral code: *${referralCode}* to sign up.\n\n👉 Download Speedo and start earning: https://speedoapp.com`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

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
          <i
            className="ri-arrow-left-line text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          ></i>
          <h2 className="text-lg font-semibold">Refer Friends</h2>
          <i className="ri-question-line text-2xl cursor-pointer"></i>
        </div>

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
            <span>{referralCode}</span>
            <i
              className="ri-file-copy-line text-xl cursor-pointer hover:text-blue-600 transition"
              onClick={handleCopy}
              title="Copy referral code"
            ></i>
          </motion.div>
        </div>
      </motion.div>

      {/* --- INVITE BOX --- */}
      <motion.div
        className="bg-white mx-4 mt-[-30px] rounded-xl shadow-md z-10 p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <i className="ri-user-add-line text-2xl text-[#1A73E8]"></i>
          <p className="font-medium">Invite Friends to Speedo</p>
        </div>
        <button
          className="text-[#1A73E8] font-semibold flex items-center gap-2"
          onClick={handleWhatsAppShare}
        >
          <i className="ri-whatsapp-line text-xl"></i> Invite
        </button>
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
        <button
          className="w-full py-3 border border-gray-400 rounded-lg font-medium hover:bg-gray-50"
          onClick={handleWhatsAppShare}
        >
          Find friends to refer via WhatsApp
        </button>

        <button
          className="w-full py-3 bg-[#FFC107] rounded-lg font-semibold text-black hover:bg-[#ffcd29] transition"
          onClick={handleWhatsAppShare}
        >
          Refer Now
        </button>
      </motion.div>

      {/* ✅ Animated Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#323232] text-white text-sm px-4 py-2 rounded-full shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
          >
            ✅ Referral code copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReferPage;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Optional if you use routing

const PaymentPage = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // for navigation (optional)

  // Razorpay Payment Handler
  const handlePay = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const { data: order } = await axios.post("http://localhost:4000/api/payment/create-order", {
        amount: Number(amount),
      });

      const options = {
        key: "rzp_test_RSpbZbQ65aJzG2", // ⚠️ replace this
        amount: order.amount,
        currency: order.currency,
        name: "Razorpay Payment",
        description: "Pay securely via Razorpay",
        order_id: order.id,
        handler: function (response) {
          console.log("Payment successful:", response);
          setStep(3);
        },
        prefill: {
          name: "Guest User",
          email: "guest@example.com",
        },
        theme: {
          color: "#ff2d55",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", function () {
        alert("Payment failed. Please try again.");
        setStep(1);
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Common back icon component
  const BackIcon = ({ onClick }) => (
    <div className="absolute top-5 left-5 cursor-pointer" onClick={onClick}>
      <i className="ri-arrow-left-line text-2xl text-gray-700 hover:text-gray-900"></i>
    </div>
  );


  // Step 1 — Enter Amount
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-500 relative">
        <BackIcon onClick={() => navigate("/")} />
        <div className="bg-white rounded-2xl shadow-lg p-8 w-96 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">💰 Enter Payment Amount</h2>
          <input
            type="number"
            placeholder="Enter amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={() => setStep(2)}
            disabled={!amount}
            className={`w-full py-2 rounded-lg text-white font-semibold ${
              amount ? "bg-pink-600 hover:bg-pink-700" : "bg-gray-400"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    );
  }

  // Step 2 — Confirm & Pay
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-500 relative">
        <BackIcon onClick={() => setStep(1)} />
        <div className="bg-white rounded-2xl shadow-lg p-8 w-96 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Confirm Payment</h2>
          <p className="text-gray-500 mb-2">You’re about to pay</p>
          <h1 className="text-3xl font-bold mb-6">₹{amount}.00</h1>
          <button
            onClick={handlePay}
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-pink-600 hover:bg-pink-700"
            }`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    );
  }

  // Step 3 — Success
  if (step === 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 to-pink-500 text-white">
        <div className="bg-white text-gray-800 rounded-2xl shadow-lg p-8 w-96 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-6">Thank you for your payment 🎉</p>
          <button
            onClick={() => setStep(1)}
            className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700"
          >
            Make Another Payment
          </button>
        </div>
      </div>
    );
  }
};

export default PaymentPage;

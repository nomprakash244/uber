import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const faqAnswers = {
  fares: [
    "This usually happens due to traffic or route changes. Check your fare breakdown in the app.",
    "Cancellation fees are charged if the captain has already arrived or waited for a while.",
    "Please check your ride history; if you were charged wrongly, raise a support ticket.",
    "Cashback may take up to 24 hours to appear in your wallet.",
    "For billing-related issues, please contact our support team via Tickets.",
  ],
  captain: [
    "We’re sorry for your experience. Please share feedback with us via Tickets.",
    "Safety is our priority. Report dangerous driving immediately through the app.",
    "Captains should not ask riders to cancel. Report this so we can take action.",
    "Captains demanding extra cash is a violation. Please report it immediately.",
    "If vehicle details didn’t match, don’t take the ride and report the issue.",
    "You can use our Lost Item form in the Tickets section to recover your item.",
  ],
  payment: [
    "For payment issues, check your wallet and linked payment method.",
    "Rapido Coins are credited for eligible rides; please allow some time.",
    "Power Pass gives discounted rides; details available under your wallet tab.",
  ],
  parcel: [
    "If your order wasn’t delivered, raise a ticket with your order ID.",
    "We’re sorry your items were damaged; please attach photos in your support ticket.",
    "If some items are missing, verify with the captain and then contact support.",
    "You can call or message the captain from the ride details page.",
    "Payment issues can be raised through your Tickets tab.",
  ],
  other: [
    "If your issue isn’t listed, please describe it in detail via the Tickets page.",
    "You can reach our support 24/7 through the in-app help section.",
  ],
};

const FaqDetail = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();

  const question = faqAnswers[category]?.[id];
  const answer = faqAnswers[category]?.[id];

  if (!question) return <div className="p-4">Invalid FAQ</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <i
          className="ri-arrow-left-line text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        ></i>
        <h1 className="text-xl font-semibold">FAQ Details</h1>
        <button className="px-4 py-2 border rounded-lg text-sm">
          🎟️ Tickets
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-3">{question}</h2>
        <p className="text-gray-700 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export default FaqDetail;

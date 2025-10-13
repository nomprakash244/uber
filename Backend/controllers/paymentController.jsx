const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay");
const Payment = require("../models/Payment");

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency, userId } = req.body;

    const options = {
      amount: amount * 100,
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);

    // Save payment record to DB
    const payment = new Payment({
      user: userId,
      amount,
      currency,
      razorpay_order_id: order.id
    });
    await payment.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    const payment = await Payment.findOne({ razorpay_order_id });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    if (razorpay_signature === expectedSign) {
      payment.razorpay_payment_id = razorpay_payment_id;
      payment.razorpay_signature = razorpay_signature;
      payment.status = "paid";
      await payment.save();

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      payment.status = "failed";
      await payment.save();

      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

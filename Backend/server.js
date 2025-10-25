const http = require("http");
const app = require("./app");
const { initializeSocket } = require("./socket");
const Razorpay = require("razorpay"); // ✅ CommonJS import

const PORT = process.env.PORT || 3000;

// ✅ Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create order route
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Order creation failed", error });
  }
});

const server = http.createServer(app);

// ✅ Initialize socket if needed
initializeSocket(server);

server.listen(PORT,'0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

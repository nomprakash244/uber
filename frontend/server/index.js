import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4000"],
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Use your actual Gemini API key from Google AI Studio
const GEMINI_API_KEY = "AIzaSyCBAWyp3tUrm21hM8_V6V-aCL3T0Z1Xqw4";

// ✅ Updated Gemini endpoint (v1, and new model name)
const GEMINI_MODEL = "gemini-2.5-flash"; // or gemini-1.5-pro if you prefer higher quality

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  console.log("User message:", message);

  try {
    const response = await fetch(
      
      `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini API response:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.output ||
      data?.error?.message ||
      "I'm sorry, I couldn’t process that.";

    res.json({ reply });
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    res.status(500).json({ reply: "Error connecting to Gemini API." });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));

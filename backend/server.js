const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const { connectDB } = require("./src/db");
const adsRouter = require("./src/routes/ads");

const app = express();

// basic hardening & logging
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS: allow your React app origin(s)
app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = (process.env.CORS_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
      if (!origin || allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    }
  })
);

app.get("/", (_req, res) => res.json({ ok: true, service: "olx-prototype-api" }));
app.use("/api/ads", adsRouter);

// start
const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

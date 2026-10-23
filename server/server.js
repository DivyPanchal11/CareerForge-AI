const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const aptitudeRoutes = require("./routes/aptitudeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiResumeRoutes = require("./routes/aiResumeRoutes");
dotenv.config();

//connect to database
connectDB().then(() => {
  try {
    const { reconcileAllStaleReservations } = require("./services/creditService");
    reconcileAllStaleReservations();
  } catch (err) {
    console.warn("[Server] Credit reservation recovery init error:", err.message);
  }
}).catch(() => {});

const app = express();

//middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Static directory for uploaded avatars
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai/resume", aiResumeRoutes);

//test route
app.get("/",(req,res)=>{
    res.send("CareerForge AI backend is running...");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
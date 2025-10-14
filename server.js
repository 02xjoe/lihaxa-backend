import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { sendCompanyAndUserEmails } from "./sendEmail.js";
import Patient from "./models/Patient.js";
import Doctor from "./models/Doctor.js";
import waitlistRoutes from "./routes/waitlist.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Patient signup
app.post("/api/patient-signup", async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    console.log("Patient saved:", req.body);

    console.log("Calling sendCompanyAndUserEmails with:", req.body);
    const emailResult = await sendCompanyAndUserEmails({
      formData: req.body,
      userEmail: req.body.email,
      userName: req.body.fullName,
      subjectPrefix: "Lihaxa Waitlist: ",
    });

    if (!emailResult.ok) {
      console.error("Email failed:", emailResult.error);
      return res.status(500).json({
        success: false,
        message: "Patient registered, but email failed",
      });
    }

    res.json({
      success: true,
      message: "Patient registered successfully, emails sent",
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Doctor signup
app.post("/api/doctor-signup", async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    console.log("Doctor saved:", req.body);
    res.json({ success: true, message: "Doctor registered successfully" });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.use("/api", waitlistRoutes);
app.get("/", (req, res) => res.send("Lihaxa Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


/* import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import sendEmail from "./utils/sendEmail.js";
  // Models
import Patient from "./models/Patient.js";
import Doctor from "./models/Doctor.js";
import waitlistRoutes from "./routes/waitlist.js"; 
import nodemailer from "nodemailer";


dotenv.config();

const app = express();
 app.use(cors());
app.use(express.json());



// MongoDB connection

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,  // Increase timeout to 30s
  socketTimeoutMS: 45000,
  family: 4,  // Use IPv4 only (avoids IPv6 issues)
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));
//mongoose.connect(process.env.MONGO_URI)
  //  .then(() => console.log("MongoDB connected"))
    //.catch(err => console.error("MongoDB connection error:", err));


    // Email transporter for Zoho
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: false, // Use TLS
  auth: {
    user: process.env.ZOHO_EMAIL, // Add to .env
    pass: process.env.ZOHO_PASSWORD, // Add to .env
  },
});
  
   // Routes

    app.post("/api/patient-signup", async (req, res) => {
        try {
            const newPatient = new Patient(req.body);
            await newPatient.save();
            res.json({ success: true, message: "Patient registered successfully" });
            } catch (err) {
                res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/api/doctor-signup", async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body);
        await newDoctor.save();
        res.json({ success: true, message: "Doctor registered successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.use("/api", waitlistRoutes);  //  makes routes start with /api
app.get("/", (req, res) => res.send("Lihaxa Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 

*/
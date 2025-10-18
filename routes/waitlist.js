// backend/routes/waitlist.js
import express from "express";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import { sendCompanyAndUserEmails } from "../sendEmail.js";


//User submits patient form
//     ↓
//POST /patients
//     ↓
//Extract data from req.body
//     ↓
//Save new patient to MongoDB
//       ↓
//Try sending emails
//     ↓


const router = express.Router();

/**
 * PATIENT WAITLIST
 */
router.post("/patients", async (req, res) => {
  try {
    const { fullName, email, phone, ageBracket, healthcareProblem } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: "Full name and email are required." });
    }

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered on the waitlist."
      });
    }


    const newPatient = new Patient({ fullName, email, phone, ageBracket, healthcareProblem });
    await newPatient.save();

    const result = await sendCompanyAndUserEmails({
      formData: { fullName, email, phone, ageBracket, healthcareProblem },
      userEmail: email,
      userName: fullName,
      subjectPrefix: "[Waitlist] ",
    });

    if (!result.ok) {
      console.warn("⚠️ Email failed for patient:", result.error);
      return res.status(201).json({
        message: "Patient saved, but email failed.",
        emailError: result.error.toString(),
      });
    }

    res.status(201).json({
      success: true,
      message: "Patient saved and emails sent."
    });
  } catch (err) {
    console.error("❌ Error in /patients route:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


/**
 * DOCTOR WAITLIST
 */
router.post("/doctors", async (req, res) => {
  try {
    let { fullName, email, phone, university, specialization, yearsOfExperience: experience, isDoctor: licensed } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: "Full name and email are required." });
    }

    licensed = licensed === true || licensed === "true" ? true : false;


    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "This email has already joined the doctor waitlist."
      });
    }
    
    console.log("Doctor form data received:", req.body);


    const newDoctor = new Doctor({
      fullName,
      email,
      phone,
      university,
      specialization,
      yearsOfExperience: experience,
      isDoctor: licensed === true || licensed === "true",
    });
    await newDoctor.save();

    const result = await sendCompanyAndUserEmails({
      formData: { fullName, email, phone, university, specialization, yearsOfExperience: experience, isDoctor: licensed },
      userEmail: email,
      userName: fullName,
      subjectPrefix: "[Doctor Waitlist] ",
    });

    if (!result.ok) {
      console.warn("⚠️ Email failed for doctor:", result.error);
      return res.status(201).json({
        message: "Doctor saved, but email failed.",
        emailError: result.error.toString(),
      });
    }

    res.status(201).json({ success: true, message: "Doctor saved and emails sent." });
  } catch (err) {
    console.error("❌ Error in /doctors route:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;

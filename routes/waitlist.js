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

router.post("/patients", async (req, res) => {
  try {
    // sanitize/normalize values
    const { fullName, email, ageBracket, healthcareProblem } = req.body;

    const newPatient = new Patient({  fullName, email, ageBracket, healthcareProblem });
    await newPatient.save();

    // send emails: company + confirmation to user
    const result = await sendCompanyAndUserEmails({
      formData: {  fullName, email, ageBracket, healthcareProblem },
      userEmail: email,
      userName: fullName,
      subjectPrefix: "[Waitlist] "
    });

    if (!result.ok) {
      // saved to DB but email failed - still return success status but log error
      return res.status(201).json({ message: "Patient saved, email failed", emailError: result.error.toString() });
    }

    res.status(201).json({ message: "Patient saved and emails sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/doctors", async (req, res) => {
  try {
    let { fullName, email, phone, university, specialization, experience, licensed } = req.body;

    // ensure boolean
    licensed = licensed === true || licensed === "true";

    const newDoctor = new Doctor({ fullName, email, phone, university, specialization, experience, licensed });
    await newDoctor.save();

    const result = await sendCompanyAndUserEmails({
      formData: { fullName, email, phone, university, specialization, experience, licensed },
      userEmail: email,
      userName: fullName,
      subjectPrefix: "[Doctor Waitlist] "
    });

    if (!result.ok) {
      return res.status(201).json({ message: "Doctor saved, email failed", emailError: result.error.toString() });
    }

    res.status(201).json({ message: "Doctor saved and emails sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

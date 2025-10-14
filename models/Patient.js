import mongoose from "mongoose";


const patientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    ageBracket: { type: String, required: true },
    healthcareProblem: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Patient", patientSchema);
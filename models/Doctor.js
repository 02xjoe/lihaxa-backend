import mongoose from "mongoose";


const doctorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    university: { type: String, required: true },
    specialization: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    isDoctor: { type: Boolean, default: false }, //will be false unless they check the box
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Doctor", doctorSchema);
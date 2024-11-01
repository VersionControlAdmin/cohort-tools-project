const mongoose = require("mongoose");

const studentsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    description: "First name of the student.",
  },
  lastName: {
    type: String,
    required: true,
    description: "Last name of the student.",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    description: "Email address of the student.",
  },
  phone: {
    type: String,
    required: true,
    description: "Phone number of the student.",
  },
  linkedinUrl: {
    type: String,
    default: "",
    description: "URL to the student's LinkedIn profile.",
  },
  languages: {
    type: [String],
    enum: [
      "English",
      "Spanish",
      "French",
      "German",
      "Portuguese",
      "Dutch",
      "Other",
    ],
    description: "Spoken languages of the student.",
  },
  program: {
    type: String,
    enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"],
    description: "Type of program the student is enrolled in.",
  },
  background: {
    type: String,
    default: "",
    description: "Background information about the student.",
  },
  image: {
    type: String,
    default: "https://i.imgur.com/r8bo8u7.png",
    description: "URL to the student's profile image.",
  },
  cohort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cohort",
    description: "Reference _id of the cohort the student belongs to.",
  },
  projects: {
    type: [String],
    description: "Array of the student's projects.",
  },
});

module.exports = mongoose.model("Student", studentsSchema);

const mongoose = require("mongoose");

const cohortSchema = new mongoose.Schema({
    cohortSlug: {
      type: String,
      required: true,
      unique: true,
      description: "Unique identifier for the cohort."
    },
    cohortName: {
      type: String,
      required: true,
      description: "Name of the cohort."
    },
    program: {
      type: String,
      enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"],
      required: true,
      description: "Program or course name."
    },
    format: {
      type: String,
      enum: ["Full Time", "Part Time"],
      required: true,
      description: "Format of the cohort."
    },
    campus: {
      type: String,
      enum: ["Madrid", "Barcelona", "Miami", "Paris", "Berlin", "Amsterdam", "Lisbon", "Remote"],
      required: true,
      description: "Campus location."
    },
    startDate: {
      type: Date,
      default: Date.now,
      description: "Start date of the cohort."
    },
    endDate: {
      type: Date,
      description: "End date of the cohort."
    },
    inProgress: {
      type: Boolean,
      default: false,
      description: "Indicates if the cohort is currently in progress."
    },
    programManager: {
      type: String,
      required: true,
      description: "Name of the program manager."
    },
    leadTeacher: {
      type: String,
      required: true,
      description: "Name of the lead teacher."
    },
    totalHours: {
      type: Number,
      default: 360,
      description: "Total hours of the cohort program."
    }
  });
  
  module.exports = mongoose.model("Cohort", cohortSchema);
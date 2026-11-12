const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "My Resume",
      trim: true,
    },

    personalInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    education: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    experience: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    skills: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    projects: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    certifications: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    languages: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    selectedTemplate: {
      type: String,
      default: "modern",
    },

    themeColor: {
      type: String,
      default: "#2563eb",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Resume", resumeSchema);

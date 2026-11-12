const mongoose = require("mongoose");
const Resume = require("../models/Resume");

const allowedFields = [
  "title",
  "personalInfo",
  "education",
  "experience",
  "skills",
  "projects",
  "certifications",
  "languages",
  "selectedTemplate",
  "themeColor",
];

function pickResumeFields(body = {}) {
  const data = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = body[field];
    }
  }

  return data;
}

function validId(id) {
  return mongoose.isValidObjectId(id);
}

exports.createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      ...pickResumeFields(req.body),
      owner: req.user.id,
    });

    return res.status(201).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Create resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create resume.",
    });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      owner: req.user.id,
    }).sort({ updatedAt: -1 });

    return res.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resumes.",
    });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume ID.",
      });
    }

    const resume = await Resume.findOne({
      _id: id,
      owner: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.json({ success: true, resume });
  } catch (error) {
    console.error("Get resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume.",
    });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume ID.",
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: id,
        owner: req.user.id,
      },
      {
        $set: pickResumeFields(req.body),
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.json({ success: true, resume });
  } catch (error) {
    console.error("Update resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update resume.",
    });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume ID.",
      });
    }

    const resume = await Resume.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.json({
      success: true,
      message: "Resume deleted successfully.",
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume.",
    });
  }
};

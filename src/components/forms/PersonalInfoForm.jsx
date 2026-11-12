import {
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Upload,
  X,
} from "lucide-react";

import { useResume } from "../../context/ResumeContext";
import GithubMark from "../icons/GithubMark";
import LinkedinMark from "../icons/LinkedinMark";

function PersonalInfoForm() {
  const { resume, updatePersonalInfo } = useResume();

  const personalInfo = resume?.personalInfo || {};

  const handleChange = (event) => {
    const { name, value } = event.target;
    updatePersonalInfo(name, value);
  };

  const handleProfileImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updatePersonalInfo("profileImage", reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    updatePersonalInfo("profileImage", "");
  };

  return (
    <section className="space-y-6">
      {/* SECTION HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <User size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add your basic details so employers can contact you.
            </p>
          </div>
        </div>
      </div>

      {/* PROFILE PHOTO */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {personalInfo.profileImage ? (
              <img
                src={personalInfo.profileImage}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={30} className="text-slate-300" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-800">Profile Photo</h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Upload a professional photo. JPG or PNG, maximum 2MB.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label
                htmlFor="profileImage"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                <Upload size={15} />
                {personalInfo.profileImage ? "Change Photo" : "Upload Photo"}
              </label>

              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleProfileImage}
                className="hidden"
              />

              {personalInfo.profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <X size={14} />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FORM FIELDS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field
          label="Full Name"
          name="fullName"
          value={personalInfo.fullName}
          onChange={handleChange}
          placeholder="Alex Morgan"
          icon={User}
          required
        />

        <Field
          label="Job Title"
          name="jobTitle"
          value={personalInfo.jobTitle}
          onChange={handleChange}
          placeholder="e.g. MERN Stack Developer"
          icon={Briefcase}
        />

        <Field
          label="Email Address"
          name="email"
          type="email"
          value={personalInfo.email}
          onChange={handleChange}
          placeholder="alex.morgan@example.com"
          icon={Mail}
        />

        <Field
          label="Phone Number"
          name="phone"
          type="tel"
          value={personalInfo.phone}
          onChange={handleChange}
          placeholder="+91 90000 51000"
          icon={Phone}
        />

        <Field
          label="Location"
          name="location"
          value={personalInfo.location}
          onChange={handleChange}
          placeholder="Ahmedabad, Gujarat, India"
          icon={MapPin}
        />

        <Field
          label="Website"
          name="website"
          type="url"
          value={personalInfo.website}
          onChange={handleChange}
          placeholder="https://alexmorgan.dev"
          icon={Globe}
        />

        <Field
          label="LinkedIn Profile"
          name="linkedin"
          type="url"
          value={personalInfo.linkedin}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/alex-morgan-dev"
          icon={LinkedinMark}
        />

        <Field
          label="GitHub Profile"
          name="github"
          type="url"
          value={personalInfo.github}
          onChange={handleChange}
          placeholder="https://github.com/alexmorgan-dev"
          icon={GithubMark}
        />
      </div>

      {/* PROFESSIONAL SUMMARY */}
      <div>
        <label
          htmlFor="summary"
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
        >
          <FileText size={16} className="text-slate-400" />
          Professional Summary
        </label>

        <div className="relative">
          <FileText
            size={17}
            className="pointer-events-none absolute left-4 top-4 text-slate-400"
          />

          <textarea
            id="summary"
            name="summary"
            value={personalInfo.summary || ""}
            onChange={handleChange}
            placeholder="Write a concise professional summary highlighting your technical expertise, relevant experience, key achievements, and career objectives."
            rows={6}
            className="min-h-36 w-full resize-y rounded-xl border bg-white px-4 py-3 pl-11 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Keep your summary clear, professional, and focused on your strengths.
        </p>
      </div>
    </section>
  );
}

/* REUSABLE INPUT FIELD */
function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          id={name}
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>
    </div>
  );
}

export default PersonalInfoForm;

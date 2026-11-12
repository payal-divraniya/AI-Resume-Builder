import { useCallback, useState } from "react";
import { Save, LoaderCircle } from "lucide-react";

import { useResume } from "../../context/ResumeContext";
import Toast from "../Toast";

import PersonalInfoForm from "../forms/PersonalInfoForm";
import EducationForm from "../forms/EducationForm";
import ExperienceForm from "../forms/ExperienceForm";
import SkillsForm from "../forms/SkillsForm";
import ProjectsForm from "../forms/ProjectsForm";
import CertificationsForm from "../forms/CertificationsForm";
import LanguagesForm from "../forms/LanguagesForm";

function ResumeForm() {
  const { saveResume, isMongoLoaded } = useResume();

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setToast(null);

    try {
      await saveResume();

      setToast({
        message: "Resume saved successfully!",
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          error.message || "Unable to save your resume. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      <PersonalInfoForm />
      <EducationForm />
      <ExperienceForm />
      <SkillsForm />
      <ProjectsForm />
      <CertificationsForm />
      <LanguagesForm />

      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Ready to continue?
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
              Your changes are automatically stored locally and synchronized
              with the database. Save to confirm the latest changes.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isMongoLoaded}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                {!isMongoLoaded ? "Loading..." : "Save & Continue"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResumeForm;

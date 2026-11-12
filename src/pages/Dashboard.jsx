import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  Sparkles,
  X,
  AlertTriangle,
} from "lucide-react";

import { useResume } from "../context/ResumeContext";
import Toast from "../components/Toast";

function Dashboard() {
  const {
    resumes,
    activeResumeId,
    isMongoLoaded,
    createResume,
    selectResume,
    deleteResume,
    duplicateResume,
  } = useResume();

  const navigate = useNavigate();

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [deletingId, setDeletingId] = useState(null);
  const [duplicatingId, setDuplicatingId] = useState(null);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Listen for errors from automatic database synchronization.
  useEffect(() => {
    const handleResumeError = (event) => {
      setToast({
        message:
          event.detail?.message ||
          "Something went wrong while saving your resume.",
        type: "error",
      });
    };

    window.addEventListener("resume-toast", handleResumeError);

    return () => {
      window.removeEventListener("resume-toast", handleResumeError);
    };
  }, []);

  // Close the modal with the Escape key.
  useEffect(() => {
    if (!resumeToDelete) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && deletingId === null) {
        setResumeToDelete(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [resumeToDelete, deletingId]);

  const handleCreate = () => {
    createResume();
    navigate("/create-resume");
  };

  const handleEdit = (id) => {
    try {
      selectResume(id);
      navigate("/create-resume");
    } catch (error) {
      showToast(error.message || "Unable to open resume.", "error");
    }
  };

  // Open the in-app confirmation modal.
  const openDeleteModal = (id) => {
    setResumeToDelete(id);
  };

  // Delete only after the user confirms in the modal.
  const handleDelete = async () => {
    if (!resumeToDelete || deletingId !== null) return;

    const id = resumeToDelete;
    setDeletingId(id);

    try {
      await deleteResume(id);

      setResumeToDelete(null);
      showToast("Resume deleted successfully!", "success");
    } catch (error) {
      showToast(error.message || "Failed to delete resume.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (id) => {
    setDuplicatingId(id);

    try {
      await duplicateResume(id);
      showToast("Resume duplicated and saved successfully!");
    } catch (error) {
      showToast(error.message || "Failed to duplicate resume.", "error");
    } finally {
      setDuplicatingId(null);
    }
  };

  const getResumeStatus = (resume) => {
    const hasData =
      resume?.personalInfo?.fullName ||
      resume?.personalInfo?.jobTitle ||
      (resume?.education?.length ?? 0) > 0 ||
      (resume?.experience?.length ?? 0) > 0 ||
      (resume?.skills?.length ?? 0) > 0 ||
      (resume?.projects?.length ?? 0) > 0;

    return hasData ? "Ready" : "Empty";
  };

  const selectedResume = resumes.find((item) => item.id === resumeToDelete);

  return (
    <main className="min-h-screen bg-slate-50">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      {/* DASHBOARD HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold tracking-wide text-blue-600 sm:text-xs">
                RESUME DASHBOARD
              </span>

              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                My Resumes
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Create, edit and manage your resumes in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md sm:w-auto"
            >
              <Plus size={18} />
              Create Resume
            </button>
          </div>
        </div>
      </section>

      {/* DASHBOARD CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
                <FileText size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  Total Resumes
                </p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                  {resumes.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 sm:h-12 sm:w-12">
                <CheckCircle size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">Completed</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                  {
                    resumes.filter((item) => getResumeStatus(item) === "Ready")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:col-span-2 sm:p-6 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 sm:h-12 sm:w-12">
                <FileText size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">Empty</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                  {
                    resumes.filter((item) => getResumeStatus(item) === "Empty")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RESUME SECTION */}
        <div className="mt-10 sm:mt-12">
          <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Your Resumes
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a resume to continue editing.
              </p>
            </div>

            <span className="text-sm font-medium text-slate-500">
              {resumes.length} {resumes.length === 1 ? "resume" : "resumes"}
            </span>
          </div>

          {/* RESUME LIST */}
          <div className="grid gap-5">
            {resumes.map((item) => {
              const isActive = item.id === activeResumeId;
              const status = getResumeStatus(item);

              return (
                <div
                  key={item.id}
                  className={`group rounded-2xl border bg-white p-4 shadow-sm transition duration-300 hover:shadow-lg sm:p-6 ${
                    isActive
                      ? "border-blue-400 ring-2 ring-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    {/* RESUME ICON */}
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:h-16 sm:w-16"
                      style={{
                        color: item.themeColor,
                        backgroundColor: `${item.themeColor}15`,
                      }}
                    >
                      <FileText size={28} />
                    </div>

                    {/* RESUME INFORMATION */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start gap-2">
                        <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                          {item.personalInfo?.fullName
                            ? `${item.personalInfo.fullName}'s Resume`
                            : "Untitled Resume"}
                        </h3>

                        {isActive && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 sm:text-xs">
                            <CheckCircle size={12} />
                            Active
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {item.personalInfo.jobTitle || "Frontend Developer"}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:gap-3">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1">
                          Template:{" "}
                          <span className="font-semibold capitalize text-slate-700">
                            {item.selectedTemplate}
                          </span>
                        </span>

                        <span
                          className={`rounded-md px-2.5 py-1 font-semibold ${
                            status === "Ready"
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(item.id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 lg:w-auto"
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicate(item.id)}
                        disabled={!isMongoLoaded || duplicatingId === item.id}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                      >
                        <Copy size={16} />
                        {duplicatingId === item.id
                          ? "Duplicating..."
                          : "Duplicate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => openDeleteModal(item.id)}
                        disabled={deletingId !== null}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EMPTY STATE */}
        {!isMongoLoaded && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
            Loading your resumes...
          </div>
        )}

        {isMongoLoaded && resumes.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center sm:px-6 sm:py-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FileText size={27} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No resumes yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first professional resume and start building your
              career profile.
            </p>

            <button
              type="button"
              onClick={handleCreate}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              <Plus size={17} />
              Create Your First Resume
            </button>
          </div>
        )}

        {/* AI CTA */}
        <div className="mt-10 overflow-hidden rounded-2xl bg-slate-950 sm:mt-12">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white sm:h-11 sm:w-11">
                <Sparkles size={19} />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold leading-6 text-white sm:text-lg">
                  Make Your Resume Stronger With AI
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                  Analyze your resume, get personalized suggestions and improve
                  your content with AI-powered rewriting.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (activeResumeId) {
                  navigate("/create-resume");
                } else {
                  handleCreate();
                }
              }}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-blue-50 sm:w-auto"
            >
              <Sparkles size={17} />
              Improve Resume
            </button>
          </div>
        </div>
      </section>

      {/* IN-APP DELETE CONFIRMATION MODAL */}
      {resumeToDelete && (
        <div
          className="fixed inset-0 z-10000 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && deletingId === null) {
              setResumeToDelete(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-md animate-in zoom-in-95 rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl duration-200 sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle size={25} />
              </div>

              <button
                type="button"
                onClick={() => setResumeToDelete(null)}
                disabled={deletingId !== null}
                aria-label="Close confirmation"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <h2
              id="delete-modal-title"
              className="text-xl font-extrabold text-slate-900 sm:text-2xl"
            >
              Delete this resume?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {selectedResume?.personalInfo?.fullName
                  ? `${selectedResume.personalInfo.fullName}'s Resume`
                  : "this resume"}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setResumeToDelete(null)}
                disabled={deletingId !== null}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={16} />
                {deletingId !== null ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;

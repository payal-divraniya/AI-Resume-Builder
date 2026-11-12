import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

import { useResume } from "../../context/ResumeContext";

import ModernTemplate from "../templates/ModernTemplate";
import ProfessionalTemplate from "../templates/ProfessionalTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import CreativeTemplate from "../templates/CreativeTemplate";

import Toast from "../Toast";

function ResumePreview() {
  const { resume } = useResume();
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState(null);

  if (!resume) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
        Loading your resume preview...
      </div>
    );
  }

  const renderTemplate = () => {
    switch (resume.selectedTemplate) {
      case "professional":
        return <ProfessionalTemplate resume={resume} />;

      case "minimal":
        return <MinimalTemplate resume={resume} />;

      case "creative":
        return <CreativeTemplate resume={resume} />;

      case "modern":
      default:
        return <ModernTemplate resume={resume} />;
    }
  };

  const downloadPDF = async () => {
    if (downloading) return;

    let downloadUrl;

    try {
      setDownloading(true);

      const fullName = resume.personalInfo?.fullName?.trim();

      const fileName = (fullName ? `${fullName} Resume` : "My Resume")
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .trim();

      // Load PDF libraries only when the user requests a download.
      const [{ pdf }, { default: ResumePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./ResumePDF"),
      ]);

      const blob = await pdf(
        <ResumePDF
          resume={resume}
          template={resume.selectedTemplate || "modern"}
        />,
      ).toBlob();

      downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${fileName || "My Resume"}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setToast({
        message: "Your resume PDF has been downloaded successfully.",
        type: "success",
      });

      const urlToRevoke = downloadUrl;

      window.setTimeout(() => {
        URL.revokeObjectURL(urlToRevoke);
      }, 2000);

      downloadUrl = null;
    } catch (error) {
      console.error("PDF download error:", error);

      setToast({
        message: "Unable to generate the PDF. Please try again.",
        type: "error",
      });
    } finally {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }

      setDownloading(false);
    }
  };

  return (
    <div className="w-full">
      <Toast
        message={toast?.message || ""}
        type={toast?.type || "success"}
        onClose={() => setToast(null)}
      />

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={downloadPDF}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {downloading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download size={17} />
              Download PDF
            </>
          )}
        </button>
      </div>

      <div
        className="mx-auto min-h-1050px w-full max-w-800px rounded bg-white p-6 shadow-lg sm:p-10"
        style={{
          "--theme-color": resume.themeColor || "#2563eb",
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
}

export default ResumePreview;

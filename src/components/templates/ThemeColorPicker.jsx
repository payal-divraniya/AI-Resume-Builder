import { useResume } from "../../context/ResumeContext";

function ThemeColorPicker() {
  const { resume, updateResume } = useResume();

  const colors = [
    "#2563eb",
    "#7c3aed",
    "#059669",
    "#dc2626",
    "#ea580c",
    "#0891b2",
    "#db2777",
    "#111827",
  ];

  const currentColor = resume?.themeColor || "#2563eb";

  const handleColorChange = (color) => {
    if (!resume) return;

    updateResume({
      ...resume,
      themeColor: color,
    });
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Choose Theme Color</h2>

        <p className="mt-1 text-sm text-slate-500">
          Personalize your resume with your favorite color.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            disabled={!resume}
            onClick={() => handleColorChange(color)}
            aria-label={`Select ${color}`}
            aria-pressed={currentColor === color}
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 ${
              currentColor === color
                ? "scale-110 border-slate-900 shadow-md"
                : "border-transparent hover:border-slate-300"
            }`}
            style={{ backgroundColor: color }}
          >
            {currentColor === color && (
              <span className="text-lg font-bold text-white">✓</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <label
          htmlFor="resume-custom-color"
          className="mb-3 block text-sm font-semibold text-slate-700"
        >
          Custom Color
        </label>

        <div className="flex items-center gap-3">
          <input
            id="resume-custom-color"
            type="color"
            value={currentColor}
            disabled={!resume}
            onChange={(event) => handleColorChange(event.target.value)}
            className="h-11 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 disabled:cursor-not-allowed"
          />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {currentColor.toUpperCase()}
            </p>

            <p className="text-xs text-slate-500">
              Your selected resume accent color
            </p>
          </div>
        </div>
      </div>

      {!resume && (
        <p className="mt-4 text-xs text-amber-600">
          Your resume is loading. Color options will be available shortly.
        </p>
      )}
    </section>
  );
}

export default ThemeColorPicker;

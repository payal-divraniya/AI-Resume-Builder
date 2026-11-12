import GithubMark from "../icons/GithubMark";
import LinkedinMark from "../icons/LinkedinMark";

function cleanValue(value) {
  if (typeof value !== "string") return "";

  let raw = value.trim();
  if (!raw) return "";

  const markdown = raw.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/i);

  if (markdown) {
    raw = markdown[1].trim();
  }

  try {
    raw = decodeURIComponent(raw);
  } catch {
    // Keep original value if decoding fails.
  }

  return raw;
}

function profileLabel(value, type) {
  const raw = cleanValue(value);

  if (!raw) return "";

  const isUrl =
    /^(https?:\/\/|www\.)/i.test(raw) ||
    /^(linkedin\.com|github\.com)\//i.test(raw);

  if (!isUrl) {
    return raw.replace(/^@/, "");
  }

  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);

    const parts = url.pathname
      .split("/")
      .filter(Boolean)
      .map((part) => {
        try {
          return decodeURIComponent(part);
        } catch {
          return part;
        }
      });

    if (type === "linkedin") {
      const index = parts.findIndex((part) =>
        ["in", "pub", "company", "school"].includes(part.toLowerCase()),
      );

      return (index >= 0 ? parts[index + 1] : parts[0]) || "";
    }

    if (type === "github") {
      return parts[0] || "";
    }

    return url.hostname.replace(/^www\./i, "");
  } catch {
    return raw.replace(/^@/, "");
  }
}

function GlobeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

export default function SocialLinks({
  personalInfo = {},
  variant = "default",
  className = "",
}) {
  const portfolio = profileLabel(
    personalInfo.website || personalInfo.portfolio,
    "portfolio",
  );

  const linkedin = profileLabel(
    personalInfo.linkedin || personalInfo.linkedIn,
    "linkedin",
  );

  const github = profileLabel(
    personalInfo.github || personalInfo.gitHub,
    "github",
  );

  if (!portfolio && !linkedin && !github) return null;

  const light = variant === "light";
  const textClass = light ? "text-white/90" : "text-slate-700";

  return (
    <div
      className={`flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-xs ${textClass} ${className}`}
    >
      {portfolio && (
        <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
          <span className="shrink-0">
            <GlobeIcon />
          </span>
          <span className="wrap-break-words">{portfolio}</span>
        </span>
      )}

      {linkedin && (
        <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
          <LinkedinMark
            size={13}
            className={light ? "text-white/90" : "text-[#0A66C2]"}
          />
          <span className="wrap-break-words">{linkedin}</span>
        </span>
      )}

      {github && (
        <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
          <GithubMark size={13} />
          <span className="wrap-break-words">{github}</span>
        </span>
      )}
    </div>
  );
}

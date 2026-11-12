import SocialLinks from "./SocialLinks";

function ContactIcon({ type }) {
  const common = {
    width: 13,
    height: 13,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: false,
  };

  if (type === "email") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg {...common}>
        <path d="M7 3h3l1.5 4-2 1.5a15 15 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 5 5.2 2 2 0 0 1 7 3Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function ContactDetails({
  personalInfo = {},
  variant = "default",
  className = "",
  includeSocial = true,
}) {
  const light = variant === "light";
  const textClass = light ? "text-white/90" : "text-slate-600";

  const items = [
    personalInfo.email ? { type: "email", value: personalInfo.email } : null,
    personalInfo.phone ? { type: "phone", value: personalInfo.phone } : null,
    personalInfo.location
      ? { type: "location", value: personalInfo.location }
      : null,
  ].filter(Boolean);

  const hasSocial =
    includeSocial &&
    (personalInfo.linkedin ||
      personalInfo.linkedIn ||
      personalInfo.github ||
      personalInfo.gitHub ||
      personalInfo.website ||
      personalInfo.portfolio);

  if (!items.length && !hasSocial) return null;

  return (
    <div className={`flex min-w-0 flex-col gap-y-2 ${textClass} ${className}`}>
      {items.length > 0 && (
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
          {items.map((item) => (
            <span
              key={item.type}
              className="inline-flex min-w-0 max-w-full items-center gap-1.5 text-xs leading-5"
            >
              <span className="shrink-0 opacity-80">
                <ContactIcon type={item.type} />
              </span>

              <span className="min-w-0 break-words">{item.value}</span>
            </span>
          ))}
        </div>
      )}

      {hasSocial && (
        <SocialLinks
          personalInfo={personalInfo}
          variant={variant}
          className="gap-x-5 gap-y-2"
        />
      )}
    </div>
  );
}

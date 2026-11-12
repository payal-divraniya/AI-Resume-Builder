import { useResume } from "../../context/ResumeContext";
import TemplateCard from "./TemplateCard";

function TemplateGrid() {
  const { resume, updateResume } = useResume();

  const templates = [
    {
      name: "Modern",
      value: "modern",
    },
    {
      name: "Professional",
      value: "professional",
    },
    {
      name: "Minimal",
      value: "minimal",
    },
    {
      name: "Creative",
      value: "creative",
    },
  ];

  const handleTemplateChange = (template) => {
    if (!resume) return;
    updateResume({
      ...resume,
      selectedTemplate: template,
    });
  };

  return (
    <div className="template-grid">
      {templates.map((template) => (
        <TemplateCard
          key={template.value}
          name={template.name}
          value={template.value}
          selected={
            resume?.selectedTemplate === template.value
          }
          onSelect={handleTemplateChange}
        />
      ))}
    </div>
  );
}

export default TemplateGrid;
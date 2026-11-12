function TemplateCard({
  name,
  value,
  selected,
  onSelect,
}) {
  return (
    <button
      type="button"
      className={`template-card ${
        selected ? "selected" : ""
      }`}
      onClick={() => onSelect(value)}
    >
      <div className={`template-thumbnail ${value}`}>
        <div className="thumbnail-title">
          {name}
        </div>

        <div className="thumbnail-line"></div>
        <div className="thumbnail-line short"></div>
        <div className="thumbnail-content"></div>
        <div className="thumbnail-content"></div>
        <div className="thumbnail-content short"></div>
      </div>

      <span>{name}</span>

      {selected && (
        <small>✓ Selected</small>
      )}
    </button>
  );
}

export default TemplateCard;
export function SelectedTags({
  tags,
  onToggle,
}: {
  tags: string[];
  onToggle: (tag: string) => void;
}) {
  if (tags.length === 0) return null;

  return (
    <div id="topTags" className="topChips" aria-label="選択中のタグ">
      {tags.map((t) => (
        <button key={t} className="chip" type="button" data-on="true" onClick={() => onToggle(t)}>
          {t} ×
        </button>
      ))}
    </div>
  );
}

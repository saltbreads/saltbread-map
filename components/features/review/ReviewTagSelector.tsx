"use client";

type Props = {
  tags: string[];
  selectedTags: string[];
  emojiMap: Record<string, string>;
  maxSelect?: number;
  disabled?: boolean;
  onChangeAction: (next: string[]) => void;
};

export function ReviewTagSelector({
  tags,
  selectedTags,
  emojiMap,
  maxSelect = 5,
  disabled = false,
  onChangeAction,
}: Props) {
  const handleToggle = (tag: string) => {
    const isSelected = selectedTags.includes(tag);

    if (isSelected) {
      onChangeAction(selectedTags.filter((item) => item !== tag));
      return;
    }

    if (selectedTags.length >= maxSelect) return;

    onChangeAction([...selectedTags, tag]);
  };

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-800">
          태그 선택
        </label>
        <span className="text-xs text-gray-500">최대 {maxSelect}개</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);

          return (
            <button
              key={tag}
              type="button"
              onClick={() => handleToggle(tag)}
              disabled={disabled}
              className={[
                "rounded-full border px-3 py-2 text-sm transition",
                isSelected
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-500",
                disabled ? "cursor-not-allowed opacity-50" : "",
              ].join(" ")}
            >
              <span className="mr-1">{emojiMap[tag]}</span>
              <span>{tag}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

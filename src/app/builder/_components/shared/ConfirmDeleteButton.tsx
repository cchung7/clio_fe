import { Trash2 } from "lucide-react";

type ConfirmDeleteButtonProps = {
  message: string;
  ariaLabel: string;
  title?: string;
  iconSize?: number;
  className?: string;
  onConfirm: () => void;
};

export function ConfirmDeleteButton({
  message,
  ariaLabel,
  title,
  iconSize = 15,
  className = "rounded-lg p-2 text-red-700 transition hover:bg-red-50",
  onConfirm,
}: ConfirmDeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        const confirmed = window.confirm(message);

        if (!confirmed) return;

        onConfirm();
      }}
      className={className}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
    >
      <Trash2 size={iconSize} />
    </button>
  );
}
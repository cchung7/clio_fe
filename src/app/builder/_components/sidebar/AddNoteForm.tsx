import { StickyNote } from "lucide-react";

type AddNoteFormProps = {
  newNoteTitle: string;
  newNoteBody: string;
  setNewNoteTitle: (value: string) => void;
  setNewNoteBody: (value: string) => void;
  onAddNote: () => void;
};

export function AddNoteForm({
  newNoteTitle,
  newNoteBody,
  setNewNoteTitle,
  setNewNoteBody,
  onAddNote,
}: AddNoteFormProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[var(--clio-border)] bg-[rgba(255,253,248,0.72)] px-3 py-2 text-xs leading-5 text-[var(--clio-muted)]">
        Use notes for visual reminders, questions, or design observations
        directly on the canvas.
      </div>

      <label className="block">
        <span className="clio-label mb-1 block">Note Title</span>
        <input
          value={newNoteTitle}
          onChange={(event) => setNewNoteTitle(event.target.value)}
          placeholder="Canvas note"
          className="clio-input w-full rounded-lg px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="clio-label mb-1 block">Note Body</span>
        <textarea
          value={newNoteBody}
          onChange={(event) => setNewNoteBody(event.target.value)}
          placeholder="Add a note, reminder, or design comment for this view."
          rows={4}
          className="clio-input w-full rounded-lg px-3 py-2 text-sm"
        />
      </label>

      <button
        type="button"
        onClick={onAddNote}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--clio-gold-300)] bg-[var(--clio-gold-100)] px-4 py-2 text-sm font-semibold text-[var(--clio-ink)] transition hover:bg-[var(--clio-gold-300)]"
      >
        <StickyNote size={16} />
        Add Note
      </button>
    </div>
  );
}
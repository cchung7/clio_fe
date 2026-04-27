import * as React from "react";
import { Trash2 } from "lucide-react";

import type { DocumentationProject, Note } from "../../_lib/builderTypes";
import {
  deleteCanvasNoteFromProject,
  updateCanvasNoteInProject,
} from "../../_lib/canvasProjectActions";
import { NOTE_HEIGHT, NOTE_WIDTH } from "../../_lib/canvasGeometry";

type CanvasNoteCardProps = {
  note: Note;
  dragging: boolean;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
};

type EditableNoteField = "title" | "content" | null;

export function CanvasNoteCard({
  note,
  dragging,
  onPointerDown,
  updateProject,
}: CanvasNoteCardProps) {
  const [editingField, setEditingField] =
    React.useState<EditableNoteField>(null);

  const titleRef = React.useRef<HTMLInputElement | null>(null);
  const contentRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (editingField === "title") {
      titleRef.current?.focus();
      titleRef.current?.select();
    }

    if (editingField === "content") {
      contentRef.current?.focus();
    }
  }, [editingField]);

  function updateCanvasNote(patch: Partial<Note>) {
    updateProject((current) =>
      updateCanvasNoteInProject({
        project: current,
        noteId: note.id,
        patch,
      })
    );
  }

  function deleteCanvasNote() {
    const confirmed = window.confirm("Delete this canvas note?");

    if (!confirmed) return;

    updateProject((current) =>
      deleteCanvasNoteFromProject({
        project: current,
        noteId: note.id,
      })
    );
  }

  return (
    <div
      role="note"
      className="clio-note-card rounded-xl px-4 py-3 text-left"
      style={{
        width: NOTE_WIDTH,
        minHeight: NOTE_HEIGHT,
      }}
    >
      <div
        onPointerDown={onPointerDown}
        className={`mb-2 flex cursor-grab items-center justify-between gap-2 select-none ${
          dragging ? "cursor-grabbing" : ""
        }`}
        style={{
          touchAction: "none",
        }}
      >
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--clio-gold-800)]">
          Note
        </div>

        <button
          type="button"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            deleteCanvasNote();
          }}
          className="relative z-20 rounded-lg p-1.5 text-red-700 transition hover:bg-red-50"
          aria-label={`Delete ${note.title || "canvas note"}`}
          title={`Delete ${note.title || "canvas note"}`}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {editingField === "title" ? (
        <input
          ref={titleRef}
          value={note.title || ""}
          placeholder="Note title"
          onPointerDown={(event) => event.stopPropagation()}
          onChange={(event) => updateCanvasNote({ title: event.target.value })}
          onBlur={() => setEditingField(null)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === "Escape") {
              setEditingField(null);
            }
          }}
          className="clio-input w-full rounded-lg px-2 py-1 text-sm font-semibold"
        />
      ) : (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setEditingField("title");
          }}
          className="block w-full rounded-lg px-2 py-1 text-left text-sm font-bold text-[var(--clio-ink)] transition hover:bg-[rgba(255,255,255,0.55)]"
          title="Click to edit note title"
        >
          {note.title || "Canvas note"}
        </button>
      )}

      {editingField === "content" ? (
        <textarea
          ref={contentRef}
          value={note.content}
          placeholder="Note body"
          onPointerDown={(event) => event.stopPropagation()}
          onChange={(event) => updateCanvasNote({ content: event.target.value })}
          onBlur={() => setEditingField(null)}
          rows={4}
          className="clio-input mt-2 w-full rounded-lg px-2 py-1 text-xs leading-5"
        />
      ) : (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setEditingField("content");
          }}
          className="mt-2 block min-h-[4.25rem] w-full rounded-lg px-2 py-1 text-left text-xs leading-5 text-[var(--clio-muted)] transition hover:bg-[rgba(255,255,255,0.55)]"
          title="Click to edit note body"
        >
          {note.content || "No note body yet."}
        </button>
      )}
    </div>
  );
}
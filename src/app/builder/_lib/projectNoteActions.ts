import type {
  DocumentationProject,
  Note,
} from "./builderTypes";
import { createId } from "./idUtils";

export function createNoteForNode(
  project: DocumentationProject,
  nodeId: string
): DocumentationProject {
  const id = createId("note");

  return {
    ...project,
    notes: [
      ...project.notes,
      {
        id,
        title: "New Note",
        content: "Write a note about this element.",
        type: "note",
        targetNodeId: nodeId,
        includeInExport: true,
      },
    ],
  };
}

export function updateNoteInProject({
  project,
  noteId,
  patch,
}: {
  project: DocumentationProject;
  noteId: string;
  patch: Partial<Note>;
}): DocumentationProject {
  return {
    ...project,
    notes: project.notes.map((note) =>
      note.id === noteId ? { ...note, ...patch } : note
    ),
  };
}

export function deleteNoteFromProject({
  project,
  noteId,
}: {
  project: DocumentationProject;
  noteId: string;
}): DocumentationProject {
  return {
    ...project,
    notes: project.notes.filter((note) => note.id !== noteId),
    edges: project.edges.filter(
      (edge) => edge.source !== noteId && edge.target !== noteId
    ),
  };
}
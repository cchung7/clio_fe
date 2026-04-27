import type {
  ConnectorArrowMode,
  ConnectorLineStyle,
  DocumentationProject,
  Note,
} from "./builderTypes";
import { createId } from "./builderUtils";

export function createCanvasNoteForProject({
  project,
  focusedNodeId,
  title,
  content,
  offsetIndex,
}: {
  project: DocumentationProject;
  focusedNodeId: string;
  title?: string;
  content?: string;
  offsetIndex: number;
}): DocumentationProject {
  const offset = offsetIndex * 28;

  return {
    ...project,
    notes: [
      ...project.notes,
      {
        id: createId("canvas-note"),
        title: title?.trim() || "Canvas note",
        type: "note",
        content:
          content?.trim() ||
          "Add a note, reminder, or design comment for this view.",
        targetNodeId: focusedNodeId,
        includeInExport: true,
        showOnCanvas: true,
        canvasPosition: {
          x: 140 + offset,
          y: 480 + offset,
        },
      },
    ],
  };
}

export function updateCanvasNoteInProject({
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

export function deleteCanvasNoteFromProject({
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

export function addConnectorToProject({
  project,
  source,
  target,
  label,
  lineStyle,
  arrowMode,
}: {
  project: DocumentationProject;
  source: string;
  target: string;
  label?: string;
  lineStyle: ConnectorLineStyle;
  arrowMode: ConnectorArrowMode;
}): DocumentationProject {
  return {
    ...project,
    edges: [
      ...project.edges,
      {
        id: createId("edge"),
        source,
        target,
        label: label?.trim() || undefined,
        relationshipType: "uses",
        lineStyle,
        arrowMode,
      },
    ],
  };
}

export function updateConnectorInProject({
  project,
  edgeId,
  patch,
}: {
  project: DocumentationProject;
  edgeId: string;
  patch: {
    source?: string;
    target?: string;
    label?: string | undefined;
    lineStyle?: ConnectorLineStyle;
    arrowMode?: ConnectorArrowMode;
  };
}): DocumentationProject {
  return {
    ...project,
    edges: project.edges.map((edge) =>
      edge.id === edgeId ? { ...edge, ...patch } : edge
    ),
  };
}

export function deleteConnectorFromProject({
  project,
  edgeId,
}: {
  project: DocumentationProject;
  edgeId: string;
}): DocumentationProject {
  return {
    ...project,
    edges: project.edges.filter((edge) => edge.id !== edgeId),
  };
}
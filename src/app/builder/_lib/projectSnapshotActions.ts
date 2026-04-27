import type {
  DocumentationProject,
  ProjectSnapshotState,
} from "./builderTypes";
import { createId } from "./idUtils";

export function createProjectSnapshotState(
  project: DocumentationProject
): ProjectSnapshotState {
  return {
    nodes: project.nodes.map((node) => ({
      ...node,
      position: node.position ? { ...node.position } : undefined,
    })),
    edges: project.edges.map((edge) => ({ ...edge })),
    requirements: project.requirements.map((requirement) => ({
      ...requirement,
      relatedNodeIds: [...requirement.relatedNodeIds],
    })),
    notes: project.notes.map((note) => ({
      ...note,
      canvasPosition: note.canvasPosition
        ? { ...note.canvasPosition }
        : undefined,
    })),
  };
}

export function createSnapshotForProject({
  project,
  version,
  title,
}: {
  project: DocumentationProject;
  version: string;
  title?: string | null;
}): DocumentationProject {
  return {
    ...project,
    currentVersion: version,
    snapshots: [
      ...project.snapshots,
      {
        id: createId("snapshot"),
        version,
        title: title || "Architecture snapshot",
        summary:
          "Saved a snapshot of the current architecture, requirements, and notes.",
        createdAt: new Date().toISOString(),
        state: createProjectSnapshotState(project),
      },
    ],
  };
}
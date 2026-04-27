import type { DocumentationProject } from "../_lib/builderTypes";
import { createId } from "../_lib/builderUtils";
import { createNodeForProject } from "../_lib/projectActions";
import type { ClioAgentAction } from "./agentTypes";

export function applyClioAgentAction(
  project: DocumentationProject,
  action: ClioAgentAction
): DocumentationProject {
  if (action.type === "project.updateDescription") {
    return {
      ...project,
      description: action.payload.description,
    };
  }

  if (action.type === "node.create") {
    return createNodeForProject(project, {
      kind: action.payload.kind,
      parentId: action.payload.parentId,
      viewType: action.payload.viewType,
      name: action.payload.name,
      description: action.payload.description,
      lifecycle: action.payload.lifecycle,
    }).project;
  }

  if (action.type === "requirement.create") {
    const nextNumber = project.requirements.length + 1;

    return {
      ...project,
      requirements: [
        ...project.requirements,
        {
          id: createId("req"),
          code: `REQ-${String(nextNumber).padStart(3, "0")}`,
          title: action.payload.title,
          statement: action.payload.statement,
          type: action.payload.type,
          priority: action.payload.priority,
          relatedNodeIds: action.payload.relatedNodeIds,
        },
      ],
    };
  }

  if (action.type === "note.create") {
    return {
      ...project,
      notes: [
        ...project.notes,
        {
          id: createId("note"),
          title: action.payload.title,
          content: action.payload.content,
          type: action.payload.type,
          targetNodeId: action.payload.targetNodeId,
          includeInExport: action.payload.includeInExport,
        },
      ],
    };
  }

  return project;
}

export function applyClioAgentActions(
  project: DocumentationProject,
  actions: ClioAgentAction[]
): DocumentationProject {
  return actions.reduce(
    (currentProject, action) => applyClioAgentAction(currentProject, action),
    project
  );
}

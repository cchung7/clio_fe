import type {
  DocumentationProject,
  Requirement,
} from "./builderTypes";
import { createId } from "./idUtils";

export function createRequirementForNode(
  project: DocumentationProject,
  nodeId: string
): DocumentationProject {
  const nextNumber = project.requirements.length + 1;
  const id = createId("req");

  return {
    ...project,
    requirements: [
      ...project.requirements,
      {
        id,
        code: `REQ-${String(nextNumber).padStart(3, "0")}`,
        title: "New Requirement",
        statement: "The system shall ...",
        type: "functional",
        priority: "medium",
        relatedNodeIds: [nodeId],
      },
    ],
  };
}

export function updateRequirementInProject({
  project,
  requirementId,
  patch,
}: {
  project: DocumentationProject;
  requirementId: string;
  patch: Partial<Requirement>;
}): DocumentationProject {
  return {
    ...project,
    requirements: project.requirements.map((requirement) =>
      requirement.id === requirementId
        ? { ...requirement, ...patch }
        : requirement
    ),
  };
}

export function deleteRequirementFromProject({
  project,
  requirementId,
}: {
  project: DocumentationProject;
  requirementId: string;
}): DocumentationProject {
  return {
    ...project,
    requirements: project.requirements.filter(
      (requirement) => requirement.id !== requirementId
    ),
  };
}
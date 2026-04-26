import type {
  ArchitectureNode,
  DocumentationProject,
  Note,
  Requirement,
} from "./builderTypes";

function list(items: string[]) {
  if (!items.length) return "- None";
  return items.map((item) => `- ${item}`).join("\n");
}

function nodeName(project: DocumentationProject, id: string) {
  return project.nodes.find((node) => node.id === id)?.name ?? id;
}

function renderNode(project: DocumentationProject, node: ArchitectureNode) {
  const relatedRequirements = project.requirements.filter((requirement) =>
    requirement.relatedNodeIds.includes(node.id)
  );

  const relatedNotes = project.notes.filter(
    (note) => note.targetNodeId === node.id && note.includeInExport
  );

  const childNodes = project.nodes.filter((item) => item.parentId === node.id);

  return `### ${node.name}

**Type:** ${node.kind}  
**Status:** ${node.lifecycle}  
**View Type:** ${node.viewType}  
**Child Items:** ${childNodes.length}

**Description:**  
${node.description || "No description provided."}

${
  childNodes.length
    ? `**Child Elements:**\n${childNodes
        .map((child) => `- ${child.name} (${child.kind})`)
        .join("\n")}`
    : "**Child Elements:**\n- None"
}

${
  relatedRequirements.length
    ? `**Related Requirements:**\n${relatedRequirements
        .map((requirement) => `- ${requirement.code}: ${requirement.title}`)
        .join("\n")}`
    : "**Related Requirements:**\n- None"
}

${
  relatedNotes.length
    ? `**Notes:**\n${relatedNotes
        .map((note) => `- ${note.title ? `${note.title}: ` : ""}${note.content}`)
        .join("\n")}`
    : ""
}
`;
}

function renderRequirement(
  project: DocumentationProject,
  requirement: Requirement
) {
  const relatedNodes = requirement.relatedNodeIds.map((id) =>
    nodeName(project, id)
  );

  return `### ${requirement.code}: ${requirement.title}

**Type:** ${requirement.type}  
**Priority:** ${requirement.priority}

${requirement.statement}

**Related Architecture Elements:**  
${list(relatedNodes)}
`;
}

function renderNote(note: Note) {
  return `### ${note.title || "Untitled Note"}

**Type:** ${note.type}

${note.content}
`;
}

export function generateMarkdown(project: DocumentationProject) {
  const includedNotes = project.notes.filter((note) => note.includeInExport);

  return `# ${project.name}

**Version:** ${project.currentVersion}  
**Status:** ${project.status}  
**Last Updated:** ${new Date(project.updatedAt).toLocaleString()}

## 1. System Overview

${project.description || "No project description provided."}

## 2. Architecture Elements

${project.nodes.map((node) => renderNode(project, node)).join("\n")}

## 3. Requirements

${
  project.requirements.length
    ? project.requirements
        .map((requirement) => renderRequirement(project, requirement))
        .join("\n")
    : "No requirements documented."
}

## 4. Notes

${
  includedNotes.length
    ? includedNotes.map((note) => renderNote(note)).join("\n")
    : "No exportable notes documented."
}

## 5. Evolution History

${
  project.changes.length
    ? project.changes
        .map(
          (change) => `### ${change.title}

**Date:** ${new Date(change.createdAt).toLocaleString()}

**Summary:**  
${change.summary}

**Reason:**  
${change.reason || "No reason provided."}

**Impact:**  
${change.impact || "No impact provided."}

**Related Elements:**  
${list(change.relatedNodeIds.map((id) => nodeName(project, id)))}
`
        )
        .join("\n")
    : "No evolution history documented."
}

## 6. Snapshots

${
  project.snapshots.length
    ? project.snapshots
        .map(
          (snapshot) => `### ${snapshot.version}: ${snapshot.title}

**Created:** ${new Date(snapshot.createdAt).toLocaleString()}

${snapshot.summary}
`
        )
        .join("\n")
    : "No snapshots saved yet."
}
`;
}
import type { DocumentationProject } from "../_lib/builderTypes";
import { SYSTEM_OVERVIEW_ID, createId } from "../_lib/builderUtils";
import type { ClioAgentPlan } from "./agentTypes";

export function createMockAgentPlan({
  project,
  prompt,
}: {
  project: DocumentationProject;
  prompt: string;
}): ClioAgentPlan {
  const normalizedPrompt = prompt.toLowerCase();
  const isHealthcarePrompt =
    normalizedPrompt.includes("ehr") ||
    normalizedPrompt.includes("fhir") ||
    normalizedPrompt.includes("healthcare") ||
    normalizedPrompt.includes("patient");

  if (isHealthcarePrompt) {
    return {
      id: createId("agent-plan"),
      title: "Healthcare architecture starter plan",
      summary:
        "Creates a starter healthcare architecture with patient/provider surfaces, a FHIR API boundary, clinical storage, and integration points.",
      actions: [
        {
          type: "project.updateDescription",
          payload: {
            description:
              "A diagram-first architecture model for a healthcare software system with patient-facing, provider-facing, API, clinical data, and interoperability concerns.",
          },
        },
        {
          type: "node.create",
          payload: {
            parentId: SYSTEM_OVERVIEW_ID,
            viewType: "system",
            kind: "system",
            name: "Healthcare Platform",
            description:
              "A healthcare system organized around patient access, provider workflows, clinical data, and interoperability.",
            lifecycle: "planned",
          },
        },
        {
          type: "requirement.create",
          payload: {
            title: "FHIR-Compatible Resource Access",
            statement:
              "The system shall expose supported clinical records through controlled FHIR-compatible resource representations.",
            type: "interface",
            priority: "high",
            relatedNodeIds: project.nodes.length ? [project.nodes[0].id] : [],
          },
        },
        {
          type: "note.create",
          payload: {
            title: "Agent planning note",
            content:
              "This is a mock agent plan. Review all proposed healthcare/FHIR architecture changes before applying them to the project.",
            type: "note",
            includeInExport: true,
          },
        },
      ],
    };
  }

  return {
    id: createId("agent-plan"),
    title: "General architecture improvement plan",
    summary:
      "Suggests a short project overview note and leaves structural changes to the user.",
    actions: [
      {
        type: "note.create",
        payload: {
          title: "Architecture review TODO",
          content:
            "Review the current system map for missing actors, API boundaries, database responsibilities, and external integrations.",
          type: "todo",
          includeInExport: true,
        },
      },
    ],
  };
}

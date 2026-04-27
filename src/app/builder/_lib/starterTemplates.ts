import type { DocumentationProject } from "./builderTypes";
import { CURRENT_SCHEMA_VERSION, SYSTEM_OVERVIEW_ID } from "./builderUtils";

const starterCreatedAt = "2026-01-01T00:00:00.000Z";

export const starterProject: DocumentationProject = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  id: "project-clio-starter",
  name: "Clio",
  description:
    "A lightweight architecture documentation workspace for mapping software systems, decomposing major parts, capturing requirements, and tracking design evolution.",
  currentVersion: "v0.1",
  status: "draft",
  updatedAt: starterCreatedAt,

  nodes: [
    {
      id: "system-clio-starter",
      parentId: SYSTEM_OVERVIEW_ID,
      viewType: "system",
      kind: "system",
      name: "Clio",
      lifecycle: "active",
      description:
        "A diagram-first documentation workspace for evolving software systems. Clio helps users map system context, decompose internal architecture, record requirements, capture notes, and export structured documentation.",
      position: { x: 460, y: 220 },
    },
    {
      id: "frontend",
      parentId: "system-clio-starter",
      viewType: "system",
      kind: "layer",
      name: "Frontend Web App",
      lifecycle: "active",
      description:
        "The browser-based interface where users interact with Clio's homepage, builder workspace, canvas, project sidebar, and inspector panel.",
      position: { x: 120, y: 160 },
    },
    {
      id: "documentation-engine",
      parentId: "system-clio-starter",
      viewType: "system",
      kind: "layer",
      name: "Documentation Engine",
      lifecycle: "active",
      description:
        "The internal logic responsible for turning architecture elements, requirements, notes, and changes into structured documentation outputs.",
      position: { x: 460, y: 160 },
    },
    {
      id: "project-store",
      parentId: "system-clio-starter",
      viewType: "system",
      kind: "database",
      name: "Project Store",
      lifecycle: "active",
      description:
        "The persistence boundary for Clio project data. In the current version, project data is stored locally in the browser.",
      position: { x: 800, y: 160 },
    },
    {
      id: "agent-layer",
      parentId: "system-clio-starter",
      viewType: "system",
      kind: "layer",
      name: "Agent Layer",
      lifecycle: "planned",
      description:
        "A future assistant layer that can propose architecture views, requirements, notes, and documentation improvements for user review.",
      position: { x: 460, y: 360 },
    },

    {
      id: "frontend-home-page",
      parentId: "frontend",
      viewType: "system",
      kind: "component",
      name: "Home Page",
      lifecycle: "active",
      description:
        "The public landing page that introduces Clio and routes users into the builder workspace.",
      position: { x: 120, y: 140 },
    },
    {
      id: "frontend-builder-workspace",
      parentId: "frontend",
      viewType: "system",
      kind: "component",
      name: "Builder Workspace",
      lifecycle: "active",
      description:
        "The main interactive workspace that combines the architecture canvas, project controls, and selected element inspector.",
      position: { x: 420, y: 140 },
    },
    {
      id: "frontend-canvas",
      parentId: "frontend",
      viewType: "system",
      kind: "component",
      name: "Architecture Canvas",
      lifecycle: "active",
      description:
        "The visual workspace where architecture elements are displayed, selected, opened, and repositioned.",
      position: { x: 120, y: 340 },
    },
    {
      id: "frontend-inspector",
      parentId: "frontend",
      viewType: "system",
      kind: "component",
      name: "Inspector Panel",
      lifecycle: "active",
      description:
        "The detail panel used to edit the selected architecture element, attach notes, and manage related requirements.",
      position: { x: 420, y: 340 },
    },

    {
      id: "doc-markdown-generator",
      parentId: "documentation-engine",
      viewType: "system",
      kind: "component",
      name: "Markdown Generator",
      lifecycle: "active",
      description:
        "Generates a markdown document from the current project structure, requirements, notes, evolution history, and snapshots.",
      position: { x: 120, y: 140 },
    },
    {
      id: "doc-snapshot-manager",
      parentId: "documentation-engine",
      viewType: "system",
      kind: "component",
      name: "Snapshot Manager",
      lifecycle: "active",
      description:
        "Captures point-in-time versions of the project so architecture evolution can be tracked over time.",
      position: { x: 420, y: 140 },
    },
    {
      id: "doc-json-import-export",
      parentId: "documentation-engine",
      viewType: "system",
      kind: "component",
      name: "JSON Import/Export",
      lifecycle: "active",
      description:
        "Allows Clio projects to be exported as structured JSON and restored later through import.",
      position: { x: 720, y: 140 },
    },

    {
      id: "agent-planner",
      parentId: "agent-layer",
      viewType: "system",
      kind: "component",
      name: "Agent Planner",
      lifecycle: "planned",
      description:
        "Future logic that can inspect the current project and propose structured architecture or documentation changes.",
      position: { x: 120, y: 140 },
    },
    {
      id: "agent-review",
      parentId: "agent-layer",
      viewType: "system",
      kind: "component",
      name: "Proposed Action Review",
      lifecycle: "planned",
      description:
        "Future review step where users inspect and approve agent-suggested changes before they modify the project.",
      position: { x: 420, y: 140 },
    },
  ],

  edges: [
    {
      id: "edge-user-clio",
      source: "actor-user",
      target: "system-clio-starter",
      label: "uses",
      relationshipType: "uses",
    },
    {
      id: "edge-clio-external",
      source: "system-clio-starter",
      target: "external-service",
      label: "integrates with",
      relationshipType: "calls",
    },

    {
      id: "edge-frontend-doc-engine",
      source: "frontend",
      target: "documentation-engine",
      label: "uses",
      relationshipType: "uses",
    },
    {
      id: "edge-doc-engine-project-store",
      source: "documentation-engine",
      target: "project-store",
      label: "reads/writes",
      relationshipType: "writes",
    },
    {
      id: "edge-agent-doc-engine",
      source: "agent-layer",
      target: "documentation-engine",
      label: "proposes updates",
      relationshipType: "calls",
    },

    {
      id: "edge-home-builder",
      source: "frontend-home-page",
      target: "frontend-builder-workspace",
      label: "opens",
      relationshipType: "uses",
    },
    {
      id: "edge-builder-canvas",
      source: "frontend-builder-workspace",
      target: "frontend-canvas",
      label: "contains",
      relationshipType: "uses",
    },
    {
      id: "edge-builder-inspector",
      source: "frontend-builder-workspace",
      target: "frontend-inspector",
      label: "contains",
      relationshipType: "uses",
    },

    {
      id: "edge-markdown-snapshot",
      source: "doc-snapshot-manager",
      target: "doc-markdown-generator",
      label: "supports export",
      relationshipType: "uses",
    },
    {
      id: "edge-json-doc-engine",
      source: "doc-json-import-export",
      target: "doc-markdown-generator",
      label: "shares project model",
      relationshipType: "uses",
    },

    {
      id: "edge-agent-planner-review",
      source: "agent-planner",
      target: "agent-review",
      label: "submits proposal",
      relationshipType: "sends_data_to",
    },
  ],

  requirements: [
    {
      id: "req-001",
      code: "REQ-001",
      title: "Architecture Workspace Access",
      statement:
        "The system shall allow users to open an interactive builder workspace for creating and inspecting architecture documentation.",
      type: "functional",
      priority: "high",
      relatedNodeIds: ["actor-user", "system-clio-starter", "frontend"],
    },
    {
      id: "req-002",
      code: "REQ-002",
      title: "Architecture Element Decomposition",
      statement:
        "The system shall allow users to decompose a selected architecture element into lower-level elements when additional design detail is needed.",
      type: "functional",
      priority: "high",
      relatedNodeIds: ["frontend-builder-workspace", "frontend-canvas"],
    },
    {
      id: "req-003",
      code: "REQ-003",
      title: "Documentation Export",
      statement:
        "The system shall generate a markdown document from architecture elements, requirements, notes, change history, and snapshots.",
      type: "functional",
      priority: "medium",
      relatedNodeIds: ["documentation-engine", "doc-markdown-generator"],
    },
    {
      id: "req-004",
      code: "REQ-004",
      title: "Project Persistence",
      statement:
        "The system shall preserve project data locally so users can continue working after leaving and returning to the builder workspace.",
      type: "functional",
      priority: "high",
      relatedNodeIds: ["project-store"],
    },
    {
      id: "req-005",
      code: "REQ-005",
      title: "Agent-Proposed Changes",
      statement:
        "The system should allow future agent-generated architecture or documentation changes to be reviewed by the user before they are applied.",
      type: "constraint",
      priority: "medium",
      relatedNodeIds: ["agent-layer", "agent-planner", "agent-review"],
    },
  ],

  notes: [
    {
      id: "note-001",
      title: "Context vs internal decomposition",
      type: "decision",
      content:
        "Actors and external systems are shown in the high-level system overview because they sit outside the Clio system boundary. Internal layers and components are shown when the Clio system is opened and decomposed.",
      targetNodeId: "system-clio-starter",
      includeInExport: true,
    },
    {
      id: "note-002",
      title: "Agent safety direction",
      type: "decision",
      content:
        "Future agent behavior should propose structured changes rather than applying changes silently. The user should remain responsible for reviewing and applying agent-suggested updates.",
      targetNodeId: "agent-layer",
      includeInExport: true,
    },
  ],

  changes: [
    {
      id: "change-001",
      title: "Initial architecture created",
      summary:
        "Created the initial Clio architecture model with a system context view and internal decomposition view.",
      reason:
        "The project needs a lightweight starting point for documenting architecture and design evolution.",
      impact:
        "Provides a baseline system view, internal decomposition, requirements, notes, and future agent planning structure.",
      relatedNodeIds: ["system-clio-starter"],
      createdAt: starterCreatedAt,
    },
  ],

  snapshots: [],
};
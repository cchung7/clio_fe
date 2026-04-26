export type DecompositionView = "system" | "functional" | "object" | "domain";

export type WorkspacePanel = "canvas" | "document" | "evolution";

export type NodeKind =
  | "system"
  | "actor"
  | "layer"
  | "component"
  | "api"
  | "database"
  | "external";

export type NodeLifecycle =
  | "planned"
  | "active"
  | "changing"
  | "deprecated"
  | "removed";

export type RequirementType =
  | "functional"
  | "nonfunctional"
  | "constraint"
  | "interface";

export type RequirementPriority = "low" | "medium" | "high";

export type NoteType = "note" | "decision" | "question" | "todo";

export type ProjectStatus = "draft" | "review" | "approved" | "archived";

export type ArchitectureNode = {
  id: string;
  parentId: string;
  viewType: DecompositionView;
  kind: NodeKind;
  name: string;
  description: string;
  lifecycle: NodeLifecycle;
  position: {
    x: number;
    y: number;
  };
};

export type ArchitectureEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
  relationshipType?:
    | "uses"
    | "calls"
    | "reads"
    | "writes"
    | "depends_on"
    | "sends_data_to";
};

export type Requirement = {
  id: string;
  code: string;
  title: string;
  statement: string;
  type: RequirementType;
  priority: RequirementPriority;
  relatedNodeIds: string[];
};

export type Note = {
  id: string;
  title?: string;
  content: string;
  type: NoteType;
  targetNodeId?: string;
  includeInExport: boolean;
};

export type ChangeNote = {
  id: string;
  title: string;
  summary: string;
  reason?: string;
  impact?: string;
  relatedNodeIds: string[];
  createdAt: string;
};

export type ProjectSnapshot = {
  id: string;
  version: string;
  title: string;
  summary: string;
  createdAt: string;
  state: {
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
    requirements: Requirement[];
    notes: Note[];
  };
};

export type DocumentationProject = {
  schemaVersion: number;
  id: string;
  name: string;
  description: string;
  currentVersion: string;
  status: ProjectStatus;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  requirements: Requirement[];
  notes: Note[];
  changes: ChangeNote[];
  snapshots: ProjectSnapshot[];
  updatedAt: string;
};
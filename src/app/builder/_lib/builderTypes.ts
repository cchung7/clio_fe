export type DecompositionView = "system" | "functional" | "object" | "domain";

export type WorkspacePanel = "canvas" | "document" | "evolution";

export type ProjectStatus = "draft" | "review" | "approved" | "archived";

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

export type RelationshipType =
  | "uses"
  | "calls"
  | "writes"
  | "reads"
  | "sends_data_to";

export type ConnectorLineStyle = "solid" | "dotted";

export type ConnectorArrowMode = "none" | "forward" | "backward" | "both";

export type RequirementType =
  | "functional"
  | "nonfunctional"
  | "constraint"
  | "interface";

export type RequirementPriority = "low" | "medium" | "high";

export type NoteType = "note" | "decision" | "question" | "todo";

export type CanvasPosition = {
  x: number;
  y: number;
};

export type ArchitectureNode = {
  id: string;
  parentId: string;
  viewType: DecompositionView;
  kind: NodeKind;
  name: string;
  description: string;
  lifecycle: NodeLifecycle;
  position?: CanvasPosition;
};

export type ArchitectureEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
  relationshipType: RelationshipType;
  lineStyle?: ConnectorLineStyle;
  arrowMode?: ConnectorArrowMode;
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
  type: NoteType;
  content: string;
  targetNodeId?: string;
  includeInExport: boolean;

  /**
   * Canvas-only note support.
   * When true, this note appears visually inside the current canvas view.
   */
  showOnCanvas?: boolean;
  canvasPosition?: CanvasPosition;
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

export type ProjectSnapshotState = {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  requirements: Requirement[];
  notes: Note[];
};

export type ProjectSnapshot = {
  id: string;
  version: string;
  title: string;
  summary: string;
  createdAt: string;

  /**
   * Optional because older snapshots may only contain metadata.
   * Future restore/compare features can use this state object.
   */
  state?: ProjectSnapshotState;
};

export type DocumentationProject = {
  schemaVersion: number;
  id: string;
  name: string;
  description: string;
  currentVersion: string;
  status: ProjectStatus;
  updatedAt: string;

  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  requirements: Requirement[];
  notes: Note[];
  changes: ChangeNote[];
  snapshots: ProjectSnapshot[];
};
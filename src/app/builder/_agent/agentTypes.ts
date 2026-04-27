import type {
  DecompositionView,
  NodeKind,
  NodeLifecycle,
  NoteType,
  RequirementPriority,
  RequirementType,
} from "../_lib/builderTypes";

export type ClioAgentAction =
  | {
      type: "node.create";
      payload: {
        parentId: string;
        viewType: DecompositionView;
        kind: NodeKind;
        name: string;
        description: string;
        lifecycle: NodeLifecycle;
      };
    }
  | {
      type: "requirement.create";
      payload: {
        title: string;
        statement: string;
        type: RequirementType;
        priority: RequirementPriority;
        relatedNodeIds: string[];
      };
    }
  | {
      type: "note.create";
      payload: {
        title?: string;
        content: string;
        type: NoteType;
        targetNodeId?: string;
        includeInExport: boolean;
      };
    }
  | {
      type: "project.updateDescription";
      payload: {
        description: string;
      };
    };

export type ClioAgentPlan = {
  id: string;
  title: string;
  summary: string;
  actions: ClioAgentAction[];
};

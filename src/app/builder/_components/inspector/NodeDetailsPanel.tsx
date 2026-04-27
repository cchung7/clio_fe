import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
} from "../../_lib/builderTypes";
import { SYSTEM_OVERVIEW_ID } from "../../_lib/builderUtils";

import { ElementInspectorFields } from "./ElementInspectorFields";
import { NoElementSelected } from "./NoElementSelected";
import { RequirementSection } from "./RequirementSection";
import { SystemSummarySection } from "./SystemSummarySection";

type NodeDetailsPanelProps = {
  node: ArchitectureNode | null;
  project: DocumentationProject;
  decompositionView: DecompositionView;
  updateNode: (id: string, patch: Partial<ArchitectureNode>) => void;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  addRequirement: () => void;
};

export function NodeDetailsPanel({
  node,
  project,
  decompositionView,
  updateNode,
  updateProject,
  addRequirement,
}: NodeDetailsPanelProps) {
  if (!node) {
    return <NoElementSelected />;
  }

  const isHighLevelSystemElement =
    node.kind === "system" && node.parentId === SYSTEM_OVERVIEW_ID;

  const relatedRequirements = project.requirements.filter((requirement) =>
    requirement.relatedNodeIds.includes(node.id)
  );

  return (
    <div className="space-y-5">
      <ElementInspectorFields
        node={node}
        project={project}
        decompositionView={decompositionView}
        updateNode={updateNode}
      />

      {isHighLevelSystemElement ? (
        <SystemSummarySection
          node={node}
          project={project}
          decompositionView={decompositionView}
        />
      ) : (
        <RequirementSection
          relatedRequirements={relatedRequirements}
          updateProject={updateProject}
          onAddRequirement={addRequirement}
        />
      )}
    </div>
  );
}
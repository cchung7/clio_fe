import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
} from "../../_lib/builderTypes";
import { SYSTEM_OVERVIEW_ID } from "../../_lib/builderUtils";

import { ConnectorInspectorFields } from "./ConnectorInspectorFields";
import { ElementInspectorFields } from "./ElementInspectorFields";
import { NoElementSelected } from "./NoElementSelected";
import { RequirementSection } from "./RequirementSection";
import { SystemSummarySection } from "./SystemSummarySection";

type NodeDetailsPanelProps = {
  node: ArchitectureNode | null;
  project: DocumentationProject;
  focusedNodeId: string;
  selectedConnectorId: string | null;
  setSelectedConnectorId: (id: string | null) => void;
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
  focusedNodeId,
  selectedConnectorId,
  setSelectedConnectorId,
  decompositionView,
  updateNode,
  updateProject,
  addRequirement,
}: NodeDetailsPanelProps) {
  const selectedConnector = selectedConnectorId
    ? project.edges.find((edge) => edge.id === selectedConnectorId) ?? null
    : null;

  if (selectedConnector) {
    return (
      <ConnectorInspectorFields
        edge={selectedConnector}
        project={project}
        focusedNodeId={focusedNodeId}
        decompositionView={decompositionView}
        updateProject={updateProject}
        onDelete={() => setSelectedConnectorId(null)}
      />
    );
  }

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
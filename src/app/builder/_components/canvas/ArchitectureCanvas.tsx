import * as React from "react";

import type {
  DecompositionView,
  DocumentationProject,
} from "../../_lib/builderTypes";
import {
  getBreadcrumbs,
  getCurrentViewLabel,
  getNodeById,
  SYSTEM_OVERVIEW_ID,
} from "../../_lib/builderUtils";
import { useCurrentCanvasItems } from "../../_hooks/useCurrentCanvasItems";

import { CanvasHeader } from "./CanvasHeader";
import { CanvasViewport } from "./CanvasViewport";

type ArchitectureCanvasProps = {
  project: DocumentationProject;
  focusedNodeId: string;
  selectedNodeId: string;
  selectedConnectorId: string | null;
  decompositionView: DecompositionView;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  setSelectedNodeId: (id: string) => void;
  setFocusedNodeId: (id: string) => void;
  onSelectConnector: (id: string) => void;
};

export function ArchitectureCanvas({
  project,
  focusedNodeId,
  selectedNodeId,
  selectedConnectorId,
  decompositionView,
  updateProject,
  setSelectedNodeId,
  setFocusedNodeId,
  onSelectConnector,
}: ArchitectureCanvasProps) {
  const [viewportResetToken, setViewportResetToken] = React.useState(0);

  const focusedNode = getNodeById(project, focusedNodeId);

  const { currentViewNodes, canvasNotes } = useCurrentCanvasItems({
    project,
    focusedNodeId,
    decompositionView,
  });

  const breadcrumbs = React.useMemo(
    () => getBreadcrumbs(project, focusedNodeId),
    [project, focusedNodeId]
  );

  const currentViewLabel = getCurrentViewLabel(project, focusedNodeId);

  function requestViewportReset() {
    setViewportResetToken((current) => current + 1);
  }

  function openParentView() {
    if (focusedNodeId === SYSTEM_OVERVIEW_ID) return;

    if (!focusedNode || focusedNode.parentId === SYSTEM_OVERVIEW_ID) {
      setFocusedNodeId(SYSTEM_OVERVIEW_ID);
      setSelectedNodeId(SYSTEM_OVERVIEW_ID);
      requestViewportReset();
      return;
    }

    setFocusedNodeId(focusedNode.parentId);
    setSelectedNodeId(focusedNode.parentId);
    requestViewportReset();
  }

  function openSystemView() {
    setFocusedNodeId(SYSTEM_OVERVIEW_ID);
    setSelectedNodeId(SYSTEM_OVERVIEW_ID);
    requestViewportReset();
  }

  function openBreadcrumb(id: string) {
    setFocusedNodeId(id);
    setSelectedNodeId(id);
    requestViewportReset();
  }

  return (
    <div className="flex h-[38rem] w-full flex-col xl:h-full">
      <CanvasHeader
        breadcrumbs={breadcrumbs}
        currentViewLabel={currentViewLabel}
        focusedNodeId={focusedNodeId}
        isAtSystemOverview={focusedNodeId === SYSTEM_OVERVIEW_ID}
        onOpenBreadcrumb={openBreadcrumb}
        onOpenParentView={openParentView}
        onOpenSystemView={openSystemView}
      />

      <CanvasViewport
        project={project}
        visibleNodes={currentViewNodes}
        canvasNotes={canvasNotes}
        selectedNodeId={selectedNodeId}
        selectedConnectorId={selectedConnectorId}
        decompositionView={decompositionView}
        viewportResetToken={viewportResetToken}
        updateProject={updateProject}
        setSelectedNodeId={setSelectedNodeId}
        setFocusedNodeId={setFocusedNodeId}
        requestViewportReset={requestViewportReset}
        onSelectConnector={onSelectConnector}
      />
    </div>
  );
}
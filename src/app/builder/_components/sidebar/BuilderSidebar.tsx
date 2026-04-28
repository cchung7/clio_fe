import type {
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
} from "../../_lib/builderTypes";
import { useCurrentCanvasItems } from "../../_hooks/useCurrentCanvasItems";

import { AddToCanvasPanel } from "./AddToCanvasPanel";
import { ElementsInViewList } from "./ElementsInViewList";

type BuilderSidebarProps = {
  project: DocumentationProject;
  focusedNodeId: string;
  selectedNodeId: string;
  decompositionView: DecompositionView;
  setSelectedNodeId: (id: string) => void;
  setFocusedNodeId: (id: string) => void;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  addNode: (params: {
    kind: NodeKind;
    name: string;
    description: string;
    lifecycle: NodeLifecycle;
  }) => void;
  deleteNode: (id: string) => void;
  resetProject: () => void;
};

export function BuilderSidebar({
  project,
  focusedNodeId,
  selectedNodeId,
  decompositionView,
  setSelectedNodeId,
  setFocusedNodeId,
  updateProject,
  addNode,
  deleteNode,
  resetProject,
}: BuilderSidebarProps) {
  const { currentViewNodes, canvasNotes, connectableItems } =
    useCurrentCanvasItems({
      project,
      focusedNodeId,
      decompositionView,
    });

  return (
    <aside className="clio-sidebar h-full min-h-0 overflow-auto border-r p-4">
      <AddToCanvasPanel
        project={project}
        focusedNodeId={focusedNodeId}
        decompositionView={decompositionView}
        canvasNotes={canvasNotes}
        connectableItems={connectableItems}
        updateProject={updateProject}
        addNode={addNode}
      />

      <ElementsInViewList
        project={project}
        currentViewNodes={currentViewNodes}
        decompositionView={decompositionView}
        selectedNodeId={selectedNodeId}
        setSelectedNodeId={setSelectedNodeId}
        setFocusedNodeId={setFocusedNodeId}
        deleteNode={deleteNode}
      />

      <button
        onClick={resetProject}
        className="mt-6 w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
      >
        Reset Starter
      </button>
    </aside>
  );
}
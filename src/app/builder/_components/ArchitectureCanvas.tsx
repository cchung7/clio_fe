import {
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
} from "../_lib/builderTypes";
import {
  getBreadcrumbs,
  getChildCount,
  getCurrentViewLabel,
  getNodeById,
  getVisibleNodes,
  SYSTEM_OVERVIEW_ID,
} from "../_lib/builderUtils";

type ArchitectureCanvasProps = {
  project: DocumentationProject;
  focusedNodeId: string;
  selectedNodeId: string;
  decompositionView: DecompositionView;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  setSelectedNodeId: (id: string) => void;
  setFocusedNodeId: (id: string) => void;
};

function toFlowNodes({
  project,
  visibleNodes,
  decompositionView,
}: {
  project: DocumentationProject;
  visibleNodes: ArchitectureNode[];
  decompositionView: DecompositionView;
}): Node[] {
  return visibleNodes.map((node) => {
    const childCount = getChildCount({
      project,
      nodeId: node.id,
      decompositionView,
    });

    return {
      id: node.id,
      position: node.position,
      data: {
        label: (
          <div
            title={node.description}
            className="clio-flow-node min-w-52 rounded-xl px-4 py-3 transition"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--clio-purple-700)]">
                {node.kind}
              </span>
              <span className="clio-badge clio-badge-gold text-[10px]">
                {node.lifecycle}
              </span>
            </div>

            <div className="mt-2 text-sm font-bold text-[var(--clio-ink)]">
              {node.name}
            </div>

            <div className="mt-1 line-clamp-3 text-xs leading-5 text-[var(--clio-muted)]">
              {node.description || "No description yet."}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-[var(--clio-muted)]">
              <span>
                {childCount > 0 ? `${childCount} child items` : "No children"}
              </span>
              {childCount > 0 ? (
                <span className="font-bold text-[var(--clio-purple-700)]">
                  Open
                </span>
              ) : null}
            </div>
          </div>
        ),
      },
      type: "default",
    };
  });
}

function toFlowEdges({
  project,
  visibleNodeIds,
}: {
  project: DocumentationProject;
  visibleNodeIds: Set<string>;
}): Edge[] {
  return project.edges
    .filter(
      (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    )
    .map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.relationshipType === "calls",
      style: {
        stroke: "#73569a",
        strokeWidth: 2,
      },
      labelStyle: {
        fill: "#45305f",
        fontWeight: 600,
      },
    }));
}

export function ArchitectureCanvas({
  project,
  focusedNodeId,
  selectedNodeId,
  decompositionView,
  updateProject,
  setSelectedNodeId,
  setFocusedNodeId,
}: ArchitectureCanvasProps) {
  const focusedNode = getNodeById(project, focusedNodeId);

  const visibleNodes = getVisibleNodes({
    project,
    focusedNodeId,
    decompositionView,
  });

  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  const breadcrumbs = getBreadcrumbs(project, focusedNodeId);
  const currentViewLabel = getCurrentViewLabel(project, focusedNodeId);

  function handleNodeChanges(changes: NodeChange[]) {
    const currentFlowNodes = toFlowNodes({
      project,
      visibleNodes,
      decompositionView,
    });

    const updatedFlowNodes = applyNodeChanges(changes, currentFlowNodes);

    updateProject((current) => ({
      ...current,
      nodes: current.nodes.map((node) => {
        const flowNode = updatedFlowNodes.find((item) => item.id === node.id);

        if (!flowNode) return node;

        return {
          ...node,
          position: flowNode.position,
        };
      }),
    }));
  }

  function openParentView() {
    if (focusedNodeId === SYSTEM_OVERVIEW_ID) return;

    if (!focusedNode || focusedNode.parentId === SYSTEM_OVERVIEW_ID) {
      setFocusedNodeId(SYSTEM_OVERVIEW_ID);
      setSelectedNodeId(SYSTEM_OVERVIEW_ID);
      return;
    }

    setFocusedNodeId(focusedNode.parentId);
    setSelectedNodeId(focusedNode.parentId);
  }

  return (
    <div className="flex h-[38rem] w-full flex-col xl:h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--clio-border)] bg-[rgba(255,253,248,0.82)] px-4 py-3">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--clio-purple-700)]">
            Current View
          </div>

          <div className="mt-1 text-sm font-semibold text-[var(--clio-purple-950)]">
            {currentViewLabel}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-1 text-xs">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.id} className="inline-flex items-center gap-1">
                <button
                  onClick={() => {
                    setFocusedNodeId(crumb.id);
                    setSelectedNodeId(crumb.id);
                  }}
                  className={`rounded-md px-2 py-1 font-semibold transition hover:bg-[var(--clio-purple-50)] ${
                    crumb.id === focusedNodeId
                      ? "text-[var(--clio-purple-900)]"
                      : "text-[var(--clio-muted)]"
                  }`}
                >
                  {crumb.name}
                </button>

                {index < breadcrumbs.length - 1 ? (
                  <span className="text-[var(--clio-soft-muted)]">/</span>
                ) : null}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openParentView}
            disabled={focusedNodeId === SYSTEM_OVERVIEW_ID}
            className="clio-btn-secondary rounded-lg px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back Up
          </button>

          <button
            onClick={() => {
              setFocusedNodeId(SYSTEM_OVERVIEW_ID);
              setSelectedNodeId(SYSTEM_OVERVIEW_ID);
            }}
            className="clio-btn-secondary rounded-lg px-3 py-2 text-sm font-medium"
          >
            System Overview
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {visibleNodes.length ? (
          <ReactFlow
            nodes={toFlowNodes({ project, visibleNodes, decompositionView })}
            edges={toFlowEdges({ project, visibleNodeIds })}
            onNodesChange={handleNodeChanges}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onNodeDoubleClick={(_, node) => {
              setSelectedNodeId(node.id);
              setFocusedNodeId(node.id);
            }}
            fitView
          >
            <Background color="#bfae99" gap={32} size={1.5} />
            <Controls />
            <MiniMap nodeColor="#73569a" maskColor="rgba(247, 241, 230, 0.72)" />
          </ReactFlow>
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <div className="clio-panel max-w-md rounded-2xl p-6">
              <div className="text-lg font-bold text-[var(--clio-purple-950)]">
                This view is empty.
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--clio-muted)]">
                Open Project / Add and create an element for this current view.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
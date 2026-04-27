import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
} from "../../_lib/builderTypes";
import { ConfirmDeleteButton } from "../shared/ConfirmDeleteButton";

type ElementsInViewListProps = {
  project: DocumentationProject;
  currentViewNodes: ArchitectureNode[];
  decompositionView: DecompositionView;
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  setFocusedNodeId: (id: string) => void;
  deleteNode: (id: string) => void;
};

function formatElementCount(count: number) {
  return `${count} ${count === 1 ? "element" : "elements"}`;
}

export function ElementsInViewList({
  project,
  currentViewNodes,
  decompositionView,
  selectedNodeId,
  setSelectedNodeId,
  setFocusedNodeId,
  deleteNode,
}: ElementsInViewListProps) {
  return (
    <div className="mt-6">
      <div className="clio-label mb-2">Elements in This View</div>

      <div className="space-y-2">
        {currentViewNodes.map((node) => {
          const elementCount = project.nodes.filter(
            (item) =>
              item.parentId === node.id && item.viewType === decompositionView
          ).length;

          const selected = selectedNodeId === node.id;

          return (
            <div
              key={node.id}
              className={`group grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border px-3 py-2 transition ${
                selected
                  ? "border-[var(--clio-gold-400)] bg-[var(--clio-gold-100)] text-[var(--clio-ink)] shadow-sm"
                  : "border-[var(--clio-border)] bg-[rgba(255,253,248,0.76)] text-[var(--clio-ink)] hover:border-[var(--clio-purple-border)] hover:bg-[var(--clio-purple-50)]"
              }`}
            >
              <button
                onClick={() => setSelectedNodeId(node.id)}
                onDoubleClick={() => {
                  setSelectedNodeId(node.id);
                  setFocusedNodeId(node.id);
                }}
                className="min-w-0 text-left text-sm"
              >
                <div className="truncate font-semibold">{node.name}</div>

                <div className="text-xs opacity-75">
                  {node.kind} · {node.lifecycle} ·{" "}
                  {formatElementCount(elementCount)}
                </div>
              </button>

              <ConfirmDeleteButton
                message={`Delete ${node.name}? This will also remove its child elements and connected documentation.`}
                ariaLabel={`Delete ${node.name}`}
                title={`Delete ${node.name}`}
                onConfirm={() => deleteNode(node.id)}
              />
            </div>
          );
        })}

        {!currentViewNodes.length ? (
          <p className="rounded-lg border border-dashed border-[var(--clio-border)] p-3 text-sm text-[var(--clio-muted)]">
            This view has no elements yet. Add one above.
          </p>
        ) : null}
      </div>
    </div>
  );
}
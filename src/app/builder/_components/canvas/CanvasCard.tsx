import type { ArchitectureNode } from "../../_lib/builderTypes";
import { CARD_HEIGHT, CARD_WIDTH } from "../../_lib/canvasGeometry";

type CanvasCardProps = {
  node: ArchitectureNode;
  elementCount: number;
  selected: boolean;
  dragging: boolean;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  onDoubleClick: () => void;
};

function formatElementCount(count: number) {
  if (count <= 0) return "No elements";
  return `${count} ${count === 1 ? "element" : "elements"}`;
}

export function CanvasCard({
  node,
  elementCount,
  selected,
  dragging,
  onPointerDown,
  onDoubleClick,
}: CanvasCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      title={node.description}
      onPointerDown={onPointerDown}
      onDoubleClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDoubleClick();
      }}
      className={`clio-flow-node absolute rounded-xl px-4 py-3 text-left transition select-none ${
        selected
          ? "ring-2 ring-[var(--clio-purple-700)] ring-offset-2 ring-offset-[var(--clio-paper)]"
          : ""
      } ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        width: CARD_WIDTH,
        minHeight: CARD_HEIGHT,
        touchAction: "none",
      }}
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
        <span>{formatElementCount(elementCount)}</span>

        <span className="font-bold text-[var(--clio-purple-700)]">
          Double-click to open
        </span>
      </div>
    </div>
  );
}
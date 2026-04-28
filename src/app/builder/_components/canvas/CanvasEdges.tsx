import type { ArchitectureEdge } from "../../_lib/builderTypes";
import type { CanvasItemRect } from "../../_lib/canvasGeometry";
import { getBoundaryPoint } from "../../_lib/canvasGeometry";
import {
  getLineStrokeDasharray,
  getMarkerEnd,
  getMarkerStart,
} from "../../_lib/connectorUtils";

type CanvasEdgesProps = {
  edges: ArchitectureEdge[];
  itemRects: Map<string, CanvasItemRect>;
  selectedConnectorId: string | null;
  onSelectConnector: (id: string) => void;
};

export function CanvasEdges({
  edges,
  itemRects,
  selectedConnectorId,
  onSelectConnector,
}: CanvasEdgesProps) {
  return (
    <svg
      className="absolute left-0 top-0 h-full w-full overflow-visible"
      role="presentation"
    >
      <defs>
        <marker
          id="clio-arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto-start-reverse"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#73569a" />
        </marker>
      </defs>

      {edges.map((edge) => {
        const source = itemRects.get(edge.source);
        const target = itemRects.get(edge.target);

        if (!source || !target) return null;

        const selected = selectedConnectorId === edge.id;

        const start = getBoundaryPoint(source, target);
        const end = getBoundaryPoint(target, source);
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        const visibleStroke = selected ? "#b08a2e" : "#73569a";
        const visibleStrokeWidth = selected ? 3 : 2;

        function handleSelect(event: React.MouseEvent<SVGElement>) {
          event.preventDefault();
          event.stopPropagation();
          onSelectConnector(edge.id);
        }

        return (
          <g key={edge.id}>
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="transparent"
              strokeWidth="18"
              className="cursor-pointer"
              onClick={handleSelect}
            />

            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={visibleStroke}
              strokeWidth={visibleStrokeWidth}
              strokeDasharray={getLineStrokeDasharray(
                edge.lineStyle,
                edge.relationshipType
              )}
              markerStart={getMarkerStart(edge.arrowMode)}
              markerEnd={getMarkerEnd(edge.arrowMode)}
              style={{
                pointerEvents: "none",
              }}
            />

            {edge.label ? (
              <text
                x={midX}
                y={midY - 8}
                textAnchor="middle"
                className={`text-[11px] font-bold ${
                  selected
                    ? "fill-[var(--clio-gold-800)]"
                    : "fill-[var(--clio-purple-900)]"
                }`}
                style={{
                  cursor: "pointer",
                  pointerEvents: "auto",
                  paintOrder: "stroke",
                  stroke: "rgba(255,253,248,0.92)",
                  strokeWidth: 4,
                }}
                onClick={handleSelect}
              >
                {edge.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
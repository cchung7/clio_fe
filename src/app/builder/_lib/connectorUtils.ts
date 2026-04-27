import type {
  ConnectorArrowMode,
  ConnectorLineStyle,
  RelationshipType,
} from "./builderTypes";

export function getLineStrokeDasharray(
  lineStyle?: ConnectorLineStyle,
  relationshipType?: RelationshipType
) {
  if (lineStyle === "dotted") return "5 7";
  if (!lineStyle && relationshipType === "calls") return "6 6";
  return undefined;
}

export function getMarkerStart(arrowMode?: ConnectorArrowMode) {
  if (arrowMode === "backward" || arrowMode === "both") {
    return "url(#clio-arrowhead)";
  }

  return undefined;
}

export function getMarkerEnd(arrowMode?: ConnectorArrowMode) {
  if (!arrowMode || arrowMode === "forward" || arrowMode === "both") {
    return "url(#clio-arrowhead)";
  }

  return undefined;
}
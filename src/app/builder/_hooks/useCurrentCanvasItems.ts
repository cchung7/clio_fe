import * as React from "react";

import type {
  DecompositionView,
  DocumentationProject,
} from "../_lib/builderTypes";
import {
  getCanvasNotes,
  getConnectableCanvasItems,
  getConnectableItemLabel,
  getCurrentViewEdges,
  getCurrentViewNodes,
} from "../_lib/canvasItems";

export function useCurrentCanvasItems({
  project,
  focusedNodeId,
  decompositionView,
}: {
  project: DocumentationProject;
  focusedNodeId: string;
  decompositionView: DecompositionView;
}) {
  const currentViewNodes = React.useMemo(
    () =>
      getCurrentViewNodes({
        project,
        focusedNodeId,
        decompositionView,
      }),
    [project, focusedNodeId, decompositionView]
  );

  const canvasNotes = React.useMemo(
    () =>
      getCanvasNotes({
        project,
        focusedNodeId,
      }),
    [project, focusedNodeId]
  );

  const connectableItems = React.useMemo(
    () =>
      getConnectableCanvasItems({
        currentViewNodes,
        canvasNotes,
      }),
    [currentViewNodes, canvasNotes]
  );

  const connectableItemIds = React.useMemo(
    () => new Set(connectableItems.map((item) => item.id)),
    [connectableItems]
  );

  const currentViewEdges = React.useMemo(
    () =>
      getCurrentViewEdges({
        project,
        connectableItemIds,
      }),
    [project, connectableItemIds]
  );

  const getItemLabel = React.useCallback(
    (id: string) => getConnectableItemLabel(connectableItems, id),
    [connectableItems]
  );

  return {
    currentViewNodes,
    canvasNotes,
    connectableItems,
    connectableItemIds,
    currentViewEdges,
    getConnectableItemLabel: getItemLabel,
  };
}
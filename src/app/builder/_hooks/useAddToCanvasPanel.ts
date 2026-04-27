import * as React from "react";

import type {
  ConnectorArrowMode,
  ConnectorLineStyle,
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
  Note,
} from "../_lib/builderTypes";
import {
  getAllowedNodeKindsForCurrentView,
  getNodeKindDescription,
  getNodeKindLabel,
} from "../_lib/builderUtils";
import {
  addConnectorToProject,
  createCanvasNoteForProject,
} from "../_lib/canvasProjectActions";
import type { CanvasConnectableItem } from "../_lib/canvasItems";

export type AddToCanvasMode = "element" | "note" | "connector";

export function useAddToCanvasPanel({
  project,
  focusedNodeId,
  decompositionView,
  canvasNotes,
  connectableItems,
  updateProject,
  addNode,
}: {
  project: DocumentationProject;
  focusedNodeId: string;
  decompositionView: DecompositionView;
  canvasNotes: Note[];
  connectableItems: CanvasConnectableItem[];
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  addNode: (params: {
    kind: NodeKind;
    name: string;
    description: string;
    lifecycle: NodeLifecycle;
  }) => void;
}) {
  const allowedKinds = React.useMemo(
    () =>
      getAllowedNodeKindsForCurrentView({
        project,
        focusedNodeId,
      }),
    [project, focusedNodeId]
  );

  const [addMode, setAddMode] = React.useState<AddToCanvasMode>("element");

  const [newElementKind, setNewElementKind] = React.useState<NodeKind>(
    allowedKinds[0] ?? "component"
  );
  const [newElementName, setNewElementName] = React.useState("");
  const [newElementDescription, setNewElementDescription] = React.useState("");
  const [newElementStatus, setNewElementStatus] =
    React.useState<NodeLifecycle>("planned");

  const [newNoteTitle, setNewNoteTitle] = React.useState("");
  const [newNoteBody, setNewNoteBody] = React.useState("");

  const [connectorSourceId, setConnectorSourceId] = React.useState("");
  const [connectorTargetId, setConnectorTargetId] = React.useState("");
  const [connectorLabel, setConnectorLabel] = React.useState("");
  const [connectorLineStyle, setConnectorLineStyle] =
    React.useState<ConnectorLineStyle>("solid");
  const [connectorArrowMode, setConnectorArrowMode] =
    React.useState<ConnectorArrowMode>("forward");

  const connectableItemIds = React.useMemo(
    () => new Set(connectableItems.map((item) => item.id)),
    [connectableItems]
  );

  React.useEffect(() => {
    setNewElementKind(allowedKinds[0] ?? "component");
  }, [focusedNodeId, decompositionView, allowedKinds]);

  React.useEffect(() => {
    if (connectableItems.length < 2) {
      setConnectorSourceId("");
      setConnectorTargetId("");
      return;
    }

    setConnectorSourceId((current) => {
      if (current && connectableItemIds.has(current)) return current;
      return connectableItems[0]?.id ?? "";
    });

    setConnectorTargetId((current) => {
      if (current && connectableItemIds.has(current)) return current;

      const source = connectorSourceId || connectableItems[0]?.id;

      return connectableItems.find((item) => item.id !== source)?.id ?? "";
    });
  }, [connectableItems, connectableItemIds, connectorSourceId]);

  function handleAddElement() {
    const fallbackLabel = getNodeKindLabel(newElementKind);

    addNode({
      kind: newElementKind,
      name: newElementName.trim() || `New ${fallbackLabel}`,
      description:
        newElementDescription.trim() ||
        getNodeKindDescription(newElementKind),
      lifecycle: newElementStatus,
    });

    setNewElementName("");
    setNewElementDescription("");
    setNewElementStatus("planned");
  }

  function handleAddCanvasNote() {
    updateProject((current) =>
      createCanvasNoteForProject({
        project: current,
        focusedNodeId,
        title: newNoteTitle,
        content: newNoteBody,
        offsetIndex: canvasNotes.length,
      })
    );

    setNewNoteTitle("");
    setNewNoteBody("");
  }

  function handleAddConnector() {
    if (!connectorSourceId || !connectorTargetId) {
      window.alert("Select a source and target before adding an arrow.");
      return;
    }

    if (connectorSourceId === connectorTargetId) {
      window.alert("Source and target must be different items.");
      return;
    }

    updateProject((current) =>
      addConnectorToProject({
        project: current,
        source: connectorSourceId,
        target: connectorTargetId,
        label: connectorLabel,
        lineStyle: connectorLineStyle,
        arrowMode: connectorArrowMode,
      })
    );

    setConnectorLabel("");
  }

  return {
    allowedKinds,

    addMode,
    setAddMode,

    newElementKind,
    newElementName,
    newElementDescription,
    newElementStatus,
    setNewElementKind,
    setNewElementName,
    setNewElementDescription,
    setNewElementStatus,
    handleAddElement,

    newNoteTitle,
    newNoteBody,
    setNewNoteTitle,
    setNewNoteBody,
    handleAddCanvasNote,

    connectorSourceId,
    connectorTargetId,
    connectorLabel,
    connectorLineStyle,
    connectorArrowMode,
    setConnectorSourceId,
    setConnectorTargetId,
    setConnectorLabel,
    setConnectorLineStyle,
    setConnectorArrowMode,
    handleAddConnector,
  };
}
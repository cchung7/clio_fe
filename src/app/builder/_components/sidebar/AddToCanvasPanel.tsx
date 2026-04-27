import { Layers } from "lucide-react";

import type {
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
  Note,
} from "../../_lib/builderTypes";
import type { CanvasConnectableItem } from "../../_lib/canvasItems";
import { useAddToCanvasPanel } from "../../_hooks/useAddToCanvasPanel";
import { SegmentedControl } from "../shared/SegmentedControl";

import { AddConnectorForm } from "./AddConnectorForm";
import { AddElementForm } from "./AddElementForm";
import { AddNoteForm } from "./AddNoteForm";
import { SidebarSection } from "./SidebarSection";

type AddToCanvasPanelProps = {
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
};

export function AddToCanvasPanel({
  project,
  focusedNodeId,
  decompositionView,
  canvasNotes,
  connectableItems,
  updateProject,
  addNode,
}: AddToCanvasPanelProps) {
  const {
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
  } = useAddToCanvasPanel({
    project,
    focusedNodeId,
    decompositionView,
    canvasNotes,
    connectableItems,
    updateProject,
    addNode,
  });

  return (
    <SidebarSection
      icon={<Layers size={16} />}
      title="Add to Canvas"
      description="Add architecture elements, visual notes, or connector arrows to the current canvas view."
    >
      <SegmentedControl
        value={addMode}
        onChange={setAddMode}
        options={[
          { label: "Element", value: "element" },
          {
            label: "Note",
            value: "note",
            activeClassName:
              "bg-[var(--clio-gold-500)] text-[var(--clio-ink)]",
          },
          { label: "Arrow", value: "connector" },
        ]}
        columns={3}
      />

      <div className="mt-4">
        {addMode === "element" ? (
          <AddElementForm
            allowedKinds={allowedKinds}
            newElementKind={newElementKind}
            newElementName={newElementName}
            newElementDescription={newElementDescription}
            newElementStatus={newElementStatus}
            setNewElementKind={setNewElementKind}
            setNewElementName={setNewElementName}
            setNewElementDescription={setNewElementDescription}
            setNewElementStatus={setNewElementStatus}
            onAddElement={handleAddElement}
          />
        ) : null}

        {addMode === "note" ? (
          <AddNoteForm
            newNoteTitle={newNoteTitle}
            newNoteBody={newNoteBody}
            setNewNoteTitle={setNewNoteTitle}
            setNewNoteBody={setNewNoteBody}
            onAddNote={handleAddCanvasNote}
          />
        ) : null}

        {addMode === "connector" ? (
          <AddConnectorForm
            connectableItems={connectableItems}
            connectorSourceId={connectorSourceId}
            connectorTargetId={connectorTargetId}
            connectorLabel={connectorLabel}
            connectorLineStyle={connectorLineStyle}
            connectorArrowMode={connectorArrowMode}
            setConnectorSourceId={setConnectorSourceId}
            setConnectorTargetId={setConnectorTargetId}
            setConnectorLabel={setConnectorLabel}
            setConnectorLineStyle={setConnectorLineStyle}
            setConnectorArrowMode={setConnectorArrowMode}
            onAddConnector={handleAddConnector}
          />
        ) : null}
      </div>
    </SidebarSection>
  );
}
import { Plus } from "lucide-react";

import type {
  NodeKind,
  NodeLifecycle,
} from "../../_lib/builderTypes";
import {
  getNodeKindDescription,
  getNodeKindLabel,
} from "../../_lib/builderUtils";

type AddElementFormProps = {
  allowedKinds: NodeKind[];
  newElementKind: NodeKind;
  newElementName: string;
  newElementDescription: string;
  newElementStatus: NodeLifecycle;
  setNewElementKind: (kind: NodeKind) => void;
  setNewElementName: (value: string) => void;
  setNewElementDescription: (value: string) => void;
  setNewElementStatus: (status: NodeLifecycle) => void;
  onAddElement: () => void;
};

export function AddElementForm({
  allowedKinds,
  newElementKind,
  newElementName,
  newElementDescription,
  newElementStatus,
  setNewElementKind,
  setNewElementName,
  setNewElementDescription,
  setNewElementStatus,
  onAddElement,
}: AddElementFormProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[var(--clio-border)] bg-[rgba(255,253,248,0.72)] px-3 py-2 text-xs leading-5 text-[var(--clio-muted)]">
        Use elements for systems, layers, components, APIs, databases, and
        external systems.
      </div>

      <label className="block">
        <span className="clio-label mb-1 block">Element Type</span>
        <select
          value={newElementKind}
          onChange={(event) => setNewElementKind(event.target.value as NodeKind)}
          className="clio-input w-full rounded-lg px-3 py-2 text-sm"
        >
          {allowedKinds.map((kind) => (
            <option key={kind} value={kind}>
              {getNodeKindLabel(kind)}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="clio-label mb-1 block">Name</span>
        <input
          value={newElementName}
          onChange={(event) => setNewElementName(event.target.value)}
          placeholder={`New ${getNodeKindLabel(newElementKind)}`}
          className="clio-input w-full rounded-lg px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="clio-label mb-1 block">Description</span>
        <textarea
          value={newElementDescription}
          onChange={(event) => setNewElementDescription(event.target.value)}
          placeholder={getNodeKindDescription(newElementKind)}
          rows={4}
          className="clio-input w-full rounded-lg px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="clio-label mb-1 block">Status</span>
        <select
          value={newElementStatus}
          onChange={(event) =>
            setNewElementStatus(event.target.value as NodeLifecycle)
          }
          className="clio-input w-full rounded-lg px-3 py-2 text-sm"
        >
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="changing">Changing</option>
          <option value="deprecated">Deprecated</option>
          <option value="removed">Removed</option>
        </select>
      </label>

      <button
        type="button"
        onClick={onAddElement}
        className="clio-btn-primary flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
      >
        <Plus size={16} />
        Add Element
      </button>
    </div>
  );
}
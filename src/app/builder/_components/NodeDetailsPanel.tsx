import type {
  ArchitectureNode,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
  NoteType,
  RequirementPriority,
  RequirementType,
} from "../_lib/builderTypes";
import { getChildCount } from "../_lib/builderUtils";
import { TextAreaField } from "./TextAreaField";

type NodeDetailsPanelProps = {
  node: ArchitectureNode | null;
  project: DocumentationProject;
  decompositionView: "system" | "functional" | "object" | "domain";
  updateNode: (id: string, patch: Partial<ArchitectureNode>) => void;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  openNode: (id: string) => void;
  deleteNode: (id: string) => void;
  addRequirement: () => void;
  addNote: () => void;
};

export function NodeDetailsPanel({
  node,
  project,
  decompositionView,
  updateNode,
  updateProject,
  openNode,
  deleteNode,
  addRequirement,
  addNote,
}: NodeDetailsPanelProps) {
  if (!node) {
    return (
      <div className="space-y-3">
        <div className="text-sm font-semibold text-[var(--clio-purple-950)]">
          No element selected
        </div>
        <p className="text-sm leading-6 text-[var(--clio-muted)]">
          Select a card on the canvas to edit its details.
        </p>
      </div>
    );
  }

  const relatedRequirements = project.requirements.filter((requirement) =>
    requirement.relatedNodeIds.includes(node.id)
  );

  const relatedNotes = project.notes.filter(
    (note) => note.targetNodeId === node.id
  );

  const childCount = getChildCount({
    project,
    nodeId: node.id,
    decompositionView,
  });

  return (
    <div className="space-y-5">
      <section>
        <div className="clio-label mb-1">Selected Element</div>
        <input
          value={node.name}
          onChange={(event) => updateNode(node.id, { name: event.target.value })}
          className="clio-input w-full rounded-lg px-3 py-2 text-sm font-semibold"
        />

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="clio-badge clio-badge-purple">
            {childCount} child items
          </span>

          <button
            onClick={() => openNode(node.id)}
            className="clio-btn-primary rounded-lg px-3 py-2 text-sm font-medium"
          >
            Open / Decompose
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="clio-label mb-1 block">Type</span>
          <select
            value={node.kind}
            onChange={(event) =>
              updateNode(node.id, { kind: event.target.value as NodeKind })
            }
            className="clio-input w-full rounded-lg px-3 py-2 text-sm"
          >
            <option value="system">System</option>
            <option value="actor">Actor</option>
            <option value="layer">Layer</option>
            <option value="component">Component</option>
            <option value="api">API</option>
            <option value="database">Database</option>
            <option value="external">External</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="clio-label mb-1 block">Status</span>
          <select
            value={node.lifecycle}
            onChange={(event) =>
              updateNode(node.id, {
                lifecycle: event.target.value as NodeLifecycle,
              })
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
      </section>

      <TextAreaField
        label="Description"
        value={node.description}
        rows={5}
        onChange={(value) => updateNode(node.id, { description: value })}
      />

      <RequirementSection
        relatedRequirements={relatedRequirements}
        updateProject={updateProject}
        onAddRequirement={addRequirement}
      />

      <NotesSection
        relatedNotes={relatedNotes}
        updateProject={updateProject}
        onAddNote={addNote}
      />

      <section className="rounded-xl border border-red-200 bg-red-50/60 p-4">
        <div className="text-sm font-bold text-red-800">Danger Zone</div>
        <p className="mt-1 text-xs leading-5 text-red-700">
          Delete this element and all child elements nested inside it.
        </p>

        <button
          onClick={() => deleteNode(node.id)}
          className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
        >
          Delete Element
        </button>
      </section>
    </div>
  );
}

function RequirementSection({
  relatedRequirements,
  updateProject,
  onAddRequirement,
}: {
  relatedRequirements: DocumentationProject["requirements"];
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  onAddRequirement: () => void;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-[var(--clio-purple-950)]">
          Requirements
        </h3>

        <button
          onClick={onAddRequirement}
          className="clio-btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
        >
          Add Requirement
        </button>
      </div>

      <div className="space-y-3">
        {relatedRequirements.map((requirement) => (
          <div key={requirement.id} className="clio-card rounded-xl p-3">
            <input
              value={requirement.code}
              onChange={(event) =>
                updateProject((current) => ({
                  ...current,
                  requirements: current.requirements.map((item) =>
                    item.id === requirement.id
                      ? { ...item, code: event.target.value }
                      : item
                  ),
                }))
              }
              className="clio-input mb-2 w-full rounded-lg px-2 py-1 text-xs font-semibold"
            />

            <input
              value={requirement.title}
              onChange={(event) =>
                updateProject((current) => ({
                  ...current,
                  requirements: current.requirements.map((item) =>
                    item.id === requirement.id
                      ? { ...item, title: event.target.value }
                      : item
                  ),
                }))
              }
              className="clio-input mb-2 w-full rounded-lg px-2 py-1 text-sm font-medium"
            />

            <textarea
              value={requirement.statement}
              onChange={(event) =>
                updateProject((current) => ({
                  ...current,
                  requirements: current.requirements.map((item) =>
                    item.id === requirement.id
                      ? { ...item, statement: event.target.value }
                      : item
                  ),
                }))
              }
              rows={4}
              className="clio-input w-full rounded-lg px-2 py-1 text-sm"
            />

            <div className="mt-2 grid grid-cols-2 gap-2">
              <select
                value={requirement.type}
                onChange={(event) =>
                  updateProject((current) => ({
                    ...current,
                    requirements: current.requirements.map((item) =>
                      item.id === requirement.id
                        ? {
                            ...item,
                            type: event.target.value as RequirementType,
                          }
                        : item
                    ),
                  }))
                }
                className="clio-input rounded-lg px-2 py-1 text-xs"
              >
                <option value="functional">Functional</option>
                <option value="nonfunctional">Nonfunctional</option>
                <option value="constraint">Constraint</option>
                <option value="interface">Interface</option>
              </select>

              <select
                value={requirement.priority}
                onChange={(event) =>
                  updateProject((current) => ({
                    ...current,
                    requirements: current.requirements.map((item) =>
                      item.id === requirement.id
                        ? {
                            ...item,
                            priority:
                              event.target.value as RequirementPriority,
                          }
                        : item
                    ),
                  }))
                }
                className="clio-input rounded-lg px-2 py-1 text-xs"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        ))}

        {!relatedRequirements.length ? (
          <p className="text-sm text-[var(--clio-muted)]">
            No requirements are linked to this element yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function NotesSection({
  relatedNotes,
  updateProject,
  onAddNote,
}: {
  relatedNotes: DocumentationProject["notes"];
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  onAddNote: () => void;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-[var(--clio-purple-950)]">
          Notes
        </h3>

        <button
          onClick={onAddNote}
          className="clio-btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
        >
          Add Note
        </button>
      </div>

      <div className="space-y-3">
        {relatedNotes.map((note) => (
          <div key={note.id} className="clio-note-card rounded-xl p-3">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <input
                value={note.title || ""}
                onChange={(event) =>
                  updateProject((current) => ({
                    ...current,
                    notes: current.notes.map((item) =>
                      item.id === note.id
                        ? { ...item, title: event.target.value }
                        : item
                    ),
                  }))
                }
                className="clio-input rounded-lg px-2 py-1 text-sm font-medium"
              />

              <select
                value={note.type}
                onChange={(event) =>
                  updateProject((current) => ({
                    ...current,
                    notes: current.notes.map((item) =>
                      item.id === note.id
                        ? { ...item, type: event.target.value as NoteType }
                        : item
                    ),
                  }))
                }
                className="clio-input rounded-lg px-2 py-1 text-xs"
              >
                <option value="note">Note</option>
                <option value="decision">Decision</option>
                <option value="question">Question</option>
                <option value="todo">TODO</option>
              </select>
            </div>

            <textarea
              value={note.content}
              onChange={(event) =>
                updateProject((current) => ({
                  ...current,
                  notes: current.notes.map((item) =>
                    item.id === note.id
                      ? { ...item, content: event.target.value }
                      : item
                  ),
                }))
              }
              rows={4}
              className="clio-input mt-2 w-full rounded-lg px-2 py-1 text-sm"
            />

            <label className="mt-2 flex items-center gap-2 text-xs text-[var(--clio-muted)]">
              <input
                type="checkbox"
                checked={note.includeInExport}
                onChange={(event) =>
                  updateProject((current) => ({
                    ...current,
                    notes: current.notes.map((item) =>
                      item.id === note.id
                        ? {
                            ...item,
                            includeInExport: event.target.checked,
                          }
                        : item
                    ),
                  }))
                }
              />
              Include in export
            </label>
          </div>
        ))}

        {!relatedNotes.length ? (
          <p className="text-sm text-[var(--clio-muted)]">
            No notes are attached to this element yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}
import { Trash2 } from "lucide-react";

import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
  RequirementPriority,
  RequirementType,
} from "../_lib/builderTypes";
import { getChildCount, SYSTEM_OVERVIEW_ID } from "../_lib/builderUtils";
import { TextAreaField } from "./TextAreaField";

type NodeDetailsPanelProps = {
  node: ArchitectureNode | null;
  project: DocumentationProject;
  decompositionView: DecompositionView;
  updateNode: (id: string, patch: Partial<ArchitectureNode>) => void;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  addRequirement: () => void;
};

function formatElementCount(count: number) {
  return `${count} ${count === 1 ? "element" : "elements"}`;
}

export function NodeDetailsPanel({
  node,
  project,
  decompositionView,
  updateNode,
  updateProject,
  addRequirement,
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

  const isHighLevelSystemElement =
    node.kind === "system" && node.parentId === SYSTEM_OVERVIEW_ID;

  const relatedRequirements = project.requirements.filter((requirement) =>
    requirement.relatedNodeIds.includes(node.id)
  );

  const elementCount = getChildCount({
    project,
    nodeId: node.id,
    decompositionView,
  });

  return (
    <div className="space-y-5">
      <section>
        <div className="clio-label mb-1">Element Inspector</div>
        <input
          value={node.name}
          onChange={(event) => updateNode(node.id, { name: event.target.value })}
          className="clio-input w-full rounded-lg px-3 py-2 text-sm font-semibold"
        />

        <div className="mt-3 flex justify-center">
          <span className="clio-badge clio-badge-purple">
            {formatElementCount(elementCount)}
          </span>
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

      {isHighLevelSystemElement ? (
        <SystemSummarySection
          node={node}
          project={project}
          decompositionView={decompositionView}
        />
      ) : (
        <RequirementSection
          relatedRequirements={relatedRequirements}
          updateProject={updateProject}
          onAddRequirement={addRequirement}
        />
      )}
    </div>
  );
}

function SystemSummarySection({
  node,
  project,
  decompositionView,
}: {
  node: ArchitectureNode;
  project: DocumentationProject;
  decompositionView: DecompositionView;
}) {
  const childNodes = project.nodes.filter(
    (item) => item.parentId === node.id && item.viewType === decompositionView
  );

  const actorCount = childNodes.filter((item) => item.kind === "actor").length;
  const layerCount = childNodes.filter((item) => item.kind === "layer").length;
  const databaseCount = childNodes.filter(
    (item) => item.kind === "database"
  ).length;
  const externalCount = childNodes.filter(
    (item) => item.kind === "external"
  ).length;

  return (
    <section className="clio-panel-soft rounded-xl p-4">
      <h3 className="text-sm font-bold text-[var(--clio-purple-950)]">
        System Summary
      </h3>

      <p className="mt-1 text-xs leading-5 text-[var(--clio-muted)]">
        This high-level system element represents the main software boundary.
        Use this section for scope, structure, and major parts. Detailed
        requirements are better attached to layers, components, APIs, and data
        stores.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <SystemSummaryTile label="Actors" value={actorCount} />
        <SystemSummaryTile label="Layers" value={layerCount} />
        <SystemSummaryTile label="Databases" value={databaseCount} />
        <SystemSummaryTile label="External" value={externalCount} />
      </div>

      <div className="mt-3">
        <div className="clio-label mb-2">Major Elements</div>

        {childNodes.length ? (
          <div className="space-y-1">
            {childNodes.map((childNode) => (
              <div
                key={childNode.id}
                className="rounded-lg border border-[var(--clio-purple-border)] bg-[var(--clio-white)] px-3 py-2 text-xs"
              >
                <div className="font-semibold text-[var(--clio-purple-950)]">
                  {childNode.name}
                </div>
                <div className="text-[var(--clio-muted)]">
                  {childNode.kind} · {childNode.lifecycle}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--clio-muted)]">
            No major elements have been added under this system yet.
          </p>
        )}
      </div>
    </section>
  );
}

function SystemSummaryTile({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-[var(--clio-purple-border)] bg-[var(--clio-white)] px-3 py-2">
      <div className="text-lg font-bold text-[var(--clio-purple-950)]">
        {value}
      </div>
      <div className="text-[var(--clio-muted)]">{label}</div>
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
  function deleteRequirement(requirementId: string) {
    const confirmed = window.confirm("Delete this requirement?");

    if (!confirmed) return;

    updateProject((current) => ({
      ...current,
      requirements: current.requirements.filter(
        (requirement) => requirement.id !== requirementId
      ),
    }));
  }

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
            <div className="mb-2 grid grid-cols-[1fr_auto] gap-2">
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
                className="clio-input w-full rounded-lg px-2 py-1 text-xs font-semibold"
              />

              <button
                type="button"
                onClick={() => deleteRequirement(requirement.id)}
                className="rounded-lg p-2 text-red-700 transition hover:bg-red-50"
                aria-label={`Delete ${requirement.code}`}
                title={`Delete ${requirement.code}`}
              >
                <Trash2 size={15} />
              </button>
            </div>

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
import type {
  DocumentationProject,
  RequirementPriority,
  RequirementType,
} from "../../_lib/builderTypes";
import { ConfirmDeleteButton } from "../shared/ConfirmDeleteButton";

type RequirementSectionProps = {
  relatedRequirements: DocumentationProject["requirements"];
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  onAddRequirement: () => void;
};

export function RequirementSection({
  relatedRequirements,
  updateProject,
  onAddRequirement,
}: RequirementSectionProps) {
  function deleteRequirement(requirementId: string) {
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
          type="button"
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

              <ConfirmDeleteButton
                message={`Delete ${requirement.code}?`}
                ariaLabel={`Delete ${requirement.code}`}
                title={`Delete ${requirement.code}`}
                onConfirm={() => deleteRequirement(requirement.id)}
              />
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
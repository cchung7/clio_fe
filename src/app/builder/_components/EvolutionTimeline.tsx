import type { DocumentationProject } from "../_lib/builderTypes";

type EvolutionTimelineProps = {
  project: DocumentationProject;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
};

export function EvolutionTimeline({
  project,
  updateProject,
}: EvolutionTimelineProps) {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="clio-panel rounded-2xl p-5">
          <h2 className="text-lg font-bold text-[var(--clio-purple-950)]">
            Evolution Timeline
          </h2>
          <p className="text-sm text-[var(--clio-muted)]">
            Track how the architecture changes over time.
          </p>
        </div>

        {project.changes.map((change) => (
          <div key={change.id} className="clio-panel rounded-2xl p-5">
            <input
              value={change.title}
              onChange={(event) =>
                updateProject((current) => ({
                  ...current,
                  changes: current.changes.map((item) =>
                    item.id === change.id
                      ? { ...item, title: event.target.value }
                      : item
                  ),
                }))
              }
              className="w-full border-none bg-transparent text-base font-bold text-[var(--clio-ink)] outline-none"
            />

            <div className="mt-1 text-xs text-[var(--clio-muted)]">
              {new Date(change.createdAt).toLocaleString()}
            </div>

            <TimelineTextArea
              label="What changed?"
              value={change.summary}
              onChange={(value) =>
                updateProject((current) => ({
                  ...current,
                  changes: current.changes.map((item) =>
                    item.id === change.id ? { ...item, summary: value } : item
                  ),
                }))
              }
            />

            <TimelineTextArea
              label="Why?"
              value={change.reason || ""}
              onChange={(value) =>
                updateProject((current) => ({
                  ...current,
                  changes: current.changes.map((item) =>
                    item.id === change.id ? { ...item, reason: value } : item
                  ),
                }))
              }
            />

            <TimelineTextArea
              label="Impact"
              value={change.impact || ""}
              onChange={(value) =>
                updateProject((current) => ({
                  ...current,
                  changes: current.changes.map((item) =>
                    item.id === change.id ? { ...item, impact: value } : item
                  ),
                }))
              }
            />
          </div>
        ))}

        {project.snapshots.length ? (
          <div className="clio-panel rounded-2xl p-5">
            <h3 className="font-bold text-[var(--clio-purple-950)]">
              Snapshots
            </h3>

            <div className="mt-3 space-y-3">
              {project.snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="rounded-xl border border-[var(--clio-border)] bg-[var(--clio-white)] p-3"
                >
                  <div className="font-bold text-[var(--clio-ink)]">
                    {snapshot.version}: {snapshot.title}
                  </div>

                  <div className="text-xs text-[var(--clio-muted)]">
                    {new Date(snapshot.createdAt).toLocaleString()}
                  </div>

                  <p className="mt-2 text-sm text-[var(--clio-muted)]">
                    {snapshot.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {!project.changes.length && !project.snapshots.length ? (
          <div className="clio-panel rounded-2xl p-5 text-sm text-[var(--clio-muted)]">
            No evolution history has been recorded yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TimelineTextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-4 block">
      <span className="clio-label block">{label}</span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="clio-input mt-1 w-full rounded-lg px-3 py-2 text-sm"
      />
    </label>
  );
}
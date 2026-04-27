import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
} from "../../_lib/builderTypes";
import { SystemSummaryTile } from "./SystemSummaryTile";

type SystemSummarySectionProps = {
  node: ArchitectureNode;
  project: DocumentationProject;
  decompositionView: DecompositionView;
};

export function SystemSummarySection({
  node,
  project,
  decompositionView,
}: SystemSummarySectionProps) {
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
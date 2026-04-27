import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
} from "../../_lib/builderTypes";
import { getChildCount } from "../../_lib/builderUtils";
import { TextAreaField } from "../TextAreaField";

type ElementInspectorFieldsProps = {
  node: ArchitectureNode;
  project: DocumentationProject;
  decompositionView: DecompositionView;
  updateNode: (id: string, patch: Partial<ArchitectureNode>) => void;
};

function formatElementCount(count: number) {
  return `${count} ${count === 1 ? "element" : "elements"}`;
}

export function ElementInspectorFields({
  node,
  project,
  decompositionView,
  updateNode,
}: ElementInspectorFieldsProps) {
  const elementCount = getChildCount({
    project,
    nodeId: node.id,
    decompositionView,
  });

  return (
    <>
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
    </>
  );
}
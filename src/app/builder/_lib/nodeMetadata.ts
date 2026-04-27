import type { NodeKind } from "./builderTypes";

export function getNodeKindLabel(kind: NodeKind) {
  const labels: Record<NodeKind, string> = {
    system: "System",
    actor: "Actor",
    layer: "Layer",
    component: "Component",
    api: "API",
    database: "Database",
    external: "External System",
  };

  return labels[kind];
}

export function getNodeKindDescription(kind: NodeKind) {
  const descriptions: Record<NodeKind, string> = {
    system: "A software system, product, application, or major platform.",
    actor: "A user, role, stakeholder, or external person/system.",
    layer: "A high-level architecture layer or implementation boundary.",
    component: "A module, feature, service, page, or internal subsystem.",
    api: "An endpoint group, service interface, or communication boundary.",
    database: "A schema, model, collection, table, or persistence boundary.",
    external: "A third-party service or system outside the main boundary.",
  };

  return descriptions[kind];
}
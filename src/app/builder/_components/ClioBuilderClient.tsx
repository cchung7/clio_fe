"use client";

import * as React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { FileText, PanelLeft, PanelRight, X } from "lucide-react";

import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
  WorkspacePanel,
} from "../_lib/builderTypes";
import { starterProject } from "../_lib/starterTemplates";
import { generateMarkdown } from "../_lib/documentGenerator";
import {
  createArchitectureNode,
  createId,
  CURRENT_SCHEMA_VERSION,
  STORAGE_KEY,
  SYSTEM_OVERVIEW_ID,
} from "../_lib/builderUtils";

import { BuilderTopBar } from "./BuilderTopBar";
import { BuilderSidebar } from "./BuilderSidebar";
import { ArchitectureCanvas } from "./ArchitectureCanvas";
import { NodeDetailsPanel } from "./NodeDetailsPanel";
import { DocumentPreview } from "./DocumentPreview";
import { EvolutionTimeline } from "./EvolutionTimeline";

function collectDescendantNodeIds(
  nodes: ArchitectureNode[],
  nodeId: string
): Set<string> {
  const ids = new Set<string>([nodeId]);
  let changed = true;

  while (changed) {
    changed = false;

    for (const node of nodes) {
      if (ids.has(node.parentId) && !ids.has(node.id)) {
        ids.add(node.id);
        changed = true;
      }
    }
  }

  return ids;
}

export function ClioBuilderClient() {
  const [project, setProject] =
    React.useState<DocumentationProject>(starterProject);

  const [selectedNodeId, setSelectedNodeId] =
    React.useState<string>(SYSTEM_OVERVIEW_ID);

  const [focusedNodeId, setFocusedNodeId] =
    React.useState<string>(SYSTEM_OVERVIEW_ID);

  const [decompositionView, setDecompositionView] =
    React.useState<DecompositionView>("system");

  const [workspacePanel, setWorkspacePanel] =
    React.useState<WorkspacePanel>("canvas");

  const [hasLoadedStoredProject, setHasLoadedStoredProject] =
    React.useState(false);

  const [leftDrawerOpen, setLeftDrawerOpen] = React.useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      setHasLoadedStoredProject(true);
      return;
    }

    try {
      const parsedProject = JSON.parse(stored) as DocumentationProject;

      if (parsedProject.schemaVersion !== CURRENT_SCHEMA_VERSION) {
        window.localStorage.removeItem(STORAGE_KEY);
        setProject(starterProject);
        setSelectedNodeId(SYSTEM_OVERVIEW_ID);
        setFocusedNodeId(SYSTEM_OVERVIEW_ID);
        return;
      }

      setProject(parsedProject);
      setSelectedNodeId(SYSTEM_OVERVIEW_ID);
      setFocusedNodeId(SYSTEM_OVERVIEW_ID);
    } catch {
      setProject(starterProject);
      setSelectedNodeId(SYSTEM_OVERVIEW_ID);
      setFocusedNodeId(SYSTEM_OVERVIEW_ID);
    } finally {
      setHasLoadedStoredProject(true);
    }
  }, []);

  React.useEffect(() => {
    if (!hasLoadedStoredProject) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project, hasLoadedStoredProject]);

  const selectedNode =
    project.nodes.find((node) => node.id === selectedNodeId) ?? null;

  const markdown = React.useMemo(() => generateMarkdown(project), [project]);

  function updateProject(
    updater: (current: DocumentationProject) => DocumentationProject
  ) {
    setProject((current) => ({
      ...updater(current),
      updatedAt: new Date().toISOString(),
    }));
  }

  function updateNode(id: string, patch: Partial<ArchitectureNode>) {
    updateProject((current) => ({
      ...current,
      nodes: current.nodes.map((node) =>
        node.id === id ? { ...node, ...patch } : node
      ),
    }));
  }

  function openNode(id: string) {
    setFocusedNodeId(id);
    setSelectedNodeId(id);
    setWorkspacePanel("canvas");
    setRightDrawerOpen(false);
  }

  function addNode({
    kind,
    name,
    description,
    lifecycle,
  }: {
    kind: NodeKind;
    name: string;
    description: string;
    lifecycle: NodeLifecycle;
  }) {
    const newNode = createArchitectureNode({
      kind,
      project,
      parentId: focusedNodeId,
      viewType: decompositionView,
      name,
      description,
      lifecycle,
    });

    updateProject((current) => ({
      ...current,
      nodes: [...current.nodes, newNode],
    }));

    setSelectedNodeId(newNode.id);
    setWorkspacePanel("canvas");
    setRightDrawerOpen(true);
  }

  function deleteNode(nodeId: string) {
    const nodeToDelete = project.nodes.find((node) => node.id === nodeId);

    if (!nodeToDelete) return;

    const confirmed = window.confirm(
      `Delete "${nodeToDelete.name}" and all of its child elements?`
    );

    if (!confirmed) return;

    const idsToDelete = collectDescendantNodeIds(project.nodes, nodeId);
    const nextFocusedNodeId = idsToDelete.has(focusedNodeId)
      ? nodeToDelete.parentId || SYSTEM_OVERVIEW_ID
      : focusedNodeId;

    updateProject((current) => {
      const deletedIds = collectDescendantNodeIds(current.nodes, nodeId);

      return {
        ...current,
        nodes: current.nodes.filter((node) => !deletedIds.has(node.id)),
        edges: current.edges.filter(
          (edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target)
        ),
        requirements: current.requirements
          .map((requirement) => ({
            ...requirement,
            relatedNodeIds: requirement.relatedNodeIds.filter(
              (id) => !deletedIds.has(id)
            ),
          }))
          .filter((requirement) => requirement.relatedNodeIds.length > 0),
        notes: current.notes.filter(
          (note) => !note.targetNodeId || !deletedIds.has(note.targetNodeId)
        ),
        changes: current.changes.map((change) => ({
          ...change,
          relatedNodeIds: change.relatedNodeIds.filter(
            (id) => !deletedIds.has(id)
          ),
        })),
      };
    });

    setFocusedNodeId(nextFocusedNodeId);
    setSelectedNodeId(nextFocusedNodeId);
    setWorkspacePanel("canvas");
  }

  function addRequirement() {
    if (!selectedNode) return;

    const nextNumber = project.requirements.length + 1;
    const id = createId("req");

    updateProject((current) => ({
      ...current,
      requirements: [
        ...current.requirements,
        {
          id,
          code: `REQ-${String(nextNumber).padStart(3, "0")}`,
          title: "New Requirement",
          statement: "The system shall ...",
          type: "functional",
          priority: "medium",
          relatedNodeIds: [selectedNode.id],
        },
      ],
    }));

    setRightDrawerOpen(true);
  }

  function addNote() {
    if (!selectedNode) return;

    const id = createId("note");

    updateProject((current) => ({
      ...current,
      notes: [
        ...current.notes,
        {
          id,
          title: "New Note",
          content: "Write a short note, decision, question, or TODO.",
          type: "note",
          targetNodeId: selectedNode.id,
          includeInExport: true,
        },
      ],
    }));

    setRightDrawerOpen(true);
  }

  function saveSnapshot() {
    const version = window.prompt(
      "Snapshot version/name?",
      project.currentVersion
    );

    if (!version) return;

    const title = window.prompt("Snapshot title?", "Architecture snapshot");

    updateProject((current) => ({
      ...current,
      currentVersion: version,
      snapshots: [
        ...current.snapshots,
        {
          id: createId("snapshot"),
          version,
          title: title || "Architecture snapshot",
          summary:
            "Saved a snapshot of the current architecture, requirements, and notes.",
          createdAt: new Date().toISOString(),
          state: {
            nodes: current.nodes,
            edges: current.edges,
            requirements: current.requirements,
            notes: current.notes,
          },
        },
      ],
    }));
  }

  function resetProject() {
    const confirmed = window.confirm(
      "Reset Clio to the starter template? This will replace the current local project."
    );

    if (!confirmed) return;

    setProject(starterProject);
    setSelectedNodeId(SYSTEM_OVERVIEW_ID);
    setFocusedNodeId(SYSTEM_OVERVIEW_ID);
    setDecompositionView("system");
    setWorkspacePanel("canvas");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function downloadMarkdown() {
    const blob = new Blob([markdown], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}.md`;
    anchor.click();

    URL.revokeObjectURL(url);
  }

  function exportProjectJson() {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    anchor.click();

    URL.revokeObjectURL(url);
  }

  function importProjectJson(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const importedProject = JSON.parse(
          String(reader.result)
        ) as DocumentationProject;

        if (importedProject.schemaVersion !== CURRENT_SCHEMA_VERSION) {
          window.alert("This Clio project file uses an older schema version.");
          return;
        }

        setProject({
          ...importedProject,
          updatedAt: new Date().toISOString(),
        });

        setSelectedNodeId(SYSTEM_OVERVIEW_ID);
        setFocusedNodeId(SYSTEM_OVERVIEW_ID);
        setDecompositionView("system");
        setWorkspacePanel("canvas");
      } catch {
        window.alert(
          "Could not import project. Please select a valid Clio JSON file."
        );
      }
    };

    reader.readAsText(file);
  }

  const sidebar = (
    <BuilderSidebar
      project={project}
      focusedNodeId={focusedNodeId}
      selectedNodeId={selectedNodeId}
      decompositionView={decompositionView}
      setSelectedNodeId={setSelectedNodeId}
      setFocusedNodeId={setFocusedNodeId}
      updateProject={updateProject}
      addNode={addNode}
      deleteNode={deleteNode}
      resetProject={resetProject}
    />
  );

  const details = (
    <NodeDetailsPanel
      node={selectedNode}
      project={project}
      decompositionView={decompositionView}
      updateNode={updateNode}
      updateProject={updateProject}
      openNode={openNode}
      deleteNode={deleteNode}
      addRequirement={addRequirement}
      addNote={addNote}
    />
  );

  const workspace = (
    <section className="min-h-0 border-[var(--clio-border)] bg-[#fbf6ec] xl:border-x">
      {workspacePanel === "canvas" ? (
        <ReactFlowProvider>
          <ArchitectureCanvas
            project={project}
            focusedNodeId={focusedNodeId}
            selectedNodeId={selectedNodeId}
            decompositionView={decompositionView}
            updateProject={updateProject}
            setSelectedNodeId={setSelectedNodeId}
            setFocusedNodeId={setFocusedNodeId}
          />
        </ReactFlowProvider>
      ) : null}

      {workspacePanel === "document" ? (
        <DocumentPreview markdown={markdown} />
      ) : null}

      {workspacePanel === "evolution" ? (
        <EvolutionTimeline project={project} updateProject={updateProject} />
      ) : null}
    </section>
  );

  return (
    <main className="clio-app-shell flex min-h-screen flex-col xl:h-screen xl:overflow-hidden">
      <BuilderTopBar
        project={project}
        decompositionView={decompositionView}
        setDecompositionView={(view) => {
          setDecompositionView(view);
          setFocusedNodeId(SYSTEM_OVERVIEW_ID);
          setSelectedNodeId(SYSTEM_OVERVIEW_ID);
          setWorkspacePanel("canvas");
        }}
        setWorkspacePanel={setWorkspacePanel}
        onSaveSnapshot={saveSnapshot}
        onDownloadMarkdown={downloadMarkdown}
        onExportProjectJson={exportProjectJson}
        onImportProjectJson={importProjectJson}
      />

      <div className="relative flex-1 xl:min-h-0">
        <div className="hidden h-full xl:grid xl:grid-cols-[330px_minmax(560px,1fr)_420px]">
          {sidebar}

          {workspace}

          <aside className="clio-sidebar min-h-0 overflow-auto p-5">
            {details}
          </aside>
        </div>

        <div className="block xl:hidden">
          <ResponsiveDrawerDock
            onOpenProject={() => setLeftDrawerOpen(true)}
            onOpenDetails={() => setRightDrawerOpen(true)}
            selectedNodeName={selectedNode?.name ?? "No element selected"}
          />

          <div className="min-h-[calc(100vh-13rem)] border-y border-[var(--clio-border)]">
            {workspace}
          </div>

          <FloatingDrawerButtons
            onOpenProject={() => setLeftDrawerOpen(true)}
            onOpenDetails={() => setRightDrawerOpen(true)}
          />

          <Drawer
            open={leftDrawerOpen}
            title="Project / Add"
            onClose={() => setLeftDrawerOpen(false)}
          >
            {sidebar}
          </Drawer>

          <Drawer
            open={rightDrawerOpen}
            title="Selected Element"
            onClose={() => setRightDrawerOpen(false)}
            side="right"
          >
            <div className="p-5">{details}</div>
          </Drawer>
        </div>
      </div>
    </main>
  );
}

function ResponsiveDrawerDock({
  onOpenProject,
  onOpenDetails,
  selectedNodeName,
}: {
  onOpenProject: () => void;
  onOpenDetails: () => void;
  selectedNodeName: string;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--clio-purple-border)] bg-[rgba(255,253,248,0.96)] px-4 py-3 shadow-sm backdrop-blur xl:hidden">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--clio-purple-700)]">
            Mobile Workspace
          </div>
          <div className="truncate text-sm text-[var(--clio-muted)]">
            Selected:{" "}
            <span className="font-semibold text-[var(--clio-purple-950)]">
              {selectedNodeName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <button
            onClick={onOpenProject}
            className="clio-btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
          >
            <PanelLeft size={18} />
            Project / Add
          </button>

          <button
            onClick={onOpenDetails}
            className="clio-btn-gold inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
          >
            <PanelRight size={18} />
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

function FloatingDrawerButtons({
  onOpenProject,
  onOpenDetails,
}: {
  onOpenProject: () => void;
  onOpenDetails: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-between px-4 xl:hidden">
      <button
        onClick={onOpenProject}
        className="clio-btn-primary pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg"
      >
        <PanelLeft size={18} />
        Project / Add
      </button>

      <button
        onClick={onOpenDetails}
        className="clio-btn-gold pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg"
      >
        <PanelRight size={18} />
        Details
      </button>
    </div>
  );
}

function Drawer({
  open,
  title,
  side = "left",
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  side?: "left" | "right";
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <button
        aria-label="Close drawer overlay"
        className="absolute inset-0 bg-[rgba(21,19,29,0.42)]"
        onClick={onClose}
      />

      <aside
        className={`absolute top-0 h-full w-[min(94vw,430px)] overflow-auto bg-[var(--clio-white)] shadow-2xl ${
          side === "left" ? "left-0" : "right-0"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--clio-border)] bg-[var(--clio-white)] px-4 py-3">
          <div className="flex items-center gap-2 font-bold text-[var(--clio-purple-950)]">
            <FileText size={18} />
            {title}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-[var(--clio-purple-50)]"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </aside>
    </div>
  );
}
"use client";

import * as React from "react";
import { ReactFlowProvider } from "@xyflow/react";

import { useClioProject } from "../_hooks/useClioProject";

import { BuilderTopBar } from "./BuilderTopBar";
import { BuilderSidebar } from "./BuilderSidebar";
import { ArchitectureCanvas } from "./ArchitectureCanvas";
import { NodeDetailsPanel } from "./NodeDetailsPanel";
import { DocumentPreview } from "./DocumentPreview";
import { EvolutionTimeline } from "./EvolutionTimeline";
import { ResponsiveDrawerDock } from "./ResponsiveDrawerDock";
import { Drawer } from "./Drawer";
import { ProjectSettingsDialog } from "./ProjectSettingsDialog";

export function ClioBuilderClient() {
  const {
    project,
    selectedNode,
    selectedNodeId,
    focusedNodeId,
    decompositionView,
    workspacePanel,
    markdown,
    setSelectedNodeId,
    setFocusedNodeId,
    setWorkspacePanel,
    updateProject,
    updateNode,
    addNode,
    deleteNode,
    addRequirement,
    saveSnapshot,
    resetProject,
    downloadMarkdown,
    exportProjectJson,
    importProjectJson,
    resetToSystemCanvas,
  } = useClioProject();

  const [selectedConnectorId, setSelectedConnectorId] = React.useState<
    string | null
  >(null);

  const [leftDrawerOpen, setLeftDrawerOpen] = React.useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);
  const [projectSettingsOpen, setProjectSettingsOpen] = React.useState(false);

  function selectNode(id: string) {
    setSelectedConnectorId(null);
    setSelectedNodeId(id);
  }

  function focusNode(id: string) {
    setSelectedConnectorId(null);
    setFocusedNodeId(id);
  }

  function selectConnector(id: string) {
    setSelectedConnectorId(id);
    setSelectedNodeId("");
    setRightDrawerOpen(true);
  }

  function handleResetToSystemCanvas(view = decompositionView) {
    setSelectedConnectorId(null);
    resetToSystemCanvas(view);
  }

  function handleDeleteNode(id: string) {
    setSelectedConnectorId(null);
    deleteNode(id);
  }

  function handleResetProject() {
    setSelectedConnectorId(null);
    resetProject();
  }

  const sidebar = (
    <BuilderSidebar
      project={project}
      focusedNodeId={focusedNodeId}
      selectedNodeId={selectedNodeId}
      decompositionView={decompositionView}
      setSelectedNodeId={selectNode}
      setFocusedNodeId={focusNode}
      updateProject={updateProject}
      addNode={(params) => {
        setSelectedConnectorId(null);
        addNode(params);
        setRightDrawerOpen(true);
      }}
      deleteNode={handleDeleteNode}
      resetProject={handleResetProject}
    />
  );

  const details = (
    <NodeDetailsPanel
      node={selectedNode}
      project={project}
      focusedNodeId={focusedNodeId}
      selectedConnectorId={selectedConnectorId}
      setSelectedConnectorId={setSelectedConnectorId}
      decompositionView={decompositionView}
      updateNode={updateNode}
      updateProject={updateProject}
      addRequirement={() => {
        addRequirement();
        setRightDrawerOpen(true);
      }}
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
            selectedConnectorId={selectedConnectorId}
            decompositionView={decompositionView}
            updateProject={updateProject}
            setSelectedNodeId={selectNode}
            setFocusedNodeId={focusNode}
            onSelectConnector={selectConnector}
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
        setDecompositionView={handleResetToSystemCanvas}
        setWorkspacePanel={setWorkspacePanel}
        onOpenProjectSettings={() => setProjectSettingsOpen(true)}
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
          />

          <div className="min-h-[calc(100vh-9.5rem)] border-y border-[var(--clio-border)]">
            {workspace}
          </div>

          <Drawer
            open={leftDrawerOpen}
            title="Project"
            onClose={() => setLeftDrawerOpen(false)}
          >
            {sidebar}
          </Drawer>

          <Drawer
            open={rightDrawerOpen}
            title="Inspector"
            onClose={() => setRightDrawerOpen(false)}
            side="right"
          >
            <div className="p-5">{details}</div>
          </Drawer>
        </div>
      </div>

      <ProjectSettingsDialog
        open={projectSettingsOpen}
        project={project}
        updateProject={updateProject}
        onClose={() => setProjectSettingsOpen(false)}
      />
    </main>
  );
}
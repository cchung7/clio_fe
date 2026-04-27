import * as React from "react";

import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
  WorkspacePanel,
} from "../_lib/builderTypes";
import { generateMarkdown } from "../_lib/documentGenerator";
import { starterProject } from "../_lib/starterTemplates";
import {
  CURRENT_SCHEMA_VERSION,
  STORAGE_KEY,
  SYSTEM_OVERVIEW_ID,
} from "../_lib/builderUtils";
import {
  createNodeForProject,
  createNoteForNode,
  createRequirementForNode,
  createSnapshotForProject,
  deleteNodeFromProject,
  getNextFocusedNodeIdAfterDelete,
  updateNodeInProject,
} from "../_lib/projectActions";
import { selectNodeById } from "../_lib/projectSelectors";
import { useProjectImportExport } from "./useProjectImportExport";
import { useProjectStorage } from "./useProjectStorage";

export function useClioProject() {
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

  const resetSelectionToSystem = React.useCallback(() => {
    setSelectedNodeId(SYSTEM_OVERVIEW_ID);
    setFocusedNodeId(SYSTEM_OVERVIEW_ID);
  }, []);

  useProjectStorage({
    project,
    setProject,
    storageKey: STORAGE_KEY,
    currentSchemaVersion: CURRENT_SCHEMA_VERSION,
    starterProject,
    onProjectHydrated: resetSelectionToSystem,
    onProjectReset: resetSelectionToSystem,
  });

  const selectedNode = React.useMemo(
    () => selectNodeById(project, selectedNodeId),
    [project, selectedNodeId]
  );

  const markdown = React.useMemo(() => generateMarkdown(project), [project]);

  const updateProject = React.useCallback(
    (updater: (current: DocumentationProject) => DocumentationProject) => {
      setProject((current) => ({
        ...updater(current),
        updatedAt: new Date().toISOString(),
      }));
    },
    []
  );

  const updateNode = React.useCallback(
    (id: string, patch: Partial<ArchitectureNode>) => {
      updateProject((current) => updateNodeInProject(current, id, patch));
    },
    [updateProject]
  );

  const openNode = React.useCallback((id: string) => {
    setFocusedNodeId(id);
    setSelectedNodeId(id);
    setWorkspacePanel("canvas");
  }, []);

  const addNode = React.useCallback(
    ({
      kind,
      name,
      description,
      lifecycle,
    }: {
      kind: NodeKind;
      name: string;
      description: string;
      lifecycle: NodeLifecycle;
    }) => {
      const result = createNodeForProject(project, {
        kind,
        parentId: focusedNodeId,
        viewType: decompositionView,
        name,
        description,
        lifecycle,
      });

      updateProject(() => result.project);
      setSelectedNodeId(result.node.id);
      setWorkspacePanel("canvas");

      return result.node;
    },
    [decompositionView, focusedNodeId, project, updateProject]
  );

  const deleteNode = React.useCallback(
    (nodeId: string) => {
      const nodeToDelete = project.nodes.find((node) => node.id === nodeId);

      if (!nodeToDelete) return;

      const confirmed = window.confirm(
        `Delete "${nodeToDelete.name}" and all of its child elements?`
      );

      if (!confirmed) return;

      const nextFocusedNodeId = getNextFocusedNodeIdAfterDelete({
        project,
        nodeId,
        focusedNodeId,
      });

      updateProject((current) => deleteNodeFromProject(current, nodeId));
      setFocusedNodeId(nextFocusedNodeId);
      setSelectedNodeId(nextFocusedNodeId);
      setWorkspacePanel("canvas");
    },
    [focusedNodeId, project, updateProject]
  );

  const addRequirement = React.useCallback(() => {
    if (!selectedNode) return;

    updateProject((current) =>
      createRequirementForNode(current, selectedNode.id)
    );
  }, [selectedNode, updateProject]);

  const addNote = React.useCallback(() => {
    if (!selectedNode) return;

    updateProject((current) => createNoteForNode(current, selectedNode.id));
  }, [selectedNode, updateProject]);

  const saveSnapshot = React.useCallback(() => {
    const version = window.prompt(
      "Snapshot version/name?",
      project.currentVersion
    );

    if (!version) return;

    const title = window.prompt("Snapshot title?", "Architecture snapshot");

    updateProject((current) =>
      createSnapshotForProject({ project: current, version, title })
    );
  }, [project.currentVersion, updateProject]);

  const resetProject = React.useCallback(() => {
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
  }, []);

  const onImportProject = React.useCallback((importedProject: DocumentationProject) => {
    setProject(importedProject);
    setSelectedNodeId(SYSTEM_OVERVIEW_ID);
    setFocusedNodeId(SYSTEM_OVERVIEW_ID);
    setDecompositionView("system");
    setWorkspacePanel("canvas");
  }, []);

  const { downloadMarkdown, exportProjectJson, importProjectJson } =
    useProjectImportExport({
      project,
      markdown,
      currentSchemaVersion: CURRENT_SCHEMA_VERSION,
      onImportProject,
    });

  const resetToSystemCanvas = React.useCallback(
    (view: DecompositionView = decompositionView) => {
      setDecompositionView(view);
      setFocusedNodeId(SYSTEM_OVERVIEW_ID);
      setSelectedNodeId(SYSTEM_OVERVIEW_ID);
      setWorkspacePanel("canvas");
    },
    [decompositionView]
  );

  return {
    project,
    selectedNode,
    selectedNodeId,
    focusedNodeId,
    decompositionView,
    workspacePanel,
    markdown,
    setSelectedNodeId,
    setFocusedNodeId,
    setDecompositionView,
    setWorkspacePanel,
    updateProject,
    updateNode,
    openNode,
    addNode,
    deleteNode,
    addRequirement,
    addNote,
    saveSnapshot,
    resetProject,
    downloadMarkdown,
    exportProjectJson,
    importProjectJson,
    resetToSystemCanvas,
  };
}

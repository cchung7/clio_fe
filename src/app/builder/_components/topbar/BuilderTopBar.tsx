import * as React from "react";

import type {
  DecompositionView,
  DocumentationProject,
  WorkspacePanel,
} from "../../_lib/builderTypes";

import { MainMenuDropdown } from "./MainMenuDropdown";
import { ProjectStatusLine } from "./ProjectStatusLine";
import { ViewSelectorMenu } from "./ViewSelectorMenu";

type BuilderTopBarProps = {
  project: DocumentationProject;
  decompositionView: DecompositionView;
  setDecompositionView: (view: DecompositionView) => void;
  setWorkspacePanel: (panel: WorkspacePanel) => void;
  onOpenProjectSettings: () => void;
  onSaveSnapshot: () => void;
  onDownloadMarkdown: () => void;
  onExportProjectJson: () => void;
  onImportProjectJson: (file: File) => void;
};

export function BuilderTopBar({
  project,
  decompositionView,
  setDecompositionView,
  setWorkspacePanel,
  onOpenProjectSettings,
  onSaveSnapshot,
  onDownloadMarkdown,
  onExportProjectJson,
  onImportProjectJson,
}: BuilderTopBarProps) {
  const [viewMenuOpen, setViewMenuOpen] = React.useState(false);
  const [mainMenuOpen, setMainMenuOpen] = React.useState(false);

  function closeMenus() {
    setViewMenuOpen(false);
    setMainMenuOpen(false);
  }

  return (
    <header className="clio-topbar z-20 border-b px-4 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="text-lg font-bold text-[var(--clio-purple-950)]">
            Clio
          </div>

          <ProjectStatusLine project={project} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ViewSelectorMenu
            open={viewMenuOpen}
            decompositionView={decompositionView}
            onToggle={() => {
              setViewMenuOpen((current) => !current);
              setMainMenuOpen(false);
            }}
            onClose={() => setViewMenuOpen(false)}
            setDecompositionView={(view) => {
              setDecompositionView(view);
              setWorkspacePanel("canvas");
              closeMenus();
            }}
          />

          <MainMenuDropdown
            open={mainMenuOpen}
            onToggle={() => {
              setMainMenuOpen((current) => !current);
              setViewMenuOpen(false);
            }}
            onClose={() => setMainMenuOpen(false)}
            setWorkspacePanel={(panel) => {
              setWorkspacePanel(panel);
              closeMenus();
            }}
            onOpenProjectSettings={() => {
              onOpenProjectSettings();
              closeMenus();
            }}
            onSaveSnapshot={() => {
              onSaveSnapshot();
              closeMenus();
            }}
            onDownloadMarkdown={() => {
              onDownloadMarkdown();
              closeMenus();
            }}
            onExportProjectJson={() => {
              onExportProjectJson();
              closeMenus();
            }}
            onImportProjectJson={(file) => {
              onImportProjectJson(file);
              closeMenus();
            }}
          />
        </div>
      </div>
    </header>
  );
}
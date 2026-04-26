import * as React from "react";
import {
  ChevronDown,
  Download,
  FileClock,
  FileText,
  History,
  Menu,
  Save,
  Upload,
} from "lucide-react";

import type {
  DecompositionView,
  DocumentationProject,
  WorkspacePanel,
} from "../_lib/builderTypes";

type BuilderTopBarProps = {
  project: DocumentationProject;
  decompositionView: DecompositionView;
  setDecompositionView: (view: DecompositionView) => void;
  setWorkspacePanel: (panel: WorkspacePanel) => void;
  onSaveSnapshot: () => void;
  onDownloadMarkdown: () => void;
  onExportProjectJson: () => void;
  onImportProjectJson: (file: File) => void;
};

const VIEW_OPTIONS: Array<{
  label: string;
  value: DecompositionView;
  disabled?: boolean;
}> = [
  { label: "System View", value: "system" },
  { label: "Functional Decomposition", value: "functional", disabled: true },
  { label: "Object-Oriented Decomposition", value: "object", disabled: true },
  { label: "Domain Decomposition", value: "domain", disabled: true },
];

export function BuilderTopBar({
  project,
  decompositionView,
  setDecompositionView,
  setWorkspacePanel,
  onSaveSnapshot,
  onDownloadMarkdown,
  onExportProjectJson,
  onImportProjectJson,
}: BuilderTopBarProps) {
  const [viewMenuOpen, setViewMenuOpen] = React.useState(false);
  const [mainMenuOpen, setMainMenuOpen] = React.useState(false);

  const activeView =
    VIEW_OPTIONS.find((item) => item.value === decompositionView)?.label ??
    "System View";

  return (
    <header className="clio-topbar z-20 border-b px-4 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="text-lg font-bold text-[var(--clio-purple-950)]">
            Clio
          </div>
          <div className="truncate text-xs text-[var(--clio-muted)]">
            {project.name} · {project.currentVersion} · {project.status} ·
            Autosaved
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setViewMenuOpen((current) => !current)}
              className="clio-btn-primary inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            >
              {activeView}
              <ChevronDown size={16} />
            </button>

            {viewMenuOpen ? (
              <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-[var(--clio-purple-border)] bg-[var(--clio-white)] p-2 shadow-xl">
                {VIEW_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    disabled={option.disabled}
                    onClick={() => {
                      if (option.disabled) return;
                      setDecompositionView(option.value);
                      setWorkspacePanel("canvas");
                      setViewMenuOpen(false);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      option.value === decompositionView
                        ? "bg-[var(--clio-purple-900)] text-[var(--clio-white)]"
                        : "text-[var(--clio-ink)] hover:bg-[var(--clio-purple-50)]"
                    } ${option.disabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    {option.disabled ? (
                      <div className="text-xs opacity-75">Coming soon</div>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              onClick={() => setMainMenuOpen((current) => !current)}
              className="clio-btn-secondary inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            >
              <Menu size={17} />
              Main Menu
            </button>

            {mainMenuOpen ? (
              <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-[var(--clio-purple-border)] bg-[var(--clio-white)] p-2 shadow-xl">
                <MenuButton
                  icon={<FileText size={16} />}
                  label="Document Preview"
                  onClick={() => {
                    setWorkspacePanel("document");
                    setMainMenuOpen(false);
                  }}
                />

                <MenuButton
                  icon={<History size={16} />}
                  label="Evolution History"
                  onClick={() => {
                    setWorkspacePanel("evolution");
                    setMainMenuOpen(false);
                  }}
                />

                <MenuButton
                  icon={<Save size={16} />}
                  label="Save Snapshot"
                  onClick={() => {
                    onSaveSnapshot();
                    setMainMenuOpen(false);
                  }}
                />

                <MenuButton
                  icon={<Download size={16} />}
                  label="Download Markdown"
                  onClick={() => {
                    onDownloadMarkdown();
                    setMainMenuOpen(false);
                  }}
                />

                <MenuButton
                  icon={<FileClock size={16} />}
                  label="Export Project JSON"
                  onClick={() => {
                    onExportProjectJson();
                    setMainMenuOpen(false);
                  }}
                />

                <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--clio-ink)] hover:bg-[var(--clio-purple-50)]">
                  <Upload size={16} />
                  Import Project JSON
                  <input
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (!file) return;

                      onImportProjectJson(file);
                      event.target.value = "";
                      setMainMenuOpen(false);
                    }}
                  />
                </label>
              </div>
            ) : null}
          </div>

          <button
            onClick={() => setWorkspacePanel("canvas")}
            className="clio-btn-gold rounded-lg px-3 py-2 text-sm font-semibold"
          >
            Return to Canvas
          </button>
        </div>
      </div>
    </header>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[var(--clio-ink)] hover:bg-[var(--clio-purple-50)]"
    >
      {icon}
      {label}
    </button>
  );
}
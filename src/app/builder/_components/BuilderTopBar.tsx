import * as React from "react";
import {
  ChevronDown,
  Download,
  FileClock,
  FileText,
  History,
  Layers,
  Menu,
  Save,
  Settings,
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
  onOpenProjectSettings: () => void;
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

function getDisplayProjectName(project: DocumentationProject) {
  const name = project.name.trim();
  const version = project.currentVersion.trim();

  if (!version) return name;

  const normalizedName = name.toLowerCase();
  const normalizedVersion = version.toLowerCase();

  if (normalizedName.endsWith(` ${normalizedVersion}`)) {
    return name.slice(0, name.length - version.length).trim();
  }

  return name;
}

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

  const activeView =
    VIEW_OPTIONS.find((item) => item.value === decompositionView)?.label ??
    "System View";

  const displayProjectName = getDisplayProjectName(project);

  return (
    <header className="clio-topbar z-20 border-b px-4 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="text-lg font-bold text-[var(--clio-purple-950)]">
            Clio
          </div>

          <div className="truncate text-xs text-[var(--clio-muted)]">
            {displayProjectName} · {project.currentVersion} · {project.status} ·
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
              <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-[var(--clio-purple-border)] bg-[var(--clio-white)] p-2 shadow-xl">
                <div className="px-3 pb-2 pt-1">
                  <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--clio-purple-700)]">
                    Architecture Views
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[var(--clio-muted)]">
                    Switch between system, functional, object, and domain
                    perspectives.
                  </p>
                </div>

                <div className="space-y-1">
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
                      } ${
                        option.disabled ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    >
                      <div className="font-semibold">{option.label}</div>

                      {option.disabled ? (
                        <div className="text-xs opacity-75">Coming soon</div>
                      ) : null}
                    </button>
                  ))}
                </div>

                <div className="my-2 border-t border-[var(--clio-border)]" />

                <div className="px-3 py-2">
                  <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--clio-purple-700)]">
                    AI-Assisted Views
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[var(--clio-muted)]">
                    Future versions can generate functional, object, or domain
                    views from the current system map.
                  </p>
                </div>

                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-[var(--clio-muted)] opacity-60"
                >
                  <div className="font-semibold">
                    Generate Functional View with AI
                  </div>
                  <div className="text-xs">Coming soon</div>
                </button>

                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-[var(--clio-muted)] opacity-60"
                >
                  <div className="font-semibold">
                    Generate Object View with AI
                  </div>
                  <div className="text-xs">Coming soon</div>
                </button>

                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-[var(--clio-muted)] opacity-60"
                >
                  <div className="font-semibold">
                    Generate Domain View with AI
                  </div>
                  <div className="text-xs">Coming soon</div>
                </button>
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
                  icon={<Layers size={16} />}
                  label="Canvas Workspace"
                  onClick={() => {
                    setWorkspacePanel("canvas");
                    setMainMenuOpen(false);
                  }}
                />

                <div className="my-2 border-t border-[var(--clio-border)]" />

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
                  icon={<Settings size={16} />}
                  label="Project Settings"
                  onClick={() => {
                    onOpenProjectSettings();
                    setMainMenuOpen(false);
                  }}
                />

                <div className="my-2 border-t border-[var(--clio-border)]" />

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
import {
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

import type { WorkspacePanel } from "../../_lib/builderTypes";
import { TopbarMenuButton } from "./TopbarMenuButton";

type MainMenuDropdownProps = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  setWorkspacePanel: (panel: WorkspacePanel) => void;
  onOpenProjectSettings: () => void;
  onSaveSnapshot: () => void;
  onDownloadMarkdown: () => void;
  onExportProjectJson: () => void;
  onImportProjectJson: (file: File) => void;
};

export function MainMenuDropdown({
  open,
  onToggle,
  setWorkspacePanel,
  onOpenProjectSettings,
  onSaveSnapshot,
  onDownloadMarkdown,
  onExportProjectJson,
  onImportProjectJson,
}: MainMenuDropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="clio-btn-secondary inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
      >
        <Menu size={17} />
        Main Menu
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-[var(--clio-purple-border)] bg-[var(--clio-white)] p-2 shadow-xl">
          <TopbarMenuButton
            icon={<Layers size={16} />}
            label="Canvas Workspace"
            onClick={() => setWorkspacePanel("canvas")}
          />

          <div className="my-2 border-t border-[var(--clio-border)]" />

          <TopbarMenuButton
            icon={<FileText size={16} />}
            label="Document Preview"
            onClick={() => setWorkspacePanel("document")}
          />

          <TopbarMenuButton
            icon={<History size={16} />}
            label="Evolution History"
            onClick={() => setWorkspacePanel("evolution")}
          />

          <TopbarMenuButton
            icon={<Settings size={16} />}
            label="Project Settings"
            onClick={onOpenProjectSettings}
          />

          <div className="my-2 border-t border-[var(--clio-border)]" />

          <TopbarMenuButton
            icon={<Save size={16} />}
            label="Save Snapshot"
            onClick={onSaveSnapshot}
          />

          <TopbarMenuButton
            icon={<Download size={16} />}
            label="Download Markdown"
            onClick={onDownloadMarkdown}
          />

          <TopbarMenuButton
            icon={<FileClock size={16} />}
            label="Export Project JSON"
            onClick={onExportProjectJson}
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
              }}
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
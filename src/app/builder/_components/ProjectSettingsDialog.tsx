import * as React from "react";
import { Settings, X } from "lucide-react";

import type {
  DocumentationProject,
  ProjectStatus,
} from "../_lib/builderTypes";

type ProjectSettingsDialogProps = {
  open: boolean;
  project: DocumentationProject;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  onClose: () => void;
};

export function ProjectSettingsDialog({
  open,
  project,
  updateProject,
  onClose,
}: ProjectSettingsDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close project settings overlay"
        className="absolute inset-0 bg-[rgba(21,19,29,0.42)]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-settings-title"
        className="relative z-10 mx-auto mt-10 w-[min(94vw,620px)] overflow-hidden rounded-2xl border border-[var(--clio-purple-border)] bg-[var(--clio-white)] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--clio-border)] bg-[rgba(247,243,252,0.76)] px-5 py-4">
          <div>
            <div
              id="project-settings-title"
              className="flex items-center gap-2 text-base font-bold text-[var(--clio-purple-950)]"
            >
              <Settings size={18} />
              Project Settings
            </div>

            <p className="mt-1 text-sm leading-6 text-[var(--clio-muted)]">
              Edit project-level metadata separately from system, layer, and
              component details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--clio-purple-950)] transition hover:bg-[var(--clio-purple-50)]"
            aria-label="Close project settings"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <label className="block">
            <span className="clio-label mb-1 block">Project Name</span>
            <input
              value={project.name}
              onChange={(event) =>
                updateProject((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="clio-input w-full rounded-lg px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="clio-label mb-1 block">Project Description</span>
            <textarea
              value={project.description}
              onChange={(event) =>
                updateProject((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={5}
              className="clio-input w-full rounded-lg px-3 py-2 text-sm"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="clio-label mb-1 block">Current Version</span>
              <input
                value={project.currentVersion}
                onChange={(event) =>
                  updateProject((current) => ({
                    ...current,
                    currentVersion: event.target.value,
                  }))
                }
                className="clio-input w-full rounded-lg px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="clio-label mb-1 block">Project Status</span>
              <select
                value={project.status}
                onChange={(event) =>
                  updateProject((current) => ({
                    ...current,
                    status: event.target.value as ProjectStatus,
                  }))
                }
                className="clio-input w-full rounded-lg px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="approved">Approved</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>

          <div className="rounded-xl border border-[var(--clio-purple-border)] bg-[var(--clio-purple-50)] px-4 py-3 text-sm leading-6 text-[var(--clio-muted)]">
            These settings describe the project file as a whole. Element-level
            metadata, such as a system, layer, API, database, or component
            description, should be edited in the Inspector panel.
          </div>
        </div>

        <div className="flex justify-end border-t border-[var(--clio-border)] bg-[rgba(255,250,240,0.72)] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="clio-btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
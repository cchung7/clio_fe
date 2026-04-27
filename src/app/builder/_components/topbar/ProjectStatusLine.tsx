import type { DocumentationProject } from "../../_lib/builderTypes";

type ProjectStatusLineProps = {
  project: DocumentationProject;
};

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

export function ProjectStatusLine({ project }: ProjectStatusLineProps) {
  const displayProjectName = getDisplayProjectName(project);

  return (
    <div className="truncate text-xs text-[var(--clio-muted)]">
      {displayProjectName} · {project.currentVersion} · {project.status} ·
      Autosaved
    </div>
  );
}
import * as React from "react";

import type { DocumentationProject } from "../_lib/builderTypes";

type UseProjectStorageParams = {
  project: DocumentationProject;
  setProject: React.Dispatch<React.SetStateAction<DocumentationProject>>;
  storageKey: string;
  currentSchemaVersion: number;
  starterProject: DocumentationProject;
  onProjectHydrated?: () => void;
  onProjectReset?: () => void;
};

export function useProjectStorage({
  project,
  setProject,
  storageKey,
  currentSchemaVersion,
  starterProject,
  onProjectHydrated,
  onProjectReset,
}: UseProjectStorageParams) {
  const [hasLoadedStoredProject, setHasLoadedStoredProject] =
    React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      setHasLoadedStoredProject(true);
      onProjectHydrated?.();
      return;
    }

    try {
      const parsedProject = JSON.parse(stored) as DocumentationProject;

      if (parsedProject.schemaVersion !== currentSchemaVersion) {
        window.localStorage.removeItem(storageKey);
        setProject(starterProject);
        onProjectReset?.();
        return;
      }

      setProject(parsedProject);
      onProjectHydrated?.();
    } catch {
      setProject(starterProject);
      onProjectReset?.();
    } finally {
      setHasLoadedStoredProject(true);
    }
  }, [
    currentSchemaVersion,
    onProjectHydrated,
    onProjectReset,
    setProject,
    starterProject,
    storageKey,
  ]);

  React.useEffect(() => {
    if (!hasLoadedStoredProject) return;

    window.localStorage.setItem(storageKey, JSON.stringify(project));
  }, [project, hasLoadedStoredProject, storageKey]);

  return { hasLoadedStoredProject };
}

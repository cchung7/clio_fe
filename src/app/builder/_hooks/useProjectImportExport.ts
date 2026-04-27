import * as React from "react";

import type { DocumentationProject } from "../_lib/builderTypes";

type UseProjectImportExportParams = {
  project: DocumentationProject;
  markdown: string;
  currentSchemaVersion: number;
  onImportProject: (project: DocumentationProject) => void;
};

function getSafeFileBaseName(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, "-") || "clio-project";
}

function downloadTextFile({
  content,
  filename,
  type,
}: {
  content: string;
  filename: string;
  type: string;
}) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}

export function useProjectImportExport({
  project,
  markdown,
  currentSchemaVersion,
  onImportProject,
}: UseProjectImportExportParams) {
  const downloadMarkdown = React.useCallback(() => {
    downloadTextFile({
      content: markdown,
      filename: `${getSafeFileBaseName(project.name)}.md`,
      type: "text/markdown;charset=utf-8",
    });
  }, [markdown, project.name]);

  const exportProjectJson = React.useCallback(() => {
    downloadTextFile({
      content: JSON.stringify(project, null, 2),
      filename: `${getSafeFileBaseName(project.name)}.json`,
      type: "application/json;charset=utf-8",
    });
  }, [project]);

  const importProjectJson = React.useCallback(
    (file: File) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const importedProject = JSON.parse(
            String(reader.result)
          ) as DocumentationProject;

          if (importedProject.schemaVersion !== currentSchemaVersion) {
            window.alert("This Clio project file uses an older schema version.");
            return;
          }

          onImportProject({
            ...importedProject,
            updatedAt: new Date().toISOString(),
          });
        } catch {
          window.alert(
            "Could not import project. Please select a valid Clio JSON file."
          );
        }
      };

      reader.readAsText(file);
    },
    [currentSchemaVersion, onImportProject]
  );

  return {
    downloadMarkdown,
    exportProjectJson,
    importProjectJson,
  };
}

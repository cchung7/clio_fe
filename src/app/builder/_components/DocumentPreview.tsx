type DocumentPreviewProps = {
  markdown: string;
};

export function DocumentPreview({ markdown }: DocumentPreviewProps) {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="clio-panel mx-auto max-w-4xl rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--clio-purple-950)]">
              Document Export Preview
            </h2>
            <p className="text-sm text-[var(--clio-muted)]">
              Generated Markdown based on the current project state.
            </p>
          </div>

          <button
            onClick={() => navigator.clipboard.writeText(markdown)}
            className="clio-btn-primary rounded-lg px-3 py-2 text-sm font-medium"
          >
            Copy Markdown
          </button>
        </div>

        <pre className="clio-code-preview whitespace-pre-wrap rounded-xl p-4 text-sm leading-6">
          {markdown}
        </pre>
      </div>
    </div>
  );
}
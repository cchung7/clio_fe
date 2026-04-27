import type * as React from "react";

type CanvasControlsProps = {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  resetViewport: () => void;
};

export function CanvasControls({
  zoom,
  setZoom,
  resetViewport,
}: CanvasControlsProps) {
  return (
    <>
      <div className="absolute left-4 bottom-4 z-20 flex flex-col overflow-hidden rounded-xl border border-[var(--clio-purple-border)] bg-[var(--clio-white)] shadow-lg">
        <button
          onClick={() => setZoom((current) => Math.min(current + 0.1, 1.8))}
          className="border-b border-[var(--clio-border)] px-3 py-2 text-lg font-bold hover:bg-[var(--clio-purple-50)]"
          aria-label="Zoom in"
        >
          +
        </button>

        <button
          onClick={() => setZoom((current) => Math.max(current - 0.1, 0.5))}
          className="border-b border-[var(--clio-border)] px-3 py-2 text-lg font-bold hover:bg-[var(--clio-purple-50)]"
          aria-label="Zoom out"
        >
          −
        </button>

        <button
          onClick={resetViewport}
          className="px-3 py-2 text-xs font-bold hover:bg-[var(--clio-purple-50)]"
        >
          1:1
        </button>
      </div>

      <div className="absolute right-4 bottom-4 z-20 rounded-xl border border-[var(--clio-purple-border)] bg-[rgba(255,253,248,0.94)] px-3 py-2 text-xs font-semibold text-[var(--clio-muted)] shadow-lg">
        Zoom: {Math.round(zoom * 100)}%
      </div>
    </>
  );
}
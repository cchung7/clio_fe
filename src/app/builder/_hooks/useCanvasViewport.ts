import * as React from "react";

import type { Position } from "../_lib/canvasGeometry";

type UseCanvasViewportProps = {
  viewportResetToken: number;
};

export function useCanvasViewport({
  viewportResetToken,
}: UseCanvasViewportProps) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);

  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState<Position>({ x: 0, y: 0 });

  React.useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [viewportResetToken]);

  function clientPointToCanvasPoint(clientX: number, clientY: number): Position {
    const viewport = viewportRef.current;

    if (!viewport) {
      return { x: 0, y: 0 };
    }

    const rect = viewport.getBoundingClientRect();

    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }

    event.preventDefault();

    const zoomDelta = event.deltaY > 0 ? -0.08 : 0.08;

    setZoom((current) => {
      const nextZoom = current + zoomDelta;
      return Math.min(Math.max(nextZoom, 0.5), 1.8);
    });
  }

  function resetViewport() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  return {
    viewportRef,
    zoom,
    pan,
    setZoom,
    resetViewport,
    handleWheel,
    clientPointToCanvasPoint,
  };
}
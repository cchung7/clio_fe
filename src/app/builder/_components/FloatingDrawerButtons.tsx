import { PanelLeft, PanelRight } from "lucide-react";

type FloatingDrawerButtonsProps = {
  onOpenProject: () => void;
  onOpenDetails: () => void;
};

export function FloatingDrawerButtons({
  onOpenProject,
  onOpenDetails,
}: FloatingDrawerButtonsProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-between px-4 xl:hidden">
      <button
        onClick={onOpenProject}
        className="clio-btn-primary pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg"
      >
        <PanelLeft size={18} />
        Project / Add
      </button>

      <button
        onClick={onOpenDetails}
        className="clio-btn-gold pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg"
      >
        <PanelRight size={18} />
        Details
      </button>
    </div>
  );
}

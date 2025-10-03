import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">View:</span>
      <div className="flex rounded-lg border">
        <Button
          variant={view === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("grid")}
          className="rounded-r-none"
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          Grid
        </Button>
        <Button
          variant={view === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("list")}
          className="rounded-l-none"
        >
          <List className="mr-2 h-4 w-4" />
          List
        </Button>
      </div>
    </div>
  );
};

export default ViewToggle;

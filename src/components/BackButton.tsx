import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ to = "/" }: { to?: string }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
    >
      <ArrowLeft size={16} />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
}

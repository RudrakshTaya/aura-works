import { Link } from "react-router-dom";

export default function CategoryPill({ label, to }: { label: string; to: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 shadow-sm"
    >
      {label}
    </Link>
  );
}

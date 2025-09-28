import { Link } from "react-router-dom";

export default function Placeholder({ title, note }: { title: string; note?: string }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
        {note || "This page is coming soon. Tell me to generate it next and I'll build it out with full functionality."}
      </p>
      <div className="mt-6">
        <Link to="/" className="rounded-full bg-foreground text-background px-4 py-2 text-sm">Back to Home</Link>
      </div>
    </div>
  );
}

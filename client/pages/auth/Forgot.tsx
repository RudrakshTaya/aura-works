import { Link } from "react-router-dom";

export default function ForgotPage() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Password reset link sent (demo)");
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-2xl md:text-3xl font-semibold">Reset password</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Email</label>
          <input name="email" type="email" required className="w-full rounded-md bg-muted/60 px-3 py-2" />
        </div>
        <button className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm">Send reset link</button>
      </form>
      <div className="mt-4 text-sm text-muted-foreground">
        <Link to="/login" className="underline">Back to login</Link>
      </div>
    </div>
  );
}

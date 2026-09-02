import { Button } from "../../components/ui/Button";

export function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-neutral-50 px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-navy-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-navy-500">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button as="link" to="/" className="mt-6">
        Back to homepage
      </Button>
    </div>
  );
}

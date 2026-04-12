import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4 text-center px-4">
      <h1 className="text-7xl font-bold text-accent">404</h1>
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="text-sm text-text-muted max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-2 text-sm font-medium bg-accent hover:bg-accent-hover transition-colors duration-200 px-5 py-2 rounded-md"
      >
        Go home
      </Link>
    </div>
  );
}

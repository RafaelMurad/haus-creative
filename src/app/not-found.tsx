import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center px-5">
        <h1 className="text-[14px] font-bold uppercase tracking-wide mb-6">
          Page not found
        </h1>
        <p className="text-[19px] leading-[32px] mb-8 max-w-[500px]">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="text-[15px] uppercase tracking-wide border border-white px-8 py-3 hover:bg-white hover:text-black transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

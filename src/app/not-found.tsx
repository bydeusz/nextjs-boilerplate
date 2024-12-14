import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative w-full h-screen">
      <div className="flex w-full h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-black text-8xl mb-4">404</h1>
          <p className="text-xl">
            The page you are looking for was removed, renamed or may not exist.
          </p>
          <div className="mt-12">
            <Link
              href="/"
              className="bg-blue-600 w-full py-4 px-6 text-center text-white font-semibold hover:bg-blue-800 text-base rounded-full">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function LocaleNotFound() {
  console.log("not found LocaleNotFound");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you are looking for could not be found.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/en"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go Home
          </Link>
          <div>
            <Link
              href="/en/dashboard"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

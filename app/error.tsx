"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
        <h1 className="text-3xl font-bold text-red-600">⚠️ Something went wrong</h1>
        <p className="mt-4 text-gray-700">{error.message}</p>

        <button
          onClick={() => reset()} // retries rendering
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>

        <a
          href="/"
          className="mt-3 text-blue-600 underline hover:text-blue-800"
        >
          Go back to Dashboard
        </a>
      </body>
    </html>
  );
}

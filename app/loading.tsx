export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-pink-50/30 flex items-center justify-center">
      <div className="text-center">
        {/* Sakura Brand */}
        <div className="mb-6">
          <h1 className="text-4xl font-sakura text-primary">Sakura</h1>
        </div>

        {/* Simple Fast Spinner */}
        <div className="w-10 h-10 mx-auto border-2 border-pink-100 border-t-primary rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

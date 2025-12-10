export default function TVSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8 animate-pulse">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Turno Actual Skeleton */}
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-8"></div>
            <div className="h-32 bg-gray-700 rounded w-48 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-700 rounded w-64 mx-auto"></div>
          </div>

          {/* QR Code Skeleton */}
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <div className="h-8 bg-gray-700 rounded w-40 mx-auto mb-8"></div>
            <div className="h-64 w-64 bg-gray-700 rounded mx-auto mb-6"></div>
            <div className="h-5 bg-gray-700 rounded w-56 mx-auto"></div>
          </div>
        </div>

        {/* Carousel Skeleton */}
        <div className="mt-12 bg-gray-800 rounded-2xl p-8">
          <div className="h-6 bg-gray-700 rounded w-40 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-700 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


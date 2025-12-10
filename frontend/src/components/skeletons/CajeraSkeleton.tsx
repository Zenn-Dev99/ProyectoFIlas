export default function CajeraSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="h-5 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
        </div>

        {/* Turno Actual Skeleton */}
        <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-6 mb-8">
          <div className="h-6 bg-blue-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-16 bg-blue-200 rounded w-24 mb-4"></div>
              <div className="h-5 bg-blue-200 rounded w-32 mb-2"></div>
              <div className="h-5 bg-blue-200 rounded w-40"></div>
            </div>
            <div>
              <div className="h-5 bg-blue-200 rounded w-24 mb-2"></div>
              <div className="h-10 bg-blue-300 rounded w-full mb-4"></div>
            </div>
          </div>
        </div>

        {/* Lista de Turnos Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-12 bg-gray-300 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40 mb-3"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


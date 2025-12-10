export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-300 rounded w-64 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-96"></div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="bg-gray-200 rounded-full p-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estadísticas Adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-12 bg-gray-300 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
          ))}
        </div>

        {/* Accesos Rápidos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 border-2 border-gray-200 rounded-lg">
                <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


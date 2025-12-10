export default function DetalleTurnoSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 animate-pulse">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-10 bg-gray-300 rounded w-64"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        {/* Grid de Información */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información del Cliente Skeleton */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="space-y-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-48"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-40"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-56"></div>
              </div>
            </div>
          </div>

          {/* Información del Turno Skeleton */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="space-y-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
                <div className="h-12 bg-gray-300 rounded w-24"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-32"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Orden Skeleton (condicional) */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <div className="h-6 bg-gray-300 rounded w-56 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </div>
        </div>

        {/* Botones Skeleton */}
        <div className="mt-8 flex gap-4">
          <div className="flex-1 h-12 bg-gray-300 rounded"></div>
          <div className="h-12 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
}


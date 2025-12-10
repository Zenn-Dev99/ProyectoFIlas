export default function InicioCajeraSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-8 animate-pulse">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl p-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <div className="h-10 bg-gray-300 rounded w-64 mx-auto mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>

        {/* Selector de Cajera Skeleton */}
        <div className="mb-6">
          <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>

        {/* Tipos de Servicio Skeleton */}
        <div className="mb-8">
          <div className="h-5 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded flex-1"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón Skeleton */}
        <div className="h-12 bg-gray-300 rounded-lg w-full"></div>
      </div>
    </div>
  );
}


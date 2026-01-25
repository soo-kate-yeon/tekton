/**
 * Loading 스켈레톤 UI
 * SPEC-PLAYGROUND-001 Milestone 2
 *
 * Blueprint 페칭 중 표시되는 로딩 상태
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-pulse">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Skeleton */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-3"></div>
            <div className="bg-gray-100 rounded-lg p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-blue-700">Blueprint를 불러오는 중...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

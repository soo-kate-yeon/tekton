'use client';

/**
 * Error 바운더리
 * SPEC-PLAYGROUND-001 Milestone 2
 *
 * Blueprint 페칭 또는 렌더링 실패 시 표시되는 에러 UI
 */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden">
          {/* Error Header */}
          <div className="bg-red-50 border-b border-red-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-800">Failed to load preview</h2>
                <p className="text-sm text-red-600 mt-1">
                  Blueprint를 불러오는 중 오류가 발생했습니다
                </p>
              </div>
            </div>
          </div>

          {/* Error Details */}
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">오류 메시지</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <code className="text-sm text-red-600 break-all">{error.message}</code>
              </div>
            </div>

            {error.digest && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Error ID</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <code className="text-sm text-gray-600">{error.digest}</code>
                </div>
              </div>
            )}

            {/* Troubleshooting */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">문제 해결 방법</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• MCP 서버가 실행 중인지 확인하세요 (localhost:3000)</li>
                <li>• Timestamp가 올바른지 확인하세요</li>
                <li>• Blueprint가 MCP 서버에 존재하는지 확인하세요</li>
                <li>• 네트워크 연결을 확인하세요</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                다시 시도
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                이전 페이지로
              </button>
            </div>
          </div>

          {/* Technical Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <details className="text-sm">
                <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                  기술 세부 정보 (개발 모드)
                </summary>
                <pre className="mt-3 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-xs">
                  {error.stack || 'Stack trace not available'}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

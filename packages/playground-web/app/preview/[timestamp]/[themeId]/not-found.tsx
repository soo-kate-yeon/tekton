/**
 * Not Found 페이지
 * SPEC-PLAYGROUND-001 Milestone 2
 *
 * Blueprint를 찾을 수 없을 때 표시되는 페이지
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">404</h2>
                <p className="text-sm text-gray-600">Blueprint Not Found</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              요청하신 Blueprint를 찾을 수 없습니다. Timestamp가 올바른지 확인해주세요.
            </p>

            {/* Troubleshooting */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2">가능한 원인</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Blueprint가 아직 생성되지 않았습니다</li>
                <li>• Timestamp가 잘못되었습니다</li>
                <li>• MCP 서버에서 Blueprint가 삭제되었습니다</li>
                <li>• MCP 서버가 실행 중이 아닙니다</li>
              </ul>
            </div>

            {/* Action Button */}
            <Link
              href="/"
              className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

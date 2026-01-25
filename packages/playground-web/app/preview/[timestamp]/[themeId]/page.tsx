/**
 * Preview 페이지 (Server Component)
 * SPEC-PLAYGROUND-001 Milestone 2
 *
 * Blueprint를 timestamp로 가져와서 JSON으로 표시합니다.
 * 다음 단계에서 실제 컴포넌트 렌더링으로 확장됩니다.
 */

import { fetchBlueprint } from '@/lib/mcp-client';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ timestamp: string; themeId: string }>;
}

export default async function PreviewPage({ params }: PageProps) {
  const { timestamp, themeId } = await params;

  // Blueprint 가져오기
  const blueprint = await fetchBlueprint(timestamp);

  if (!blueprint) {
    notFound();
  }

  // themeId 검증 (blueprint의 themeId와 URL의 themeId가 일치해야 함)
  if (blueprint.themeId !== themeId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">Theme Mismatch</h2>
          <p className="text-yellow-700 mb-4">
            URL의 themeId ({themeId})가 Blueprint의 themeId ({blueprint.themeId})와 일치하지
            않습니다.
          </p>
          <p className="text-sm text-yellow-600">
            올바른 URL:{' '}
            <code className="bg-yellow-100 px-2 py-1 rounded">
              /preview/{timestamp}/{blueprint.themeId}
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Preview: {timestamp}</h1>
            <div className="flex gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Blueprint:</span> {blueprint.name}
              </div>
              <div>
                <span className="font-medium">Theme:</span> {themeId}
              </div>
              <div>
                <span className="font-medium">Layout:</span> {blueprint.layout}
              </div>
              <div>
                <span className="font-medium">Components:</span> {blueprint.components.length}
              </div>
            </div>
          </div>

          {/* Blueprint JSON Display */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Blueprint Data</h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(blueprint, null, 2)}
            </pre>
          </div>

          {/* Metadata */}
          {blueprint.description && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
              <p className="text-gray-600">{blueprint.description}</p>
            </div>
          )}
        </div>

        {/* Development Info */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">🚧 Development Mode</h3>
          <p className="text-sm text-blue-700">
            Milestone 2: Blueprint fetching과 validation이 성공했습니다. 다음 단계에서 실제 컴포넌트
            렌더링이 구현됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 메타데이터 생성
 */
export async function generateMetadata({ params }: PageProps) {
  const { timestamp } = await params;

  return {
    title: `Preview ${timestamp}`,
    description: `Blueprint preview for timestamp ${timestamp}`,
  };
}

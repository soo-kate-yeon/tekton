export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">Tekton Playground</h1>
        <p className="text-xl text-center mb-8">OKLCH 기반 디자인 토큰 생성기</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Blueprint 생성</h2>
            <p className="text-gray-600 dark:text-gray-400">
              MCP 서버를 통해 디자인 토큰 Blueprint를 생성합니다.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">토큰 미리보기</h2>
            <p className="text-gray-600 dark:text-gray-400">
              생성된 디자인 토큰을 실시간으로 미리보기 합니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

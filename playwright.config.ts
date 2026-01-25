import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 설정 파일
 *
 * SPEC-PLAYGROUND-001 접근성 테스트를 위한 Playwright 구성
 * WCAG 2.1 AA 준수 검증을 위한 axe-core 통합
 */
export default defineConfig({
  // 테스트 파일 위치
  testDir: './tests/accessibility',

  // 각 테스트의 최대 실행 시간
  timeout: 30 * 1000,

  // 병렬 실행 설정
  fullyParallel: true,

  // CI 환경에서 재시도 비활성화
  forbidOnly: !!process.env.CI,

  // 실패 시 재시도 횟수
  retries: process.env.CI ? 2 : 0,

  // 워커 수 (병렬 실행)
  workers: process.env.CI ? 1 : undefined,

  // 리포터 설정
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list'],
  ],

  // 공통 설정
  use: {
    // 각 액션의 기본 타임아웃
    actionTimeout: 10 * 1000,

    // 스크린샷 옵션 (실패 시에만)
    screenshot: 'only-on-failure',

    // 비디오 녹화 옵션 (실패 시에만)
    video: 'retain-on-failure',

    // 트레이스 수집 옵션
    trace: 'on-first-retry',
  },

  // 테스트할 브라우저 설정
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // 필요 시 다른 브라우저 활성화
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // 모바일 테스트 (필요 시 활성화)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // 개발 서버 설정 (필요 시 활성화)
  // webServer: {
  //   command: 'npm run dev',
  //   port: 3000,
  //   reuseExistingServer: !process.env.CI,
  // },
});

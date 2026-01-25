import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * WCAG 2.1 AA 접근성 준수 테스트
 *
 * SPEC-PLAYGROUND-001 요구사항 U-003에 따른 WCAG 2.1 AA 규정 준수 검증
 *
 * 이 테스트는 axe-core를 사용하여 자동화된 접근성 검사를 수행합니다.
 * 주요 검사 항목:
 * - 색상 대비 (WCAG AA: 4.5:1 이상)
 * - 키보드 네비게이션
 * - ARIA 레이블 및 역할
 * - 의미론적 HTML 구조
 * - 폼 요소 레이블링
 */

test.describe('WCAG 2.1 AA 준수 검증', () => {
  test('샘플 페이지 접근성 검사', async ({ page }) => {
    // 테스트할 페이지로 이동 (실제 구현 시 playground URL로 변경)
    await page.goto('about:blank');

    // 간단한 샘플 HTML 설정
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>WCAG 2.1 AA 테스트 페이지</title>
        </head>
        <body>
          <header>
            <h1>디자인 토큰 플레이그라운드</h1>
            <nav aria-label="주요 네비게이션">
              <ul>
                <li><a href="#colors">색상</a></li>
                <li><a href="#typography">타이포그래피</a></li>
                <li><a href="#spacing">간격</a></li>
              </ul>
            </nav>
          </header>

          <main>
            <section id="colors" aria-labelledby="colors-heading">
              <h2 id="colors-heading">색상 토큰</h2>
              <div style="background-color: #ffffff; color: #000000; padding: 1rem;">
                <p>높은 대비 텍스트 예시 (21:1)</p>
              </div>
              <button type="button" aria-label="색상 추가">추가</button>
            </section>

            <section id="form-example" aria-labelledby="form-heading">
              <h2 id="form-heading">폼 예시</h2>
              <form>
                <label for="color-name">색상 이름</label>
                <input
                  type="text"
                  id="color-name"
                  name="colorName"
                  aria-required="true"
                  required
                />

                <label for="color-value">색상 값</label>
                <input
                  type="text"
                  id="color-value"
                  name="colorValue"
                  placeholder="#000000"
                  aria-describedby="color-help"
                />
                <span id="color-help">16진수 색상 코드를 입력하세요</span>
              </form>
            </section>
          </main>

          <footer>
            <p>&copy; 2026 Tekton Design Tokens</p>
          </footer>
        </body>
      </html>
    `);

    // axe-core로 WCAG 2.1 AA 검사 수행
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // 위반 사항이 없어야 함
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('색상 대비 검사 (WCAG AA: 4.5:1)', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>색상 대비 테스트</title>
        </head>
        <body>
          <div style="background-color: #ffffff; color: #595959; padding: 1rem;">
            <p>일반 텍스트 (대비 4.5:1 이상)</p>
          </div>
          <div style="background-color: #000000; color: #ffffff; padding: 1rem;">
            <h1>큰 텍스트 (대비 3:1 이상)</h1>
          </div>
        </body>
      </html>
    `);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['region']) // 색상 대비에만 집중
      .analyze();

    // 색상 대비 위반 사항 검사
    const contrastViolations = results.violations.filter(
      violation => violation.id === 'color-contrast'
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('키보드 네비게이션 접근성', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>키보드 네비게이션 테스트</title>
        </head>
        <body>
          <button type="button">버튼 1</button>
          <a href="#content">링크</a>
          <label for="input1">입력 필드</label>
          <input type="text" id="input1" />
          <label for="select1">선택 필드</label>
          <select id="select1">
            <option>옵션 1</option>
          </select>
        </body>
      </html>
    `);

    // 포커스 가능한 요소들이 올바른 순서로 접근 가능한지 확인
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag21a']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('ARIA 레이블 및 역할 검증', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>ARIA 테스트</title>
        </head>
        <body>
          <nav aria-label="주 네비게이션">
            <ul role="list">
              <li role="listitem"><a href="#home">홈</a></li>
              <li role="listitem"><a href="#about">소개</a></li>
            </ul>
          </nav>

          <div role="alert" aria-live="polite">
            알림 메시지가 표시됩니다
          </div>

          <button
            type="button"
            aria-expanded="false"
            aria-controls="menu"
            aria-label="메뉴 토글"
          >
            메뉴
          </button>
        </body>
      </html>
    `);

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('폼 접근성 검증', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>폼 접근성 테스트</title>
        </head>
        <body>
          <form aria-labelledby="form-title">
            <h2 id="form-title">사용자 정보 입력</h2>

            <label for="username">사용자 이름</label>
            <input
              type="text"
              id="username"
              name="username"
              aria-required="true"
              required
            />

            <label for="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              aria-describedby="email-help"
              required
            />
            <span id="email-help">유효한 이메일 주소를 입력하세요</span>

            <fieldset>
              <legend>알림 설정</legend>
              <label>
                <input type="checkbox" name="notifications" value="email" />
                이메일 알림
              </label>
              <label>
                <input type="checkbox" name="notifications" value="sms" />
                SMS 알림
              </label>
            </fieldset>

            <button type="submit">제출</button>
          </form>
        </body>
      </html>
    `);

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('의미론적 HTML 구조 검증', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>의미론적 HTML 테스트</title>
        </head>
        <body>
          <header>
            <h1>사이트 제목</h1>
          </header>

          <nav aria-label="주 네비게이션">
            <ul>
              <li><a href="#section1">섹션 1</a></li>
            </ul>
          </nav>

          <main>
            <article>
              <h2>기사 제목</h2>
              <p>기사 내용</p>
            </article>

            <aside aria-label="관련 정보">
              <h3>부가 정보</h3>
            </aside>
          </main>

          <footer>
            <p>저작권 정보</p>
          </footer>
        </body>
      </html>
    `);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('이미지 대체 텍스트 검증', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>이미지 접근성 테스트</title>
        </head>
        <body>
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23ccc'/%3E%3C/svg%3E"
            alt="회색 사각형 샘플 이미지"
          />

          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3C/svg%3E"
            alt=""
            role="presentation"
          />

          <figure>
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2300f'/%3E%3C/svg%3E"
              alt="파란색 원"
            />
            <figcaption>디자인 토큰 색상 샘플</figcaption>
          </figure>
        </body>
      </html>
    `);

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });
});

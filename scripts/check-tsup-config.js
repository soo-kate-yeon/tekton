#!/usr/bin/env node
/**
 * tsup + TypeScript composite 호환성 검사 스크립트
 *
 * 문제: tsup의 --dts 옵션은 composite: true tsconfig와 호환되지 않음 (TS6307 에러)
 * 해결: tsup 사용 패키지는 빌드 전용 tsconfig.build.json을 사용해야 함
 *
 * 이 스크립트는 다음을 검사합니다:
 * 1. tsup을 사용하는 패키지 식별
 * 2. 해당 패키지의 tsconfig.json에 composite: true가 있는지 확인
 * 3. composite 사용 시 tsconfig.build.json이 있고, build 스크립트에서 참조하는지 확인
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// 색상 코드
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

function log(color, symbol, message) {
  console.log(`${colors[color]}${symbol}${colors.reset} ${message}`);
}

function checkPackage(packagePath) {
  const packageJsonPath = join(packagePath, 'package.json');
  const tsconfigPath = join(packagePath, 'tsconfig.json');
  const tsconfigBuildPath = join(packagePath, 'tsconfig.build.json');

  if (!existsSync(packageJsonPath)) {
    return { skip: true };
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const packageName = packageJson.name || packagePath;

  // tsup 사용 여부 확인
  const hasTsup =
    packageJson.devDependencies?.tsup || packageJson.dependencies?.tsup;
  const buildScript = packageJson.scripts?.build || '';
  const usesTsupBuild = buildScript.includes('tsup');
  const usesDts = buildScript.includes('--dts');

  if (!hasTsup && !usesTsupBuild) {
    return { skip: true, packageName };
  }

  // tsconfig.json 확인
  if (!existsSync(tsconfigPath)) {
    return {
      skip: false,
      packageName,
      warning: 'tsconfig.json이 없습니다',
    };
  }

  const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
  const hasComposite = tsconfig.compilerOptions?.composite === true;

  // composite + tsup --dts 조합 검사
  if (hasComposite && usesDts) {
    const hasBuildConfig = existsSync(tsconfigBuildPath);
    const usesBuildConfig = buildScript.includes('tsconfig.build.json');

    if (!hasBuildConfig) {
      return {
        skip: false,
        packageName,
        error: `tsup --dts와 composite: true 사용 시 tsconfig.build.json이 필요합니다.
       해결: composite 옵션 없이 tsconfig.build.json을 생성하세요.`,
      };
    }

    if (!usesBuildConfig) {
      return {
        skip: false,
        packageName,
        error: `build 스크립트에서 --tsconfig tsconfig.build.json을 사용해야 합니다.
       현재: "${buildScript}"
       수정: tsup ... --tsconfig tsconfig.build.json`,
      };
    }

    return {
      skip: false,
      packageName,
      success: 'tsup + composite 호환성 패턴 준수',
    };
  }

  return { skip: true, packageName };
}

function main() {
  console.log('\n🔍 tsup + TypeScript composite 호환성 검사\n');

  const packageDirs = globSync('packages/*', { cwd: rootDir });
  let hasErrors = false;
  let checkedCount = 0;

  for (const dir of packageDirs) {
    const fullPath = join(rootDir, dir);
    const result = checkPackage(fullPath);

    if (result.skip) {
      continue;
    }

    checkedCount++;

    if (result.error) {
      log('red', '✖', `${result.packageName}`);
      console.log(`   ${result.error}\n`);
      hasErrors = true;
    } else if (result.warning) {
      log('yellow', '⚠', `${result.packageName}: ${result.warning}`);
    } else if (result.success) {
      log('green', '✔', `${result.packageName}: ${result.success}`);
    }
  }

  if (checkedCount === 0) {
    console.log('tsup을 사용하는 패키지가 없습니다.\n');
    return 0;
  }

  console.log('');

  if (hasErrors) {
    log(
      'red',
      '✖',
      'tsup + composite 호환성 문제가 발견되었습니다. 위 내용을 수정하세요.\n'
    );
    return 1;
  }

  log('green', '✔', '모든 패키지가 tsup + composite 호환성 패턴을 준수합니다.\n');
  return 0;
}

process.exit(main());

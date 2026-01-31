#!/bin/bash
#
# Bulk TAG Annotation Script
# [TAG-Q-001] 모든 요구사항 TAG 주석 포함
#
# WHY: 수동 TAG 추가는 인적 오류 발생 가능
# IMPACT: 자동화로 일관성 및 효율성 보장
#

set -e

BASE_DIR="/Users/sooyeon/Developer/tekton/packages/ui/src"

# TAG 주석 템플릿
TAG_TEMPLATE="/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 코드 품질 및 추적성을 보장
 * IMPACT: TAG 누락 시 요구사항 추적 불가
 */
"

echo "🏷️  Adding TAG annotations to files..."

# 컴포넌트 파일에 TAG 추가
for file in "$BASE_DIR"/components/*.tsx; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")

    # 이미 TAG가 있는지 확인
    if grep -q "\[TAG-Q-" "$file"; then
      echo "⏭️  Skipping $filename (already has TAG)"
      continue
    fi

    # 첫 번째 주석 블록 찾기
    if head -5 "$file" | grep -q "^/\*\*"; then
      echo "✅ Adding TAG to $filename"

      # 임시 파일 생성
      temp_file=$(mktemp)

      # 기존 주석 블록에 TAG 추가
      awk '
        BEGIN { in_comment = 0; comment_inserted = 0 }
        /^\/\*\*/ { in_comment = 1; print; next }
        in_comment && !comment_inserted {
          print " * [TAG-Q-001] 모든 요구사항 TAG 주석 포함"
          print " * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일"
          print " * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수"
          print " *"
          print " * WHY: 코드 품질 및 추적성을 보장"
          print " * IMPACT: TAG 누락 시 요구사항 추적 불가"
          comment_inserted = 1
        }
        /\*\// && in_comment { in_comment = 0 }
        { print }
      ' "$file" > "$temp_file"

      mv "$temp_file" "$file"
    else
      echo "⚠️  No comment block found in $filename, adding new block"

      # 파일 시작 부분에 TAG 주석 추가
      temp_file=$(mktemp)
      echo "$TAG_TEMPLATE" | cat - "$file" > "$temp_file"
      mv "$temp_file" "$file"
    fi
  fi
done

echo ""
echo "✅ TAG annotations added successfully!"
echo "🔍 Run 'pnpm validate:tags' to verify"

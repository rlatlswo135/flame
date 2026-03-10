## 프로젝트 개요
flame은 React 19 기반 디자인시스템 모노레포다.
- `packages/ui`: 핵심 UI 컴포넌트 라이브러리
- `packages/table`: 테이블 컴포넌트
- `apps/docs`: 문서 사이트
- `apps/storybook`: 스토리북

## 기술 스택
- React 19, TypeScript 5, pnpm workspace (catalog)
- 빌드: tsup / 린트: biome / 커밋: commitizen + husky

## 멀티에이전트 워크플로우

코드 작성 작업 완료 후, 반드시 아래 순서를 따른다:

### 자동 리뷰 파이프라인
1. 코드 작성이 끝나면 아래 두 에이전트를 **병렬** 실행한다:
   - **Reviewer** (`.claude/agents/reviewer.md`): 변경된 파일을 리뷰
   - **Convention Guard** (`.claude/agents/convention.md`): 컨벤션 규칙 체크
2. 두 에이전트의 결과를 종합해서 사용자에게 보고한다.
3. Must Fix 항목이 있으면 수정 제안을 포함한다.

### 에이전트 정의
- `.claude/agents/reviewer.md` — 코드 리뷰 에이전트
- `.claude/agents/coder.md` — 코드 생성 에이전트
- `.claude/agents/convention.md` — 컨벤션 가드 에이전트

### 독립 리뷰
- 사용자가 코드 리뷰를 요청하면 Reviewer + Convention Guard를 병렬 실행한다.
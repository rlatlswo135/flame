---
name: write-test
description: @flame/ui/core 내부 컴포넌트의 테스트 코드 작성
---

❌ 테스트 안함
- 기본적인 렌더링
- 정말 너무나도 기본적인 ux
- 디자인 컴포넌트의 "기능" 테스트와 거리가 먼 종류들
  - ex: 애니메이션 트랜지션에 따른 view 변화, a11y, etc,
- 단순 className, data-* 등의 변화를 '값'으로 확인하는 정도
  - IMPORTANT: 그 '값' 변화 테스트가 동작을 확인하기 위함이면 테스트 가능 ✅
- 특정 props를 갖는지, 안갖는지에 대한 단순 값 여부

✅ 테스트 함
- 컴포넌트 네이밍에 맞는 "동작" 위주
- 너무나도 기본적인 ux 외 컴포넌트가 가지면 좋을 ux.
  - ex: Modal,Drawer = FocusTrap, Select = Keyboard Navigation, etc
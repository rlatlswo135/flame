---
name: write-ui-component
description: @flame/ui/core 내부 컴포넌트 뼈대 코드 작성
---

- Compound Component
- Compound Item Component의 경우 type이 간단하더라도 type 선언 별도 필수.
  - ex: Select.Item -> SelectItemProps
  - type의 위치는 해당 Compound Item Component 바로 상단에 위치
  - 선언된 타입은 모두 inline export

- Compound의 Root역할은 suffix에 Root 명명
- Compound 조합시 Object.assign을 통한 생성.
  - ex: const Select = Object.assign(SelectRoot,{Item,Content,Trigger});

- floating 기능이 필요하다면 hooks/use-floating-base 우선 사용 고려
  - ex: Popover, Modal, Drawer, Tooltip, etc
- 기본적인 a11y 붙여진 형태로
import { type KeyboardEvent, type RefObject, useState } from "react";

type UseListNavigationParams = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** `[role="option"]`을 탐색할 리스트 컨테이너 ref. */
	listRef: RefObject<HTMLElement | null>;
	/** Enter로 활성 옵션을 확정할 때의 처리 — 무엇을 선택할지는 호출자 책임. */
	onSelect: (option: HTMLElement) => void;
};

/**
 * aria-activedescendant 기반 키보드 네비게이션.
 * 닫힘→방향키 시 열기, 순환 이동, 활성 옵션 스크롤, Enter 확정만 담당한다.
 * 필터링·선택 동작·입력값 같은 도메인 로직은 호출자가 가진다.
 */
export const useListNavigation = ({
	open,
	onOpenChange,
	listRef,
	onSelect,
}: UseListNavigationParams) => {
	const [activeId, setActiveId] = useState<string | null>(null);

	const getOptions = () =>
		listRef.current
			? Array.from(
					listRef.current.querySelectorAll<HTMLElement>('[role="option"]'),
				)
			: [];

	const move = (delta: 1 | -1) => {
		const options = getOptions();
		if (options.length === 0) return;

		const index = options.findIndex((el) => el.id === activeId);
		// 미선택(index === -1)일 때 ↓는 첫 항목, ↑는 마지막 항목으로.
		const from = index === -1 ? (delta === 1 ? -1 : 0) : index;
		const next = options[(from + delta + options.length) % options.length];

		setActiveId(next.id);
		next.scrollIntoView?.({ block: "nearest" });
	};

	const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		switch (event.key) {
			case "ArrowDown":
			case "ArrowUp": {
				event.preventDefault();
				if (!open) {
					onOpenChange(true);
					return;
				}
				move(event.key === "ArrowDown" ? 1 : -1);
				return;
			}
			case "Enter": {
				const active = getOptions().find((el) => el.id === activeId);
				if (!active) return;
				event.preventDefault();
				onSelect(active);
				return;
			}
		}
	};

	return { activeId, setActiveId, onKeyDown };
};

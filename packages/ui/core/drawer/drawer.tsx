"use client";

import {
	type ComponentPropsWithoutRef,
	type CSSProperties,
	cloneElement,
	type MouseEvent,
	type PropsWithChildren,
	type SyntheticEvent,
	type TransitionEvent,
	useRef,
	useState,
} from "react";
import type { ClickableElement, ElementFnChildren } from "@/core/types";
import { useCtx } from "@/hooks/use-ctx";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useResolvedId } from "@/hooks/use-resolved-id";
import { cloneSingleElement } from "../utils";
import { DrawerContext } from "./context";

type Placement = "top" | "right" | "bottom" | "left";

export type DrawerProps = {
	contentId?: string;
	placement?: Placement;
	onOpen?: () => void;
	onClose?: () => void;
};

/**
 * 네이티브 <dialog> + showModal() 기반 구현.
 *
 * [변경 이유] 기존엔 Portal + 수동 focus-trap + 전역 z-index 카운터 + dim <div>로
 * 모달 동작을 직접 구현했으나, showModal()이 아래를 네이티브로 제공하므로 모두 제거했다.
 *  - 포커스 트랩 + 배경 inert + 닫을 때 포커스 복원       → useFocusTrap 제거
 *  - top layer 자동 스택(중첩 drawer 포함)                → globalZIndex / MODAL_Z_BASE 제거
 *  - stacking/overflow context 탈출(SSR도 Portal 불필요)  → Portal 제거
 *  - 모달 시맨틱(role/aria-modal) + Escape 닫기            → 수동 부여/키 핸들러 제거
 *  - 배경 딤(backdrop)                                    → dim <div> 제거, ::backdrop 사용
 *
 * [유지] 패널 슬라이드 애니메이션은 인라인 transform으로 그대로 둔다(open/close 참고).
 * 단, showModal/close는 display:none↔block 토글이라 close 타이밍만 JS로 제어한다.
 */
const DrawerRoot = ({
	placement = "right",
	onOpen,
	onClose,
	children,
	contentId,
}: PropsWithChildren<DrawerProps>) => {
	const resolvedId = useResolvedId(contentId);
	// showModal()/close()를 호출할 네이티브 dialog 엘리먼트 ref (기존엔 div + Portal).
	const dialog = useRef<HTMLDialogElement>(null);
	const reducedMotion = usePrefersReducedMotion();

	// isOpen: dialog 표시 여부(aria-expanded용). entered: 슬라이드 위치(in/out).
	// 둘을 분리해야 "표시는 됐지만 아직 화면 밖" → 진입 트랜지션을 만들 수 있다.
	const [isOpen, setIsOpen] = useState(false);
	const [entered, setEntered] = useState(false);

	const open = () => {
		dialog.current?.showModal();
		setIsOpen(true);
		// showModal()은 display:none→block 전환이라, 슬라이드-아웃 위치가 한 번 그려진 뒤
		// transform을 바꿔야 보간이 일어난다. 두 프레임 뒤 entered를 켜서 진입 트랜지션을 트리거.
		// (순수 CSS라면 @starting-style이 할 일을 JS로 대체)
		requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
		onOpen?.();
	};

	const close = () => {
		// 슬라이드-아웃을 먼저 돌리고, 트랜지션이 끝나면 Content에서 dialog.close()를 호출한다.
		setEntered(false);
		// 모션이 없으면 transitionend가 발생하지 않으므로 즉시 닫는다.
		if (reducedMotion) dialog.current?.close();
	};

	// 네이티브 close(우리 close, Escape 모두) 발생 시 상태를 동기화한다.
	const handleClose = () => {
		setIsOpen(false);
		setEntered(false);
		onClose?.();
	};

	return (
		<DrawerContext
			value={{
				dialog,
				isOpen,
				entered,
				reducedMotion,
				placement,
				contentId: resolvedId,
				open,
				close,
				handleClose,
			}}
		>
			{children}
		</DrawerContext>
	);
};

export type DrawerTriggerProps = ElementFnChildren<{ open: () => void }>;

const Trigger = ({ children }: DrawerTriggerProps) => {
	const { contentId, open, isOpen } = useCtx(DrawerContext);

	if (typeof children === "function") return children({ open });

	return cloneSingleElement(children as ClickableElement, {
		onClick: open,
		"aria-expanded": isOpen,
		"aria-controls": contentId,
	});
};

export type DrawerCloserProps = ElementFnChildren<{ close: () => void }>;

const Closer = ({ children }: DrawerCloserProps) => {
	const { close } = useCtx(DrawerContext);

	if (typeof children === "function") return children({ close });

	return cloneElement(children as ClickableElement, { onClick: close });
};

export type DrawerContentProps = ComponentPropsWithoutRef<"dialog">;

const Content = ({
	children,
	style,
	onClick,
	onCancel,
	onClose,
	onTransitionEnd,
	...props
}: DrawerContentProps) => {
	const {
		dialog,
		entered,
		reducedMotion,
		placement,
		contentId,
		close,
		handleClose,
	} = useCtx(DrawerContext);

	const slide = SLIDE_TRANSFORMS[placement];

	// 네이티브 dialog의 UA 기본 스타일(가운데 정렬 margin:auto, padding, border,
	// background, max-width/height)을 리셋하고, placement에 맞춰 한쪽 가장자리에 고정한다.
	// 기존의 position:fixed + PLACEMENT_ANCHOR + 수동 z-index 역할을 대체.
	const contentStyle: CSSProperties = {
		position: "fixed",
		margin: 0,
		padding: 0,
		border: "none",
		background: "transparent",
		maxWidth: "none",
		maxHeight: "none",
		...PLACEMENT_ANCHOR[placement],
		transform: entered ? slide.to : slide.from,
		transition: reducedMotion ? "none" : `transform 250ms ${CUBIC_BEZIER}`,
		...style,
	};

	// (기존 dim <div>의 onClick 대체) ::backdrop엔 핸들러를 못 달기 때문에,
	// 클릭 좌표가 패널 rect 밖이면 backdrop 클릭으로 간주해 닫는다.
	// rect 기반이라 패널 내부의 빈 영역을 클릭해도 닫히지 않는다.
	const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
		onClick?.(e);
		const rect = dialog.current?.getBoundingClientRect();
		if (!rect) return;
		const outside =
			e.clientX < rect.left ||
			e.clientX > rect.right ||
			e.clientY < rect.top ||
			e.clientY > rect.bottom;
		if (outside) close();
	};

	// Escape의 기본 즉시 닫힘을 막고 슬라이드-아웃 후 닫는다.
	const handleCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
		onCancel?.(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
		close();
	};

	const handleNativeClose = (e: SyntheticEvent<HTMLDialogElement>) => {
		onClose?.(e);
		handleClose();
	};

	// 슬라이드-아웃이 끝난 시점에 실제로 dialog를 닫는다(close 타이밍을 JS로 제어하는 핵심).
	// 자식에서 버블링된 transition이나 transform 외 속성은 무시.
	const handleTransitionEnd = (e: TransitionEvent<HTMLDialogElement>) => {
		onTransitionEnd?.(e);
		if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
		if (!entered) dialog.current?.close();
	};

	// 기존 <Portal> + dim <div> + role="dialog"/aria-modal 수동 부여를 모두 대체한다.
	// <dialog>는 항상 트리에 있고, 닫힘 상태에선 UA의 display:none으로 자동 숨김.
	return (
		<dialog
			{...props}
			ref={dialog}
			id={contentId}
			data-slot="content"
			data-placement={placement}
			style={contentStyle}
			onClick={handleClick}
			onCancel={handleCancel}
			onClose={handleNativeClose}
			onTransitionEnd={handleTransitionEnd}
		>
			{children}
		</dialog>
	);
};

export const Drawer = Object.assign(DrawerRoot, {
	Trigger,
	Content,
	Closer,
});

const CUBIC_BEZIER = "cubic-bezier(0.32, 0.72, 0, 1)";

const SLIDE_TRANSFORMS: Record<Placement, { from: string; to: string }> = {
	right: { from: "translateX(100%)", to: "translateX(0)" },
	left: { from: "translateX(-100%)", to: "translateX(0)" },
	top: { from: "translateY(-100%)", to: "translateY(0)" },
	bottom: { from: "translateY(100%)", to: "translateY(0)" },
};

// inset 단축으로 modal dialog의 UA 기본값(inset:0; margin:auto 중앙 정렬)을 덮어쓴다.
// 고정할 두 변은 0, 떨어뜨릴 변은 auto → 한쪽 가장자리에 붙고 교차축은 꽉 채워진다.
const PLACEMENT_ANCHOR: Record<Placement, CSSProperties> = {
	right: { inset: "0 0 0 auto" },
	left: { inset: "0 auto 0 0" },
	top: { inset: "0 0 auto 0" },
	bottom: { inset: "auto 0 0 0" },
};

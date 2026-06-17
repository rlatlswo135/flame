"use client";

import {
	type ComponentPropsWithoutRef,
	type CSSProperties,
	cloneElement,
	type KeyboardEvent,
	type PropsWithChildren,
	type RefObject,
	useRef,
	useState,
} from "react";
import type { ClickableElement, ElementFnChildren } from "@/core/types";
import { useCtx } from "@/hooks/use-ctx";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useResolvedId } from "@/hooks/use-resolved-id";
import { Portal } from "@/primitives/portal";
import { DrawerContext } from "./context";

type Placement = "top" | "right" | "bottom" | "left";

let globalZIndex = 0;

export type DrawerProps = PropsWithChildren<{
	contentId?: string;
	placement?: Placement;
	onOpen?: () => void;
	onClose?: () => void;
}>;

const DrawerRoot = ({
	placement = "right",
	onOpen,
	onClose,
	children,
	contentId,
}: DrawerProps) => {
	const resolvedId = useResolvedId(contentId);

	const [baseZIndex, setBaseZIndex] = useState(0);
	const [isOpen, setIsOpen] = useState(false);

	const open = () => {
		setBaseZIndex(++globalZIndex);
		setIsOpen(true);
		onOpen?.();
	};

	const close = () => {
		globalZIndex = Math.max(0, globalZIndex - 1);
		setIsOpen(false);
		onClose?.();
	};

	return (
		<DrawerContext
			value={{
				open,
				close,
				isOpen,
				placement,
				baseZIndex: MODAL_Z_BASE + baseZIndex * 10,
				contentId: resolvedId,
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

	return cloneElement(children as ClickableElement, {
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

export type DrawerContentProps = ComponentPropsWithoutRef<"div"> & {
	ref?: RefObject<HTMLDivElement | null>;
};

const Content = ({
	children,
	onKeyDown,
	ref: refProp,
	...props
}: DrawerContentProps) => {
	const innerRef = useRef<HTMLDivElement>(null);
	const ref = refProp ?? innerRef;

	const reducedMotion = usePrefersReducedMotion();

	const { isOpen, close, placement, contentId, baseZIndex } =
		useCtx(DrawerContext);

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		onKeyDown?.(e);
		if (e.key !== "Escape") return;
		e.stopPropagation();
		close();
	};

	useFocusTrap(ref, isOpen);

	const slide = SLIDE_TRANSFORMS[placement];

	const dimStyle: CSSProperties = {
		inset: 0,
		position: "fixed",
		zIndex: baseZIndex + 1,
		opacity: isOpen ? 1 : 0,
		pointerEvents: isOpen ? "auto" : "none",
		transition: reducedMotion ? "none" : `opacity 250ms ${CUBIC_BEZIER}`,
	};

	const contentStyle: CSSProperties = {
		position: "fixed",
		...PLACEMENT_ANCHOR[placement],
		zIndex: baseZIndex + 2,
		transform: isOpen ? slide.to : slide.from,
		visibility: isOpen ? "visible" : "hidden",
		transition: reducedMotion
			? "none"
			: `transform 250ms ${CUBIC_BEZIER}, visibility 250ms ${CUBIC_BEZIER}`,
		...props.style,
	};

	return (
		<Portal>
			<div style={{ zIndex: baseZIndex }}>
				{/* biome-ignore lint/a11y/noStaticElementInteractions: dim is a redundant mouse-only close affordance; keyboard users close via Escape */}
				<div data-slot="dim" onClick={close} style={dimStyle} />
				<div
					{...props}
					ref={ref}
					id={contentId}
					role="dialog"
					aria-modal="true"
					data-slot="content"
					data-placement={placement}
					style={contentStyle}
					onKeyDown={handleKeyDown}
				>
					{children}
				</div>
			</div>
		</Portal>
	);
};

export const Drawer = Object.assign(DrawerRoot, {
	Trigger,
	Content,
	Closer,
});

const MODAL_Z_BASE = 1000;

const CUBIC_BEZIER = "cubic-bezier(0.32, 0.72, 0, 1)";

const SLIDE_TRANSFORMS: Record<Placement, { from: string; to: string }> = {
	right: { from: "translateX(100%)", to: "translateX(0)" },
	left: { from: "translateX(-100%)", to: "translateX(0)" },
	top: { from: "translateY(-100%)", to: "translateY(0)" },
	bottom: { from: "translateY(100%)", to: "translateY(0)" },
};

const PLACEMENT_ANCHOR: Record<Placement, CSSProperties> = {
	right: { top: 0, right: 0, height: "100%" },
	left: { top: 0, left: 0, height: "100%" },
	top: { top: 0, left: 0, width: "100%" },
	bottom: { bottom: 0, left: 0, width: "100%" },
};

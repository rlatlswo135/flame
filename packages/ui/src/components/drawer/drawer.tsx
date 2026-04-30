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
import { createPortal } from "react-dom";
import { useCtx } from "@/src/hooks/use-ctx";
import { useExitTransition } from "@/src/hooks/use-exit-transition";
import { useFocusTrap } from "@/src/hooks/use-focus-trap";
import { useMounted } from "@/src/hooks/use-mounted";
import { useResolvedId } from "@/src/hooks/use-resolved-id";
import type { ClickableElement, ElementFnChildren } from "@/src/types";
import { DrawerContext } from "./context";

type Placement = "top" | "right" | "bottom" | "left";

type DrawerProps = PropsWithChildren<{
	contentId?: string;
	placement?: Placement;
	onOpen?: () => void;
	onClose?: () => void;
}>;

type DrawerTriggerProps = ElementFnChildren<{ open: () => void }>;

type DrawerCloserProps = ElementFnChildren<{ close: () => void }>;

type DrawerContentProps = ComponentPropsWithoutRef<"div"> & {
	ref?: RefObject<HTMLDivElement | null>;
};

const MODAL_Z_BASE = 1000;
let globalZIndex = 0;

const TRANSITION = "250ms cubic-bezier(0.32, 0.72, 0, 1)";

const SLIDE_TRANSFORMS: Record<Placement, { from: string; to: string }> = {
	right: { from: "translateX(100%)", to: "translateX(0)" },
	left: { from: "translateX(-100%)", to: "translateX(0)" },
	top: { from: "translateY(-100%)", to: "translateY(0)" },
	bottom: { from: "translateY(100%)", to: "translateY(0)" },
};

const Drawer = ({
	placement = "right",
	onOpen,
	onClose,
	children,
	contentId,
}: DrawerProps) => {
	const resolvedId = useResolvedId(contentId);

	const [baseZIndex, setBaseZIndex] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const { mounted, status, transitionRef } = useExitTransition(isOpen);

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
				status,
				mounted,
				transitionRef,
			}}
		>
			{children}
		</DrawerContext>
	);
};

const Trigger = ({ children }: DrawerTriggerProps) => {
	const { contentId, open, isOpen } = useCtx(DrawerContext);

	if (typeof children === "function") return children({ open });

	return cloneElement(children as ClickableElement, {
		onClick: open,
		"aria-expanded": isOpen,
		"aria-controls": contentId,
	});
};

const Closer = ({ children }: DrawerCloserProps) => {
	const { close } = useCtx(DrawerContext);

	if (typeof children === "function") return children({ close });

	return cloneElement(children as ClickableElement, { onClick: close });
};

const Content = ({ children, ref: refProp, ...props }: DrawerContentProps) => {
	const innerRef = useRef<HTMLDivElement>(null);
	const ref = refProp ?? innerRef;

	const isMounted = useMounted();

	const {
		isOpen,
		close,
		placement,
		contentId,
		baseZIndex,
		status,
		mounted,
		transitionRef,
	} = useCtx(DrawerContext);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key !== "Escape") return;
		if (status === "exiting") return;
		e.stopPropagation();
		close();
	};

	useFocusTrap(
		ref,
		(status === "entering" || status === "entered") && isMounted,
	);

	if (!mounted || !isMounted) return null;

	const isVisible = status === "entering" || status === "entered";
	const slide = SLIDE_TRANSFORMS[placement];

	const dimStyle: CSSProperties = {
		inset: 0,
		position: "fixed",
		zIndex: baseZIndex + 1,
		opacity: isVisible ? 1 : 0,
		transition: `opacity ${TRANSITION}`,
	};

	const contentStyle: CSSProperties = {
		zIndex: baseZIndex + 2,
		transform: isVisible ? slide.to : slide.from,
		transition: `transform ${TRANSITION}`,
		...props.style,
	};

	return createPortal(
		// biome-ignore lint/a11y/noStaticElementInteractions: wrapper
		<div ref={ref} style={{ zIndex: baseZIndex }} onKeyDown={handleKeyDown}>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: dim is a redundant mouse-only close affordance; keyboard users close via Escape */}
			<div data-slot="dim" onClick={close} style={dimStyle} />
			<div
				{...props}
				ref={transitionRef as RefObject<HTMLDivElement>}
				id={contentId}
				role="dialog"
				aria-modal="true"
				data-slot="content"
				data-placement={placement}
				style={contentStyle}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
};

Trigger.displayName = "Drawer.Trigger";
Content.displayName = "Drawer.Content";
Closer.displayName = "Drawer.Closer";

Drawer.Trigger = Trigger;
Drawer.Content = Content;
Drawer.Closer = Closer;

export {
	Drawer,
	type DrawerProps,
	type DrawerTriggerProps,
	type DrawerCloserProps,
	type DrawerContentProps,
};

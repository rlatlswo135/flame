"use client";

import {
	type ComponentPropsWithoutRef,
	cloneElement,
	type PropsWithChildren,
	type RefObject,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { useCtx } from "@/src/hooks/use-ctx";
import { useFocusTrap } from "@/src/hooks/use-focus-trap";
import { useKeyDown } from "@/src/hooks/use-key-down";
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

let globalZIndex = 0;

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

	const open = () => {
		setBaseZIndex(++globalZIndex);
		setIsOpen(true);
		onOpen?.();
	};

	const close = () => {
		--globalZIndex;
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
				baseZIndex: baseZIndex * 10,
				contentId: resolvedId,
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

	const { isOpen, close, placement, contentId, baseZIndex } =
		useCtx(DrawerContext);

	useFocusTrap(ref, isOpen && isMounted);
	useKeyDown({
		key: "Escape",
		handler: close,
		enabled: isOpen && isMounted,
		target: ref.current!,
	});

	if (!isOpen || !isMounted) return null;

	return createPortal(
		<div ref={ref} style={{ zIndex: baseZIndex }}>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: dim is a redundant mouse-only close affordance; keyboard users close via Escape */}
			<div
				data-slot="dim"
				onClick={close}
				style={{ inset: 0, position: "fixed", zIndex: baseZIndex + 1 }}
			/>
			<div
				{...props}
				id={contentId}
				role="dialog"
				aria-modal="true"
				data-slot="content"
				data-placement={placement}
				style={{ zIndex: baseZIndex + 2, ...props.style }}
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

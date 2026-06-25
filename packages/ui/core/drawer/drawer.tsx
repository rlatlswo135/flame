"use client";

import {
	type ComponentPropsWithoutRef,
	type PropsWithChildren,
	type SyntheticEvent,
	useRef,
	useState,
} from "react";
import type { ElementFnChildren } from "@/core/types";
import { useCtx } from "@/hooks/use-ctx";
import { useResolvedId } from "@/hooks/use-resolved-id";
import { cloneSingleElement, prefersReducedMotion } from "../utils";
import { DrawerContext } from "./context";

type Placement = "top" | "right" | "bottom" | "left";

type DrawerAnimation = {
	enter: Keyframe[];
	exit: Keyframe[];
	options?: KeyframeAnimationOptions;
};

export type DrawerProps = {
	id?: string;
	placement?: Placement;
	closeOutside?: boolean;
	keepMounted?: boolean;
	animation?: DrawerAnimation | false;
	onOpen?: () => void;
	onClose?: () => void;
};

const DrawerRoot = ({
	keepMounted = true,
	closeOutside = false,
	placement = "right",
	animation,
	id,
	onOpen,
	onClose,
	children,
}: PropsWithChildren<DrawerProps>) => {
	const contentId = useResolvedId(id);
	const dialog = useRef<HTMLDialogElement>(null);

	const [isOpen, setIsOpen] = useState(false);

	const resolvedAnimation =
		animation === false ? null : (animation ?? getDefaultAnimation(placement));

	const animate = (keyframes: Keyframe[]) => {
		if (!resolvedAnimation || !dialog.current || prefersReducedMotion())
			return null;

		const currentAnimations = dialog.current.getAnimations();
		currentAnimations.forEach((a) => {
			a.cancel();
		});

		return dialog.current.animate(keyframes, resolvedAnimation.options);
	};

	const open = () => {
		if (!keepMounted) setIsOpen(true);

		dialog.current?.showModal();
		animate(resolvedAnimation?.enter ?? []);
		onOpen?.();
	};

	const close = () => {
		const exiting = animate(resolvedAnimation?.exit ?? []);

		if (exiting) {
			exiting.finished.then(() => dialog.current?.close()).catch(() => {});
		} else {
			dialog.current?.close();
		}
	};

	return (
		<DrawerContext
			value={{
				open,
				dialog,
				close,
				isOpen,
				onClose,
				setIsOpen,
				placement,
				closeOutside,
				keepMounted,
				contentId,
			}}
		>
			{children}
		</DrawerContext>
	);
};

export type DrawerTriggerProps = ElementFnChildren<{ open: () => void }>;

const Trigger = ({ children }: DrawerTriggerProps) => {
	const { open } = useCtx(DrawerContext);

	if (typeof children === "function") return children({ open });

	return cloneSingleElement(children, { onClick: open });
};

export type DrawerCloserProps = ElementFnChildren<{ close: () => void }>;

const Closer = ({ children }: DrawerCloserProps) => {
	const { close } = useCtx(DrawerContext);

	if (typeof children === "function") return children({ close });

	return cloneSingleElement(children, { onClick: close });
};

export type DrawerContentProps = Omit<
	ComponentPropsWithoutRef<"dialog">,
	"onClose" | "onClick"
>;

const Content = ({ children, style, ...props }: DrawerContentProps) => {
	const ctx = useCtx(DrawerContext);

	const handleClose = () => {
		if (!ctx.keepMounted) ctx.setIsOpen(false);
		ctx.onClose?.();
	};

	const handleClick = () => {
		if (!ctx.closeOutside) return;
		ctx.close();
	};

	// ESC는 native dialog를 즉시 닫아 exit 애니를 건너뛴다 — 가로채 ctx.close()로 위임한다.
	// 중첩 시 cancel이 React 트리를 타고 부모 Drawer까지 버블되므로 전파를 끊는다.
	const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
		event.preventDefault();
		event.stopPropagation();
		ctx.close();
	};

	const placementStyle = {
		top: { width: "100%", "margin-top": 0 },
		bottom: { width: "100%", "margin-bottom": 0 },
		left: { height: "100%", "margin-left": 0 },
		right: { height: "100%", "margin-right": 0 },
	};

	return (
		<dialog
			id={ctx.contentId}
			ref={ctx.dialog}
			onClick={handleClick}
			data-placement={ctx.placement}
			style={{
				maxHeight: "100%",
				maxWidth: "100%",
				...placementStyle[ctx.placement],
				...style,
			}}
			{...props}
			onCancel={handleCancel}
			onClose={handleClose}
		>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: need to outside-click */}
			<section onClick={(e) => e.stopPropagation()}>
				{(ctx.keepMounted || ctx.isOpen) && children}
			</section>
		</dialog>
	);
};

export const Drawer = Object.assign(DrawerRoot, {
	Trigger,
	Content,
	Closer,
});

const getDefaultAnimation = (placement: Placement): DrawerAnimation => {
	const fromTo = {
		left: "translateX(-100%) translateX(0)",
		right: "translateX(100%) translateX(0)",
		top: "translateY(-100%) translateY(0)",
		bottom: "translateY(100%) translateY(0)",
	};

	const [hidden, shown] = fromTo[placement].split(" ");

	return {
		enter: [{ transform: hidden }, { transform: shown }],
		exit: [{ transform: shown }, { transform: hidden }],
		options: { duration: 250, easing: "ease-out" },
	};
};

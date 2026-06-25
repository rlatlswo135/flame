"use client";

import {
	type ComponentPropsWithoutRef,
	type PropsWithChildren,
	useRef,
	useState,
} from "react";
import type { ElementFnChildren } from "@/core/types";
import { useCtx } from "@/hooks/use-ctx";
import { useResolvedId } from "@/hooks/use-resolved-id";
import { cloneSingleElement } from "../utils";
import { DrawerContext } from "./context";

type Placement = "top" | "right" | "bottom" | "left";

export type DrawerProps = {
	id?: string;
	placement?: Placement;
	closeOutside?: boolean;
	keepMounted?: boolean;
	onOpen?: () => void;
	onClose?: () => void;
};

const DrawerRoot = ({
	keepMounted = true,
	closeOutside = false,
	placement = "right",
	id,
	onOpen,
	onClose,
	children,
}: PropsWithChildren<DrawerProps>) => {
	const contentId = useResolvedId(id);
	const dialog = useRef<HTMLDialogElement>(null);

	const [isOpen, setIsOpen] = useState(false);

	const open = () => {
		if (!keepMounted) setIsOpen(true);

		dialog.current?.showModal();
		onOpen?.();
	};

	const close = () => {
		dialog.current?.close();
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

const Content = ({ children, ...props }: DrawerContentProps) => {
	const ctx = useCtx(DrawerContext);

	const handleClose = () => {
		if (!ctx.keepMounted) ctx.setIsOpen(false);
		ctx.onClose?.();
	};

	const handleClick = () => {
		if (!ctx.closeOutside) return;
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
			}}
			{...props}
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

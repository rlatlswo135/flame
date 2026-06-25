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
import { DialogContext } from "./context";

export type DialogRootProps = {
	id?: string;
	closeOutside?: boolean;
	keepMounted?: boolean;
	onOpen?: () => void;
	onClose?: () => void;
};

const DialogRoot = ({
	closeOutside = false,
	keepMounted = false,
	id,
	onOpen,
	onClose,
	children,
}: PropsWithChildren<DialogRootProps>) => {
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

	const context = {
		open,
		dialog,
		close,
		isOpen,
		onClose,
		setIsOpen,
		closeOutside,
		keepMounted,
		contentId,
	};

	return <DialogContext value={context}>{children}</DialogContext>;
};

export type DialogTriggerProps = ElementFnChildren<{ open: () => void }>;

const Trigger = ({ children }: DialogTriggerProps) => {
	const { open } = useCtx(DialogContext);

	if (typeof children === "function") return children({ open });

	return cloneSingleElement(children, {
		onClick: open,
		"aria-haspopup": "dialog",
	});
};

export type DialogCloserProps = ElementFnChildren<{ close: () => void }>;

const Closer = ({ children }: DialogCloserProps) => {
	const { close } = useCtx(DialogContext);

	if (typeof children === "function") return children({ close });

	return cloneSingleElement(children, { onClick: close });
};

export type DialogContentProps = Omit<
	ComponentPropsWithoutRef<"dialog">,
	"onClose"
>;

const Content = ({ children, ...props }: DialogContentProps) => {
	const ctx = useCtx(DialogContext);

	const handleClose = () => {
		if (!ctx.keepMounted) ctx.setIsOpen(false);
		ctx?.onClose?.();
	};

	const handleClick = () => {
		if (!ctx.closeOutside) return;
		ctx.close();
	};

	return (
		<dialog
			id={ctx.contentId}
			ref={ctx.dialog}
			onClick={handleClick}
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

export const Dialog = Object.assign(DialogRoot, {
	Trigger,
	Content,
	Closer,
});

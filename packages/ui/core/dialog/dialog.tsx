"use client";

import {
	type ComponentPropsWithoutRef,
	cloneElement,
	type PropsWithChildren,
	useRef,
	useState,
} from "react";
import type { ClickableElement, ElementFnChildren } from "@/core/types";
import { useCtx } from "@/hooks/use-ctx";
import { useResolvedId } from "@/hooks/use-resolved-id";
import { DialogContext } from "./context";

export type DialogRootProps = PropsWithChildren<{
	closeOutside?: boolean;
	keepMounted?: boolean;
}>;

const DialogRoot = ({
	children,
	closeOutside = false,
	keepMounted = false,
}: DialogRootProps) => {
	const contentId = useResolvedId();
	const dialog = useRef<HTMLDialogElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	const open = () => {
		dialog.current?.showModal();
		if (!keepMounted) setIsOpen(true);
	};

	const close = () => {
		dialog.current?.close();
	};

	const context = {
		open,
		dialog,
		close,
		isOpen,
		setIsOpen,
		closeOutside,
		keepMounted,
		contentId,
	};

	return <DialogContext value={context}>{children}</DialogContext>;
};

export type DialogTriggerProps = ElementFnChildren<{ open: () => void }>;

const Trigger = ({ children }: DialogTriggerProps) => {
	const { open, isOpen, contentId } = useCtx(DialogContext);

	if (typeof children === "function") return children({ open });

	return cloneElement(children as ClickableElement, {
		onClick: open,
		"aria-expanded": isOpen,
		"aria-controls": contentId,
	});
};

export type DialogCloserProps = ElementFnChildren<{ close: () => void }>;

const Closer = ({ children }: DialogCloserProps) => {
	const { close } = useCtx(DialogContext);

	if (typeof children === "function") return children({ close });

	return cloneElement(children as ClickableElement, { onClick: close });
};

export type DialogContentProps = ComponentPropsWithoutRef<"dialog">;

const Content = ({ children, ...props }: DialogContentProps) => {
	const ctx = useCtx(DialogContext);

	const onClose = (e: React.SyntheticEvent<HTMLDialogElement>) => {
		if (!ctx.keepMounted) ctx.setIsOpen(false);
		props?.onClose?.(e);
	};

	return (
		<dialog
			id={ctx.contentId}
			ref={ctx.dialog}
			onClick={ctx.closeOutside ? ctx.close : undefined}
			aria-hidden={!ctx.isOpen}
			{...props}
			onClose={onClose}
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

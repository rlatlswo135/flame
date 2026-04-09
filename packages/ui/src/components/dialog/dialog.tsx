"use client";

import {
	type ComponentPropsWithoutRef,
	cloneElement,
	type PropsWithChildren,
	useRef,
	useState,
} from "react";
import { useCtx } from "@/src/hooks/use-ctx";
import type { ClickableElement, ElementFnChildren } from "@/src/types";
import { DialogContext } from "./context";

type DialogProps = PropsWithChildren<{
	closeOutside?: boolean;
	keepMounted?: boolean;
}>;

type DialogTriggerProps = ElementFnChildren<{ open: () => void }>;

type DialogCloserProps = ElementFnChildren<{ close: () => void }>;

type DialogContentProps = ComponentPropsWithoutRef<"dialog">;

const Dialog = ({
	children,
	closeOutside = false,
	keepMounted = false,
}: DialogProps) => {
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
	};

	return <DialogContext value={context}>{children}</DialogContext>;
};

const Trigger = ({ children }: DialogTriggerProps) => {
	const { open, isOpen } = useCtx(DialogContext);

	if (typeof children === "function") return children({ open });

	return cloneElement(children as ClickableElement, {
		onClick: open,
		"aria-expanded": isOpen,
	});
};

const Closer = ({ children }: DialogCloserProps) => {
	const { close } = useCtx(DialogContext);

	if (typeof children === "function") return children({ close });

	return cloneElement(children as ClickableElement, { onClick: close });
};

const Content = ({ children, ...props }: DialogContentProps) => {
	const ctx = useCtx(DialogContext);

	const onClose = (e: React.SyntheticEvent<HTMLDialogElement>) => {
		if (!ctx.keepMounted) ctx.setIsOpen(false);
		props?.onClose?.(e);
	};

	return (
		<dialog
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

Trigger.displayName = "Dialog.Trigger";
Content.displayName = "Dialog.Content";
Closer.displayName = "Dialog.Closer";

Dialog.Trigger = Trigger;
Dialog.Content = Content;
Dialog.Closer = Closer;

export {
	Dialog,
	type DialogProps,
	type DialogTriggerProps,
	type DialogCloserProps,
	type DialogContentProps,
};

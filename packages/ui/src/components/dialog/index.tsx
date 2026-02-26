import {
	cloneElement,
	type DialogHTMLAttributes,
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

	return (
		<DialogContext
			value={{
				open,
				dialog,
				close,
				isOpen,
				setIsOpen,
				closeOutside,
				keepMounted,
			}}
		>
			{children}
		</DialogContext>
	);
};

const Trigger = ({ children }: ElementFnChildren<{ open: () => void }>) => {
	const { open } = useCtx(DialogContext);

	if (typeof children === "function") return children({ open });

	return cloneElement(children as ClickableElement, { onClick: open });
};

const Closer = ({ children }: ElementFnChildren<{ close: () => void }>) => {
	const { close } = useCtx(DialogContext);

	if (typeof children === "function") return children({ close });

	return cloneElement(children as ClickableElement, { onClick: close });
};

const Content = ({
	children,
	...props
}: PropsWithChildren<DialogHTMLAttributes<HTMLDialogElement>>) => {
	const ctx = useCtx(DialogContext);

	const onClose = (e: React.SyntheticEvent<HTMLDialogElement>) => {
		if (!ctx.keepMounted) ctx.setIsOpen(false);
		props?.onClose?.(e);
	};

	return (
		<dialog
			ref={ctx.dialog}
			onClick={ctx.closeOutside ? ctx.close : undefined}
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

Dialog.Trigger = Trigger;
Dialog.Content = Content;
Dialog.Closer = Closer;

export { Dialog, type DialogProps };

import { type ComponentPropsWithRef, useId, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useCtx } from "@/src/hooks/use-ctx";
import { ToastContext } from "./context";
import { toastStore } from "./store";

type ToasterProps = {
	placement?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
} & ComponentPropsWithRef<"section">;

type ToastProps = ComponentPropsWithRef<"div">;
type ToastTitleProps = ComponentPropsWithRef<"div">;
type ToastDescriptionProps = ComponentPropsWithRef<"div">;

const placementStyle = {
	"top-left": { top: "10px", left: "10px" },
	"top-right": { top: "10px", right: "10px" },
	"bottom-left": { bottom: "10px", left: "10px" },
	"bottom-right": { bottom: "10px", right: "10px" },
};

// TODO: maximum toast, animation, etc.
const Toaster = ({
	placement = "bottom-left",
	style,
	...props
}: ToasterProps) => {
	const toast = useSyncExternalStore(
		toastStore.subscribe,
		toastStore.getSnapshot,
	);

	const onClickToast = (id: number) => {
		toastStore.remove(id);
		toastStore.signal();
	};

	return createPortal(
		<section
			style={{
				inset: 0,
				position: "fixed",
				pointerEvents: "none",
				...style,
			}}
			{...props}
			data-toast-container
			aria-label="notifications"
		>
			{toast.map((i) => (
				// biome-ignore lint/a11y/noStaticElementInteractions: this is a toast wrapper
				<div
					key={i.id}
					style={{ pointerEvents: "auto", ...placementStyle[placement] }}
					onClick={() => onClickToast(i.id)}
				>
					{i.content}
				</div>
			))}
		</section>,
		document.body,
	);
};

const Toast = ({ children, ...props }: ToastProps) => {
	const id = useId();

	return (
		<ToastContext value={{ id }}>
			{/** biome-ignore lint/a11y/useSemanticElements: role="status" has no exact HTML equivalent */}
			<div
				{...props}
				role="status"
				aria-live="polite"
				aria-labelledby={`toast-title-${id}`}
				aria-describedby={`toast-desc-${id}`}
			>
				{children}
			</div>
		</ToastContext>
	);
};

const Title = ({ children, ...props }: ToastTitleProps) => {
	const { id } = useCtx(ToastContext);

	return (
		<div id={`toast-title-${id}`} {...props}>
			{children}
		</div>
	);
};

const Description = ({ children, ...props }: ToastDescriptionProps) => {
	const { id } = useCtx(ToastContext);
	return (
		<div id={`toast-desc-${id}`} {...props}>
			{children}
		</div>
	);
};

Title.displayName = "Toast.Title";
Description.displayName = "Toast.Description";

Toast.Title = Title;
Toast.Description = Description;

export {
	Toaster,
	Toast,
	type ToastProps,
	type ToastTitleProps,
	type ToastDescriptionProps,
};

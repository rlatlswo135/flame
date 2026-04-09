"use client";

import {
	type ComponentPropsWithRef,
	useId,
	useRef,
	useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { useCtx } from "@/src/hooks/use-ctx";
import { useMounted } from "@/src/hooks/use-mounted";
import { ToastContext } from "./context";
import { type ToastAnimation, toastStore } from "./store";

type ToasterProps = {
	placement?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	animation?: ToastAnimation | false;
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

const getDefaultAnimation = (placement: string): ToastAnimation => {
	const offset = placement.startsWith("top") ? "-20px" : "20px";
	return {
		enter: [
			{ transform: `translateY(${offset})`, opacity: 0 },
			{ transform: "translateY(0)", opacity: 1 },
		],
		exit: [
			{ transform: "translateY(0)", opacity: 1 },
			{ transform: `translateY(${offset})`, opacity: 0 },
		],
		options: { duration: 250, easing: "ease-out" },
	};
};

const Toaster = ({
	placement = "bottom-left",
	animation,
	style,
	...props
}: ToasterProps) => {
	const isMounted = useMounted();
	const elMap = useRef<Map<number, HTMLDivElement>>(new Map());

	const resolvedAnimation =
		animation === false ? null : (animation ?? getDefaultAnimation(placement));

	const toasts = useSyncExternalStore(
		toastStore.subscribe,
		toastStore.getSnapshot,
		toastStore.getSnapshot,
	);

	const exitToast = async (id: number) => {
		const el = elMap.current.get(id);
		if (el && resolvedAnimation) {
			await el.animate(resolvedAnimation.exit, resolvedAnimation.options)
				.finished;
		}
		elMap.current.delete(id);
		toastStore.remove(id);
		toastStore.signal();
	};

	const onRefMount = (
		id: number,
		status: string,
		el: HTMLDivElement | null,
	) => {
		if (!el) return;

		if (status === "exiting") {
			exitToast(id);
			return;
		}

		if (!elMap.current.has(id)) {
			elMap.current.set(id, el);
			if (resolvedAnimation) {
				el.animate(resolvedAnimation.enter, resolvedAnimation.options);
			}
		}
	};

	if (!isMounted) return null;

	return createPortal(
		<section
			style={{
				inset: 0,
				position: "fixed",
				pointerEvents: "none",
			}}
			{...props}
			data-toast-container
			aria-label="notifications"
		>
			<div
				style={{
					gap: 8,
					display: "flex",
					position: "absolute",
					flexDirection: "column",
					...style,
					...placementStyle[placement],
				}}
			>
				{toasts.map((i) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: this is a toast wrapper
					<div
						key={i.id}
						ref={(el) => onRefMount(i.id, i.status, el)}
						style={{ pointerEvents: "auto" }}
						onClick={() => exitToast(i.id)}
					>
						{i.content}
					</div>
				))}
			</div>
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
	type ToasterProps,
	type ToastProps,
	type ToastTitleProps,
	type ToastDescriptionProps,
};

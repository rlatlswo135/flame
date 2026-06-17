"use client";

import {
	type ComponentPropsWithRef,
	useRef,
	useSyncExternalStore,
} from "react";
import { useCtx } from "@/hooks/use-ctx";
import { useResolvedId } from "@/hooks/use-resolved-id";
import { Portal } from "@/primitives/portal";
import { ToastContext } from "./context";
import { type ToastAnimation, toastStore } from "./store";

export type ToasterProps = {
	placement?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	animation?: ToastAnimation | false;
} & ComponentPropsWithRef<"section">;

export const Toaster = ({
	placement = "bottom-left",
	animation,
	style,
	...props
}: ToasterProps) => {
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

	return (
		<Portal>
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
			</section>
		</Portal>
	);
};

export type ToastRootProps = ComponentPropsWithRef<"div">;

const ToastRoot = ({ children, ...props }: ToastRootProps) => {
	const id = useResolvedId();

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

export type ToastTitleProps = ComponentPropsWithRef<"div">;

const Title = ({ children, ...props }: ToastTitleProps) => {
	const { id } = useCtx(ToastContext);

	return (
		<div id={`toast-title-${id}`} {...props}>
			{children}
		</div>
	);
};

export type ToastDescriptionProps = ComponentPropsWithRef<"div">;

const Description = ({ children, ...props }: ToastDescriptionProps) => {
	const { id } = useCtx(ToastContext);
	return (
		<div id={`toast-desc-${id}`} {...props}>
			{children}
		</div>
	);
};

export const Toast = Object.assign(ToastRoot, {
	Title,
	Description,
});

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

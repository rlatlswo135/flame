"use client";

import type {
	UseFloatingReturn,
	UseInteractionsReturn,
} from "@floating-ui/react";
import {
	type CSSProperties,
	cloneElement,
	type PropsWithChildren,
} from "react";
import type { ElementFnChildren, OmitUnion } from "@/core/types";
import { useCtx } from "@/hooks/use-ctx";
import {
	type FloatingBaseProps,
	type FloatingTriggerProps,
	useFloatingBase,
} from "@/hooks/use-floating-base";
import { TooltipContext } from "./context";

export type TooltipRootProps = {
	enabled?: boolean;
} & OmitUnion<FloatingBaseProps, "hover" | "click" | "focus">;

const TooltipRoot = ({
	children,
	enabled = true,
	...props
}: PropsWithChildren<TooltipRootProps>) => {
	const base = useFloatingBase({
		...props,
		role: { role: "tooltip", ...props.role },
		hover: { enabled, move: false },
		focus: { enabled },
	});

	return <TooltipContext value={base}>{children}</TooltipContext>;
};

export type TooltipTriggerProps = FloatingTriggerProps;

const Trigger = ({ children }: TooltipTriggerProps) => {
	const { baseTriggerProps, interactions } = useCtx(TooltipContext);

	return cloneElement(
		children,
		interactions.getReferenceProps(baseTriggerProps),
	);
};

export type TooltipContentProps = ElementFnChildren<{
	interactions: UseInteractionsReturn;
	floating: UseFloatingReturn;
}>;

const Content = ({ children }: TooltipContentProps) => {
	const { floating, transition, interactions, baseContentProps } =
		useCtx(TooltipContext);

	const shouldMount = transition ? transition.isMounted : floating.context.open;

	if (!shouldMount) return null;

	if (typeof children === "function")
		return children({ floating, interactions });

	const { style, ...rest } = baseContentProps;
	const childStyle = (children.props as { style?: CSSProperties }).style;

	return cloneElement(
		children,
		interactions.getFloatingProps({
			...rest,
			style: { ...childStyle, ...style },
		}),
	);
};

export const Tooltip = Object.assign(TooltipRoot, {
	Trigger,
	Content,
});

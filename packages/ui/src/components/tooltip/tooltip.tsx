"use client";

import {
	type UseFloatingReturn,
	type UseInteractionsReturn,
	useInteractions,
} from "@floating-ui/react";
import {
	type CSSProperties,
	cloneElement,
	type PropsWithChildren,
	type ReactElement,
} from "react";
import { useCtx } from "@/src/hooks/use-ctx";
import {
	type FloatingBaseProps,
	useFloatingBase,
} from "@/src/hooks/use-floating-base";
import type { ElementFnChildren } from "@/src/types";
import { TooltipContext } from "./context";

type TooltipProps = PropsWithChildren<{
	enabled?: boolean;
}> &
	Omit<FloatingBaseProps, "hover" | "click" | "focus">;

type TooltipTriggerProps = {
	children: ReactElement;
};

type TooltipContentProps = ElementFnChildren<{
	interactions: UseInteractionsReturn;
	floating: UseFloatingReturn;
}>;

const Tooltip = ({ children, enabled = true, ...props }: TooltipProps) => {
	const base = useFloatingBase({
		...props,
		role: { role: "tooltip", ...props.role },
		hover: { enabled, move: false },
		focus: { enabled },
	});

	const interactions = useInteractions(base.getInteractions("hover", "focus"));

	return (
		<TooltipContext value={{ ...base, interactions }}>
			{children}
		</TooltipContext>
	);
};

const Trigger = ({ children }: TooltipTriggerProps) => {
	const { baseTriggerProps, interactions } = useCtx(TooltipContext);

	return cloneElement(
		children,
		interactions.getReferenceProps(baseTriggerProps),
	);
};

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

Tooltip.Trigger = Trigger;
Tooltip.Content = Content;

Trigger.displayName = "Tooltip.Trigger";
Content.displayName = "Tooltip.Content";

export {
	Tooltip,
	type TooltipProps,
	type TooltipTriggerProps,
	type TooltipContentProps,
};

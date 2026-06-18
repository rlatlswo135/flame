"use client";

import {
	type FlipOptions,
	flip,
	type OffsetOptions,
	offset,
	type Placement,
	type ShiftOptions,
	shift,
	type UseFloatingReturn,
	type UseHoverProps,
	type UseInteractionsReturn,
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
	placement?: Placement;
	flip?: FlipOptions;
	shift?: ShiftOptions;
	offset?: OffsetOptions;
	delay?: UseHoverProps["delay"];
} & OmitUnion<FloatingBaseProps, "hover" | "click" | "focus" | "role">;

const TooltipRoot = ({
	enabled = true,
	placement = "top",
	flip: flipOptions,
	shift: shiftOptions,
	offset: offsetOptions = 8,
	delay,
	options,
	children,
	...rest
}: PropsWithChildren<TooltipRootProps>) => {
	const base = useFloatingBase({
		role: { role: "tooltip" },
		hover: { enabled, move: false, delay },
		focus: { enabled },
		options: {
			...options,
			placement,
			middleware: [
				offset(offsetOptions),
				flip(flipOptions),
				shift(shiftOptions),
			],
		},
		...rest,
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

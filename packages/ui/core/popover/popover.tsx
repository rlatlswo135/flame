"use client";

import {
	FloatingFocusManager,
	type UseFloatingReturn,
	type UseInteractionsReturn,
	useInteractions,
} from "@floating-ui/react";
import {
	type ComponentPropsWithoutRef,
	cloneElement,
	type PropsWithChildren,
} from "react";
import type { FnChildren } from "@/core/types";
import { useCtx } from "@/hooks/use-ctx";
import {
	type FloatingBaseProps,
	useFloatingBase,
} from "@/hooks/use-floating-base";
import {
	OptionalPortal,
	type OptionalPortalProps,
} from "@/primitives/optional-portal";
import { PopoverContext } from "./context";

export type PopoverProps = PropsWithChildren<
	Omit<FloatingBaseProps, "click" | "hover">
>;

const PopoverRoot = ({ children, ...props }: PopoverProps) => {
	const base = useFloatingBase(props);

	const interactions = useInteractions(base.getInteractions("click"));

	const context = { ...base, interactions };

	return <PopoverContext value={context}>{children}</PopoverContext>;
};

export type PopoverTriggerProps = ComponentPropsWithoutRef<"div">;

const Trigger = ({ children }: PopoverTriggerProps) => {
	const { baseTriggerProps, floating, interactions } = useCtx(PopoverContext);

	const triggerProps = interactions.getReferenceProps({
		...baseTriggerProps,
		"aria-expanded": floating.context.open,
	});

	return cloneElement(children as React.ReactElement, triggerProps);
};

export type PopoverContentProps = FnChildren<{
	interactions: UseInteractionsReturn;
	floating: UseFloatingReturn;
}> &
	OptionalPortalProps &
	Omit<ComponentPropsWithoutRef<"section">, "style" | "children">;

const Content = ({ children, portal, ...props }: PopoverContentProps) => {
	const { floating, transition, interactions, baseContentProps } =
		useCtx(PopoverContext);

	const shouldMount = transition ? transition.isMounted : floating.context.open;

	if (!shouldMount) return null;

	if (typeof children === "function")
		return children({ floating, interactions });

	return (
		<OptionalPortal portal={portal}>
			<FloatingFocusManager context={floating.context} modal>
				<section
					{...baseContentProps}
					{...interactions.getFloatingProps()}
					aria-hidden={!floating.context.open}
					{...props}
				>
					{children}
				</section>
			</FloatingFocusManager>
		</OptionalPortal>
	);
};

export const Popover = Object.assign(PopoverRoot, {
	Trigger,
	Content,
});

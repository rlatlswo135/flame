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
import { useCtx } from "@/src/hooks/use-ctx";
import {
	type FloatingBaseProps,
	useFloatingBase,
} from "@/src/hooks/use-floating-base";
import {
	OptionalPortal,
	type OptionalPortalProps,
} from "@/src/primitives/optional-portal";
import type { FnChildren } from "@/src/types";
import { PopoverContext } from "./context";

type PopoverProps = PropsWithChildren<
	Omit<FloatingBaseProps, "click" | "hover">
>;

type PopoverTriggerProps = ComponentPropsWithoutRef<"div">;

type PopoverContentProps = FnChildren<{
	interactions: UseInteractionsReturn;
	floating: UseFloatingReturn;
}> &
	OptionalPortalProps &
	Omit<ComponentPropsWithoutRef<"section">, "style" | "children">;

const Popover = ({ children, ...props }: PopoverProps) => {
	const base = useFloatingBase(props);

	const interactions = useInteractions(base.getInteractions("click"));

	const context = { ...base, interactions };

	return <PopoverContext value={context}>{children}</PopoverContext>;
};

const Trigger = ({ children }: PopoverTriggerProps) => {
	const { baseTriggerProps, floating, interactions } = useCtx(PopoverContext);

	const triggerProps = interactions.getReferenceProps({
		...baseTriggerProps,
		"aria-expanded": floating.context.open,
	});

	return cloneElement(children as React.ReactElement, triggerProps);
};

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

Popover.Trigger = Trigger;
Popover.Content = Content;

Trigger.displayName = "Popover.Trigger";
Content.displayName = "Popover.Content";

export {
	Popover,
	type PopoverProps,
	type PopoverTriggerProps,
	type PopoverContentProps,
};

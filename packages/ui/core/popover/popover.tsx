"use client";

import {
	FloatingFocusManager,
	type UseFloatingReturn,
	type UseInteractionsReturn,
} from "@floating-ui/react";
import {
	type ComponentPropsWithoutRef,
	cloneElement,
	type PropsWithChildren,
} from "react";
import type { FnChildren, Merge } from "@/core/types";
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

const PopoverRoot = ({
	children,
	...props
}: PropsWithChildren<FloatingBaseProps>) => {
	const base = useFloatingBase({ click: { enabled: true }, ...props });

	return <PopoverContext value={base}>{children}</PopoverContext>;
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

export type PopoverContentProps = Merge<
	OptionalPortalProps & Omit<ComponentPropsWithoutRef<"section">, "style">,
	FnChildren<{
		interactions: UseInteractionsReturn;
		floating: UseFloatingReturn;
	}>
>;

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

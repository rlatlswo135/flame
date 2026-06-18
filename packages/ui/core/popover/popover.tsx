"use client";

import { FloatingFocusManager } from "@floating-ui/react";
import { cloneElement, type PropsWithChildren } from "react";
import { useCtx } from "@/hooks/use-ctx";
import {
	type FloatingBaseProps,
	type FloatingContentProps,
	type FloatingTriggerProps,
	useFloatingBase,
} from "@/hooks/use-floating-base";
import { OptionalPortal } from "@/primitives/optional-portal";
import { PopoverContext } from "./context";

const PopoverRoot = ({
	children,
	...props
}: PropsWithChildren<FloatingBaseProps>) => {
	const base = useFloatingBase({ click: { enabled: true }, ...props });

	return <PopoverContext value={base}>{children}</PopoverContext>;
};

export type PopoverTriggerProps = FloatingTriggerProps;

const Trigger = ({ children }: PopoverTriggerProps) => {
	const { baseTriggerProps, floating, interactions } = useCtx(PopoverContext);

	const triggerProps = interactions.getReferenceProps({
		...baseTriggerProps,
		"aria-expanded": floating.context.open,
	});

	return cloneElement(children, triggerProps);
};

export type PopoverContentProps = FloatingContentProps<"section">;

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
					{...interactions.getFloatingProps(props)}
					{...baseContentProps}
					aria-hidden={!floating.context.open}
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

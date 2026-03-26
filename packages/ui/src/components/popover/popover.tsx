import {
	FloatingFocusManager,
	FloatingPortal,
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
import type { FnChildren } from "@/src/types";
import { PopoverContext } from "./context";

type PopoverProps = PropsWithChildren<
	FloatingBaseProps & {
		interactions?: UseInteractionsReturn;
	}
>;

type PopoverTriggerProps = ComponentPropsWithoutRef<"div">;

type PopoverContentProps = FnChildren<{
	interactions: UseInteractionsReturn;
	floating: UseFloatingReturn;
}> &
	Omit<ComponentPropsWithoutRef<"section">, "style" | "children">;

const Popover = ({ children, ...props }: PopoverProps) => {
	const base = useFloatingBase(props);

	const interactions = useInteractions(Object.values(base.baseInteractions));

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

const Content = ({ children, ...props }: PopoverContentProps) => {
	const {
		portal,
		floating,
		focusTrap,
		transition,
		interactions,
		baseContentProps,
	} = useCtx(PopoverContext);

	const shouldMount = transition ? transition.isMounted : floating.context.open;

	if (!shouldMount) return null;

	if (typeof children === "function")
		return children({ floating, interactions });

	const element = (
		<FloatingFocusManager context={floating.context} modal={focusTrap}>
			<section
				{...baseContentProps}
				{...interactions.getFloatingProps()}
				aria-hidden={!floating.context.open}
				{...props}
			>
				{children}
			</section>
		</FloatingFocusManager>
	);

	if (portal) {
		const portalProps = typeof portal === "boolean" ? {} : portal;
		return <FloatingPortal {...portalProps}>{element}</FloatingPortal>;
	}

	return element;
};

Trigger.displayName = "Popover.Trigger";
Content.displayName = "Popover.Content";

Popover.Trigger = Trigger;
Popover.Content = Content;

export {
	Popover,
	type PopoverProps,
	type PopoverTriggerProps,
	type PopoverContentProps,
};

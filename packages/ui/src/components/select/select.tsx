"use client";

import type {
	UseFloatingReturn,
	UseInteractionsReturn,
} from "@floating-ui/react";
import {
	FloatingFocusManager,
	FloatingPortal,
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
import { SelectContext } from "./context";

type SelectProps = PropsWithChildren<
	FloatingBaseProps & {
		value: string;
		onChange: (value: string) => void;
	}
>;

type SelectTriggerProps = PropsWithChildren;

type SelectOptionsProps = FnChildren<{
	floating: UseFloatingReturn;
	interactions: UseInteractionsReturn;
}> &
	Omit<ComponentPropsWithoutRef<"div">, "children">;

type SelectOptionProps = ComponentPropsWithoutRef<"div"> & { value: string };

const Select = ({ value, children, onChange, ...props }: SelectProps) => {
	const base = useFloatingBase(props);

	const interactions = useInteractions(Object.values(base.baseInteractions));

	const context = {
		...base,
		value,
		onChange,
		interactions,
	};

	return <SelectContext value={context}>{children}</SelectContext>;
};

const Trigger = ({ children }: SelectTriggerProps) => {
	const { baseTriggerProps, floating, interactions } = useCtx(SelectContext);

	const triggerProps = interactions.getReferenceProps({
		...baseTriggerProps,
		"aria-expanded": floating.context.open,
	});

	return cloneElement(children as React.ReactElement, triggerProps);
};

const Options = ({ children, ...props }: SelectOptionsProps) => {
	const {
		portal,
		floating,
		focusTrap,
		transition,
		interactions,
		baseContentProps,
	} = useCtx(SelectContext);

	const shouldMount = transition ? transition.isMounted : floating.context.open;

	if (!shouldMount) return null;

	if (typeof children === "function")
		return children({ floating, interactions });

	const element = (
		<FloatingFocusManager context={floating.context} modal={focusTrap}>
			<div
				role="listbox"
				{...baseContentProps}
				{...interactions.getFloatingProps()}
				aria-hidden={!floating.context.open}
				{...props}
			>
				{children}
			</div>
		</FloatingFocusManager>
	);

	if (portal) {
		const portalProps = typeof portal === "boolean" ? {} : portal;
		return <FloatingPortal {...portalProps}>{element}</FloatingPortal>;
	}

	return element;
};

const Option = ({ value, ...props }: SelectOptionProps) => {
	const { value: selectedValue, onChange, floating } = useCtx(SelectContext);

	const onClick = () => {
		onChange(value);
		floating.context.onOpenChange(false);
	};

	return (
		<div
			tabIndex={0}
			role="option"
			aria-selected={value === selectedValue}
			data-value={value}
			onClick={onClick}
			{...props}
		/>
	);
};

Trigger.displayName = "Select.Trigger";
Options.displayName = "Select.Options";
Option.displayName = "Select.Option";

Select.Trigger = Trigger;
Select.Options = Options;
Select.Option = Option;

export {
	Select,
	type SelectProps,
	type SelectTriggerProps,
	type SelectOptionsProps,
	type SelectOptionProps,
};

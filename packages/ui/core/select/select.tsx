"use client";

import type {
	UseFloatingReturn,
	UseInteractionsReturn,
} from "@floating-ui/react";
import { FloatingFocusManager, useInteractions } from "@floating-ui/react";
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
import { SelectContext } from "./context";

export type SelectProps = PropsWithChildren<
	Omit<FloatingBaseProps, "click" | "hover"> & {
		value: string;
		onChange: (value: string) => void;
	}
>;

const SelectRoot = ({ value, children, onChange, ...props }: SelectProps) => {
	const base = useFloatingBase(props);

	const interactions = useInteractions(base.getInteractions("click"));

	const context = {
		...base,
		value,
		onChange,
		interactions,
	};

	return <SelectContext value={context}>{children}</SelectContext>;
};

export type SelectTriggerProps = PropsWithChildren;

const Trigger = ({ children }: SelectTriggerProps) => {
	const { baseTriggerProps, floating, interactions } = useCtx(SelectContext);

	const triggerProps = interactions.getReferenceProps({
		...baseTriggerProps,
		"aria-expanded": floating.context.open,
	});

	return cloneElement(children as React.ReactElement, triggerProps);
};

export type SelectOptionsProps = FnChildren<{
	floating: UseFloatingReturn;
	interactions: UseInteractionsReturn;
}> &
	OptionalPortalProps &
	Omit<ComponentPropsWithoutRef<"div">, "children">;

const Options = ({ children, portal, ...props }: SelectOptionsProps) => {
	const { floating, transition, interactions, baseContentProps } =
		useCtx(SelectContext);

	const shouldMount = transition ? transition.isMounted : floating.context.open;

	if (!shouldMount) return null;

	if (typeof children === "function")
		return children({ floating, interactions });

	return (
		<OptionalPortal portal={portal}>
			<FloatingFocusManager context={floating.context} modal>
				<div
					{...baseContentProps}
					{...interactions.getFloatingProps()}
					{...props}
					role="listbox"
					aria-hidden={!floating.context.open}
				>
					{children}
				</div>
			</FloatingFocusManager>
		</OptionalPortal>
	);
};

export type SelectOptionProps = ComponentPropsWithoutRef<"div"> & {
	value: string;
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

export const Select = Object.assign(SelectRoot, {
	Option,
	Trigger,
	Options,
});

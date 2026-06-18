"use client";

import type {
	UseFloatingReturn,
	UseInteractionsReturn,
} from "@floating-ui/react";
import { FloatingFocusManager } from "@floating-ui/react";
import {
	type ComponentPropsWithoutRef,
	cloneElement,
	type PropsWithChildren,
} from "react";
import type { FnChildren, Merge, OmitUnion } from "@/core/types";
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

export type SelectRootProps = {
	value: string;
	onChange: (value: string) => void;
} & OmitUnion<FloatingBaseProps, "click" | "hover">;

const SelectRoot = ({
	value,
	children,
	onChange,
	...props
}: PropsWithChildren<SelectRootProps>) => {
	const base = useFloatingBase({ ...props, click: { enabled: true } });

	const context = {
		...base,
		value,
		onChange,
	};

	return <SelectContext value={context}>{children}</SelectContext>;
};

const Trigger = ({ children }: PropsWithChildren) => {
	const { baseTriggerProps, floating, interactions } = useCtx(SelectContext);

	const triggerProps = interactions.getReferenceProps({
		...baseTriggerProps,
		"aria-expanded": floating.context.open,
	});

	return cloneElement(children as React.ReactElement, triggerProps);
};

export type SelectOptionsProps = Merge<
	OptionalPortalProps & ComponentPropsWithoutRef<"div">,
	FnChildren<{
		floating: UseFloatingReturn;
		interactions: UseInteractionsReturn;
	}>
>;

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

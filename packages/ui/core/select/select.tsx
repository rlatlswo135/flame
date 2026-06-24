"use client";

import { FloatingFocusManager } from "@floating-ui/react";
import {
	type ComponentPropsWithoutRef,
	cloneElement,
	type PropsWithChildren,
} from "react";
import type { OmitUnion } from "@/core/types";
import { useCtx } from "@/hooks/use-ctx";
import {
	type FloatingBaseProps,
	type FloatingContentProps,
	type FloatingTriggerProps,
	useFloatingBase,
} from "@/hooks/use-floating-base";
import { OptionalPortal } from "@/primitives/optional-portal";
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
	const base = useFloatingBase({ click: { enabled: true }, ...props });

	const context = {
		...base,
		value,
		onChange,
	};

	return <SelectContext value={context}>{children}</SelectContext>;
};

export type SelectTriggerProps = FloatingTriggerProps;

const Trigger = ({ children }: SelectTriggerProps) => {
	const { baseTriggerProps, floating, interactions } = useCtx(SelectContext);

	const triggerProps = interactions.getReferenceProps({
		...baseTriggerProps,
		"aria-expanded": floating.context.open,
	});

	return cloneElement(children, triggerProps);
};

export type SelectOptionsProps = FloatingContentProps<"div">;

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
					{...interactions.getFloatingProps(props)}
					{...baseContentProps}
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

const Option = ({ value, children, ...props }: SelectOptionProps) => {
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
		>
			{children}
		</div>
	);
};

export const Select = Object.assign(SelectRoot, {
	Option,
	Trigger,
	Options,
});

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
import { ComboboxContext } from "./context";

export type ComboboxRootProps = {
	value: string;
	onChange: (value: string) => void;
	search: string;
	onSearchChange: (search: string) => void;
} & OmitUnion<FloatingBaseProps, "click" | "hover">;

const ComboboxRoot = ({
	value,
	onChange,
	search,
	onSearchChange,
	children,
	...props
}: PropsWithChildren<ComboboxRootProps>) => {
	const base = useFloatingBase({ click: { enabled: true }, ...props });

	const context = { ...base, value, onChange, search, onSearchChange };

	return <ComboboxContext value={context}>{children}</ComboboxContext>;
};

export type ComboboxTriggerProps = FloatingTriggerProps;

const Trigger = ({ children }: ComboboxTriggerProps) => {
	const { baseTriggerProps, floating, interactions } = useCtx(ComboboxContext);

	const triggerProps = interactions.getReferenceProps({
		...baseTriggerProps,
		...(children.props as Record<string, unknown>),
		"aria-haspopup": "listbox",
		"aria-expanded": floating.context.open,
	});

	return cloneElement(children, triggerProps);
};

export type ComboboxOptionsProps = FloatingContentProps<"div">;

const Options = ({ children, portal, ...props }: ComboboxOptionsProps) => {
	const { floating, transition, interactions, baseContentProps } =
		useCtx(ComboboxContext);

	const shouldMount = transition ? transition.isMounted : floating.context.open;

	if (!shouldMount) return null;

	return (
		<OptionalPortal portal={portal}>
			<FloatingFocusManager context={floating.context} modal>
				{typeof children === "function" ? (
					<>{children({ floating, interactions })}</>
				) : (
					<div
						{...interactions.getFloatingProps(props)}
						{...baseContentProps}
						role="listbox"
						aria-hidden={!floating.context.open}
					>
						{children}
					</div>
				)}
			</FloatingFocusManager>
		</OptionalPortal>
	);
};

export type ComboboxOptionProps = ComponentPropsWithoutRef<"div"> & {
	value: string;
};

const Option = ({ value, children, onClick, onChange: onChangeProp, ...props }: ComboboxOptionProps) => {
	const { value: selectedValue, onChange, floating } = useCtx(ComboboxContext);

	return (
		<div
			tabIndex={0}
			role="option"
			aria-selected={value === selectedValue}
			data-value={value}
			onClick={(e) => {
				onClick?.(e);
				onChange(value);
				floating.context.onOpenChange(false);
			}}
			onChange={(e) => {
				onChangeProp?.(e);
				onChange(value);
				floating.context.onOpenChange(false);
			}}
			{...props}
		>
			{children}
		</div>
	);
};

export type ComboboxSearchProps = ComponentPropsWithoutRef<"input">;

const Search = ({ ...props }: ComboboxSearchProps) => {
	const { search, onSearchChange, floating } = useCtx(ComboboxContext);

	return (
		<input
			role="combobox"
			aria-autocomplete="list"
			aria-expanded={floating.context.open}
			value={search}
			onChange={(e) => onSearchChange(e.target.value)}
			{...props}
		/>
	);
};

export const Combobox = Object.assign(ComboboxRoot, {
	Trigger,
	Options,
	Option,
	Search,
});

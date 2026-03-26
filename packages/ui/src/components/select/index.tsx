import type {
	UseFloatingReturn,
	UseInteractionsReturn,
} from "@floating-ui/react";
import {
	FloatingFocusManager,
	FloatingPortal,
	useInteractions,
} from "@floating-ui/react";
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
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

type SelectTriggerProps = ComponentPropsWithoutRef<"div">;

type SelectOptionsProps = FnChildren<{
	floating: UseFloatingReturn;
	interactions: UseInteractionsReturn;
}> &
	Omit<ComponentPropsWithoutRef<"ul">, "children">;

type SelectOptionProps = ComponentPropsWithoutRef<"li"> & { value: string };

const Select = ({
	value,
	children,
	onChange,
	...props
}: PropsWithChildren<SelectProps>) => {
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

const Trigger = ({ children, ...props }: SelectTriggerProps) => {
	const { baseTriggerProps, interactions } = useCtx(SelectContext);

	return (
		<div {...baseTriggerProps} {...interactions.getReferenceProps()} {...props}>
			{children}
		</div>
	);
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
			<ul {...baseContentProps} {...interactions.getFloatingProps()} {...props}>
				{children}
			</ul>
		</FloatingFocusManager>
	);

	if (portal) {
		const portalProps = typeof portal === "boolean" ? {} : portal;
		return <FloatingPortal {...portalProps}>{element}</FloatingPortal>;
	}

	return element;
};

const Option = ({ value, ...props }: SelectOptionProps) => {
	const { onChange } = useCtx(SelectContext);

	return (
		<li
			data-value={value}
			onClick={() => {
				onChange(value);
			}}
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

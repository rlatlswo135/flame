import type {
	FloatingPortalProps,
	UseClickProps,
	UseDismissProps,
	UseFloatingOptions,
	UseFloatingReturn,
	UseInteractionsReturn,
	UseRoleProps,
	UseTransitionStylesProps,
} from "@floating-ui/react";
import {
	FloatingFocusManager,
	FloatingPortal,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
	useTransitionStyles,
} from "@floating-ui/react";
import {
	type ComponentPropsWithoutRef,
	type ComponentPropsWithRef,
	type PropsWithChildren,
	useMemo,
	useState,
} from "react";
import { useCtx } from "@/src/hooks/use-ctx";
import type { FnChildren } from "@/src/types";
import { SelectContext } from "./context";

type SelectProps = {
	value: string;
	onChange: (value: string) => void;

	focusTrap?: boolean;
	portal?: boolean | FloatingPortalProps;
	options?: Omit<UseFloatingOptions, "open" | "onOpenChange">;
	dismiss?: UseDismissProps;
	click?: UseClickProps;
	role?: UseRoleProps;
	transition?: boolean | UseTransitionStylesProps;
};

type OptionsProps = FnChildren<{
	floating: UseFloatingReturn;
	interactions: UseInteractionsReturn;
}> &
	ComponentPropsWithRef<"ul">;

type OptionProps = { value: string } & ComponentPropsWithoutRef<"li">;

const Select = ({
	portal = false,
	focusTrap = true,
	transition = false,
	value,
	onChange,
	children,
	role: roleOptions,
	click: clickOptions,
	dismiss: dismissOptions,
	options,
}: PropsWithChildren<SelectProps>) => {
	const [isOpen, setIsOpen] = useState(false);

	const floating = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		...options,
	});

	const role = useRole(floating.context, roleOptions);
	const click = useClick(floating.context, clickOptions);
	const dismiss = useDismiss(floating.context, dismissOptions);

	const interactions = useInteractions([role, click, dismiss]);

	const context = useMemo(
		() => ({
			value,
			onChange,
			floating,
			interactions,
			transition,
			portal,
			focusTrap,
		}),
		[value, onChange, floating, interactions, transition, portal, focusTrap],
	);

	return <SelectContext value={context}>{children}</SelectContext>;
};

const Trigger = ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
	const { floating, interactions } = useCtx(SelectContext);

	return (
		<div
			ref={floating.refs.setReference}
			{...interactions.getReferenceProps()}
			{...props}
		>
			{children}
		</div>
	);
};

const Options = ({ children, ...props }: OptionsProps) => {
	const {
		portal,
		floating,
		focusTrap,
		interactions,
		transition: transitionOptions,
	} = useCtx(SelectContext);

	const transition = useTransitionStyles(
		floating.context,
		typeof transitionOptions === "object" ? transitionOptions : undefined,
	);

	if (typeof children === "function")
		return children({ floating, interactions });

	const shouldMount = transitionOptions
		? transition.isMounted
		: floating.context.open;

	if (!shouldMount) return null;

	const element = (
		<FloatingFocusManager context={floating.context} modal={focusTrap}>
			<ul
				ref={floating.refs.setFloating}
				style={{
					...floating.floatingStyles,
					...(transitionOptions && transition.styles),
				}}
				{...interactions.getFloatingProps()}
				{...props}
			>
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

const Option = ({ value, ...props }: OptionProps) => {
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

export { Select, type SelectProps };

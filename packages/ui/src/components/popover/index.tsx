import {
	FloatingFocusManager,
	FloatingPortal,
	type FloatingPortalProps,
	type UseClickProps,
	type UseDismissProps,
	type UseFloatingOptions,
	type UseFloatingReturn,
	type UseInteractionsReturn,
	type UseRoleProps,
	type UseTransitionStylesProps,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
	useTransitionStyles,
} from "@floating-ui/react";
import {
	type ComponentPropsWithoutRef,
	type PropsWithChildren,
	useMemo,
	useState,
} from "react";
import { useCtx } from "@/src/hooks/use-ctx";
import type { FnChildren } from "@/src/types";
import { PopoverContext } from "./context";

type BaseProps = {
	focusTrap?: boolean;
	portal?: boolean | FloatingPortalProps;
	/** customs */
	options?: Omit<UseFloatingOptions, "open" | "onOpenChange">;
	dismiss?: UseDismissProps;
	click?: UseClickProps;
	role?: UseRoleProps;
	transition?: boolean | UseTransitionStylesProps;
};

type ControlledProps = BaseProps & {
	open: boolean;
	onOpenChange: (nextOpen: boolean) => void;
};
type UncontrolledProps = BaseProps & {
	onClose?: () => void;
	onOpen?: () => void;
};

type PopoverProps = ControlledProps | UncontrolledProps;

type ContentProps = FnChildren<{
	interactions: UseInteractionsReturn;
	floating: UseFloatingReturn;
}> &
	Omit<ComponentPropsWithoutRef<"section">, "style" | "children">;

const Popover = ({
	portal = false,
	focusTrap = true,
	transition = false,
	children,
	options,
	role: roleOptions,
	click: clickOptions,
	dismiss: dismissOptions,
	...props
}: PropsWithChildren<PopoverProps>) => {
	const controlled = "open" in props;

	const [internalOpen, setIsInternalOpen] = useState(false);

	const floating = useFloating({
		open: controlled ? props.open : internalOpen,
		onOpenChange: (nextOpen) => {
			if (controlled) {
				props.onOpenChange(nextOpen);
				return;
			}

			setIsInternalOpen(nextOpen);

			if (nextOpen) {
				props.onOpen?.();
			} else {
				props.onClose?.();
			}
		},
		...options,
	});

	const role = useRole(floating.context, roleOptions);
	const click = useClick(floating.context, clickOptions);
	const dismiss = useDismiss(floating.context, dismissOptions);

	const interactions = useInteractions([role, click, dismiss]);

	const context = useMemo(
		() => ({
			floating,
			interactions,
			transition,
			focusTrap,
			portal,
		}),
		[floating, interactions, transition, focusTrap, portal],
	);

	return <PopoverContext value={context}>{children}</PopoverContext>;
};

const Trigger = ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
	const { floating, interactions } = useCtx(PopoverContext);

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

const Content = ({ children, ...props }: ContentProps) => {
	const {
		portal,
		floating,
		focusTrap,
		interactions,
		transition: transitionOptions,
	} = useCtx(PopoverContext);

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
			<section
				ref={floating.refs.setFloating}
				style={{
					...floating.floatingStyles,
					...(transitionOptions && transition.styles),
				}}
				{...interactions.getFloatingProps()}
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

export { Popover, type PopoverProps };

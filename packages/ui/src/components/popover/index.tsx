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

type PopoverProps = {
	onClose?: () => void;
	onOpen?: () => void;
	focusTrap?: boolean;
	portal?: boolean | FloatingPortalProps;
	/** customs */
	options?: UseFloatingOptions;
	dismiss?: UseDismissProps;
	click?: UseClickProps;
	role?: UseRoleProps;
	transition?: boolean | UseTransitionStylesProps;
};

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
	onClose,
	onOpen,
	role: roleOptions,
	click: clickOptions,
	dismiss: dismissOptions,
}: PropsWithChildren<PopoverProps>) => {
	const [isOpen, setIsOpen] = useState(false);

	const floating = useFloating({
		open: isOpen,
		onOpenChange: (nextOpen) => {
			setIsOpen(nextOpen);

			if (nextOpen) {
				onOpen?.();
			} else {
				onClose?.();
			}
		},
		...options,
	});
	// TODO: 1,3번 피드백 내용 좀더 분석해보기 (claude)
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
		[floating, onClose, onOpen, interactions, transition, focusTrap, portal],
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

	const element = shouldMount && (
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

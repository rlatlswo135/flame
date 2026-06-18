import type {
	UseClickProps,
	UseDismissProps,
	UseFloatingOptions,
	UseFocusProps,
	UseHoverProps,
	UseInteractionsReturn,
	UseRoleProps,
	UseTransitionStylesProps,
} from "@floating-ui/react";

import {
	safePolygon,
	useClick,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useRole,
	useTransitionStyles,
} from "@floating-ui/react";
import {
	type ComponentPropsWithoutRef,
	type CSSProperties,
	type ElementType,
	type ReactElement,
	useMemo,
	useState,
} from "react";
import type { FnChildren, Merge } from "@/core/types";
import type { OptionalPortalProps } from "@/primitives/optional-portal";

type BaseProps = {
	role?: UseRoleProps;
	hover?: UseHoverProps;
	click?: UseClickProps;
	focus?: UseFocusProps;
	dismiss?: UseDismissProps;
	transition?: boolean | UseTransitionStylesProps;
	options?: Omit<UseFloatingOptions, "open" | "onOpenChange">;
};

type ControlledProps = BaseProps & {
	open: boolean;
	onOpenChange: (nextOpen: boolean) => void;
};

type UncontrolledProps = BaseProps & {
	onClose?: () => void;
	onOpen?: () => void;
};

export type FloatingBaseProps = ControlledProps | UncontrolledProps;

type UseFloatingReturn = ReturnType<typeof useFloating>;

export type FloatingBaseReturn = {
	floating: UseFloatingReturn;
	baseTriggerProps: {
		ref: UseFloatingReturn["refs"]["setReference"];
	};
	baseContentProps: {
		ref: UseFloatingReturn["refs"]["setFloating"];
		style: CSSProperties;
	};
	transition: ReturnType<typeof useTransitionStyles> | null;
	interactions: UseInteractionsReturn;
};

export type FloatingRenderProps = Pick<
	FloatingBaseReturn,
	"floating" | "interactions"
>;

export type FloatingContentProps<El extends ElementType> = Merge<
	OptionalPortalProps & Omit<ComponentPropsWithoutRef<El>, "style">,
	FnChildren<FloatingRenderProps>
>;

export type FloatingTriggerProps = {
	children: ReactElement;
};

export const useFloatingBase = ({
	transition: transitionOptions = false,
	options,
	role: roleOptions,
	focus: focusOptions,
	hover: hoverOptions,
	click: clickOptions,
	dismiss: dismissOptions,
	...props
}: FloatingBaseProps): FloatingBaseReturn => {
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
	const hover = useHover(floating.context, {
		enabled: false,
		handleClose: safePolygon(),
		...hoverOptions,
	});
	const click = useClick(floating.context, { enabled: false, ...clickOptions });
	const focus = useFocus(floating.context, { enabled: false, ...focusOptions });
	const dismiss = useDismiss(floating.context, dismissOptions);

	const transition = useTransitionStyles(
		floating.context,
		typeof transitionOptions === "object" ? transitionOptions : undefined,
	);

	const interactions = useInteractions([dismiss, role, hover, click, focus]);

	const baseTriggerProps = useMemo(
		() => ({
			ref: floating.refs.setReference,
		}),
		[floating.refs.setReference],
	);

	const baseContentProps = useMemo(
		() => ({
			ref: floating.refs.setFloating,
			style: {
				...floating.floatingStyles,
				...(transitionOptions && transition.styles),
			},
		}),
		[
			floating.floatingStyles,
			floating.refs.setFloating,
			transition.styles,
			transitionOptions,
		],
	);

	return {
		floating,
		baseTriggerProps,
		baseContentProps,
		interactions,
		transition: transitionOptions ? transition : null,
	};
};

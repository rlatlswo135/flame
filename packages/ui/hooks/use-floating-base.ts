import type {
	UseClickProps,
	UseDismissProps,
	UseFloatingOptions,
	UseFocusProps,
	UseHoverProps,
	UseRoleProps,
	UseTransitionStylesProps,
} from "@floating-ui/react";

import {
	useClick,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useRole,
	useTransitionStyles,
} from "@floating-ui/react";
import { type CSSProperties, useMemo, useState } from "react";

type Interaction = "hover" | "click" | "focus";

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
	getInteractions: (...action: Interaction[]) => ReturnType<typeof useRole>[];
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
	const hover = useHover(floating.context, hoverOptions);
	const click = useClick(floating.context, clickOptions);
	const focus = useFocus(floating.context, focusOptions);
	const dismiss = useDismiss(floating.context, dismissOptions);

	const transition = useTransitionStyles(
		floating.context,
		typeof transitionOptions === "object" ? transitionOptions : undefined,
	);

	const getInteractions = (...actions: Interaction[]) => {
		const interactions = { hover, click, focus };
		return [dismiss, role, ...actions.map((action) => interactions[action])];
	};

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
		getInteractions,
		transition: transitionOptions ? transition : null,
	};
};

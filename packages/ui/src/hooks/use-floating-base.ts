import type {
	FloatingPortalProps,
	UseClickProps,
	UseDismissProps,
	UseFloatingOptions,
	UseRoleProps,
	UseTransitionStylesProps,
} from "@floating-ui/react";

import {
	useClick,
	useDismiss,
	useFloating,
	useRole,
	useTransitionStyles,
} from "@floating-ui/react";
import { type CSSProperties, useMemo, useState } from "react";

type UseFloatingReturn = ReturnType<typeof useFloating>;

type BaseProps = {
	focusTrap?: boolean;
	portal?: boolean | FloatingPortalProps;
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

export type FloatingBaseProps = ControlledProps | UncontrolledProps;

export const useFloatingBase = ({
	portal = false,
	focusTrap = true,
	transition: transitionOptions = false,
	options,
	role: roleOptions,
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
	const click = useClick(floating.context, clickOptions);
	const dismiss = useDismiss(floating.context, dismissOptions);

	const transition = useTransitionStyles(
		floating.context,
		typeof transitionOptions === "object" ? transitionOptions : undefined,
	);

	const baseInteractions = useMemo(
		() => ({
			role,
			click,
			dismiss,
		}),
		[role, click, dismiss],
	);

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
		portal,
		focusTrap,
		baseInteractions,
		transition: transitionOptions ? transition : null,
		baseTriggerProps,
		baseContentProps,
	};
};

export type FloatingBaseReturn = {
	focusTrap: boolean;
	floating: UseFloatingReturn;
	portal: boolean | FloatingPortalProps;
	baseInteractions: {
		role: ReturnType<typeof useRole>;
		click: ReturnType<typeof useClick>;
		dismiss: ReturnType<typeof useDismiss>;
	};
	baseTriggerProps: {
		ref: UseFloatingReturn["refs"]["setReference"];
	};
	baseContentProps: {
		ref: UseFloatingReturn["refs"]["setFloating"];
		style: CSSProperties;
	};
	transition: ReturnType<typeof useTransitionStyles> | null;
};

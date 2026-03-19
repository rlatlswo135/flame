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
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { useState } from "react";

export type FloatingBaseProps = {
	focusTrap?: boolean;
	portal?: boolean | FloatingPortalProps;
	options?: Omit<UseFloatingOptions, "open" | "onOpenChange">;
	dismiss?: UseDismissProps;
	click?: UseClickProps;
	role?: UseRoleProps;
	transition?: boolean | UseTransitionStylesProps;
};

export const useFloatingBase = ({
	portal = false,
	focusTrap = true,
	transition = false,
	options,
	role: roleOptions,
	click: clickOptions,
	dismiss: dismissOptions,
}: FloatingBaseProps = {}) => {
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

	return {
		isOpen,
		setIsOpen,
		floating,
		interactions,
		transition,
		portal,
		focusTrap,
	};
};

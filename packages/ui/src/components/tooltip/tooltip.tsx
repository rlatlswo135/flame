"use client";

import { useInteractions } from "@floating-ui/react";
import type { PropsWithChildren, ReactNode } from "react";
import {
	type FloatingBaseProps,
	useFloatingBase,
} from "@/src/hooks/use-floating-base";

type TooltipProps = PropsWithChildren<{
	enabled?: boolean;
	content: ReactNode;
}> &
	Omit<FloatingBaseProps, "hover" | "click" | "focus">;

const Tooltip = ({ children, ...props }: TooltipProps) => {
	const { getInteractions } = useFloatingBase(props);

	const interactions = useInteractions(
		getInteractions("click", "hover", "focus"),
	);

	return <div>tooltip</div>;
};

export { Tooltip, type TooltipProps };

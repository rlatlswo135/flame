import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "../hooks/use-mounted";

export const Portal = ({ children }: PropsWithChildren) => {
	const mounted = useMounted();

	if (!mounted) return null;

	return createPortal(children, document.body);
};

import {
	type FloatingPortalProps as BaseFloatingPortal,
	FloatingPortal,
} from "@floating-ui/react";
import type { PropsWithChildren } from "react";

export type OptionalPortalProps = {
	portal?: boolean | BaseFloatingPortal;
};

export const OptionalPortal = ({
	children,
	portal = false,
}: PropsWithChildren<OptionalPortalProps>) => {
	if (portal) {
		const portalProps = typeof portal === "boolean" ? {} : portal;
		return <FloatingPortal {...portalProps}>{children}</FloatingPortal>;
	}

	return children;
};

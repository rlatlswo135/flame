import {
	type FloatingPortalProps as BaseFloatingPortal,
	FloatingPortal,
} from "@floating-ui/react";
import type { PropsWithChildren } from "react";

export type OptionalPortalProps = PropsWithChildren<{
	portal?: boolean | BaseFloatingPortal;
}>;

export const OptionalPortal = ({
	children,
	portal = false,
}: OptionalPortalProps) => {
	if (portal) {
		const portalProps = typeof portal === "boolean" ? {} : portal;
		return <FloatingPortal {...portalProps}>{children}</FloatingPortal>;
	}

	return children;
};

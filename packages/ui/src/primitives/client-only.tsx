import type { PropsWithChildren } from "react";
import { useMounted } from "../hooks/use-mounted";

export const ClientOnly = ({ children }: PropsWithChildren) => {
	const mounted = useMounted();

	return mounted ? children : null;
};

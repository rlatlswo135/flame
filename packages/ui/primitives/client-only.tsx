import type { PropsWithChildren } from "react";
import { useMounted } from "../hooks/use-mounted";

// 전체적으로 primitives 필요 여부 및 체크
export const ClientOnly = ({ children }: PropsWithChildren) => {
	const mounted = useMounted();

	return mounted ? children : null;
};

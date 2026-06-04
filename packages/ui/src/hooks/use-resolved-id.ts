import { useId } from "react";

export const useResolvedId = (idProp?: string) => {
	const id = useId();
	return idProp ?? id;
};

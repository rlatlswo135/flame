import { type Context, use } from "react";

export const useCtx = <T>(ctx: Context<T>, error = "Context not found") => {
	const value = use(ctx);
	if (!value) throw new Error(error);

	return value;
};

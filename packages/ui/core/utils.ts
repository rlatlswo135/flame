export const objectAssign = <
	T extends Record<string, unknown>,
	U extends Record<string, unknown>,
>(
	root: T,
	source: U,
) => Object.assign(root, source) as T & U;

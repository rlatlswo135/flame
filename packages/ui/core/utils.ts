import { cloneElement, Fragment } from "react";

export const objectAssign = <
	T extends Record<string, unknown>,
	U extends Record<string, unknown>,
>(
	root: T,
	source: U,
) => Object.assign(root, source) as T & U;

export const cloneSingleElement = <T>(
	...props: Parameters<typeof cloneElement<T>>
) => {
	const [element, ...rest] = props;

	if (element.type === Fragment) {
		console.error(
			"cloneSingleElement: Cannot clone a Fragment element. Please provide a single React element instead.",
		);
	}

	return cloneElement(element, ...rest);
};

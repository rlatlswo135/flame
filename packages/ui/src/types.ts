import type { ReactElement, ReactNode } from "react";

export type ClickableElement = ReactElement<{
	onClick: () => void;
	"aria-expanded"?: boolean;
}>;

type Dict = Record<string, unknown>;
type Factory<T, U> = (props: T) => U;

export type FnChildren<T extends Dict> = {
	children: ReactNode | Factory<T, ReactNode>;
};

export type ElementFnChildren<T extends Dict> = {
	children: ReactElement | Factory<T, ReactNode>;
};

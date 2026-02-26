import type { ReactElement, ReactNode } from "react";

export type ClickableElement = ReactElement<{ onClick: () => void }>;

type Dict = Record<string, unknown>;
type Factory<T, U> = (props: T) => U;

export type FnChildren<T extends Dict> = {
	children: ReactNode | Factory<T, ReactNode>;
};

// TODO: docs에 ReactElement -> 단일 children이어야 하는걸 명시
export type ElementFnChildren<T extends Dict> = {
	children: ReactElement | Factory<T, ReactNode>;
};

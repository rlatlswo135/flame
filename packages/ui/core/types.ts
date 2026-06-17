import type { ReactElement, ReactNode } from "react";

// TODO: 이게 맞는건지 확인해보기
export type ClickableElement = ReactElement<{
	onClick: () => void;
	"aria-expanded"?: boolean;
	"aria-controls"?: string;
	"aria-disabled"?: boolean;
}>;

type Dict = Record<string, unknown>;
type Factory<T, U> = (props: T) => U;

export type FnChildren<T extends Dict> = {
	children: ReactNode | Factory<T, ReactNode>;
};

export type ElementFnChildren<T extends Dict> = {
	children: ReactElement | Factory<T, ReactNode>;
};

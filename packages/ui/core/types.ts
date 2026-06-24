import type { ReactElement, ReactNode } from "react";

export type Dict = Record<string, unknown>;
type Factory<T, U> = (props: T) => U;

export type FnChildren<T extends Dict> = {
	children: ReactNode | Factory<T, ReactNode>;
};

export type ElementFnChildren<T extends Dict> = {
	children: ReactElement | Factory<T, ReactNode>;
};

// biome-ignore lint/suspicious/noExplicitAny: <use union distribute rule>
export type OmitUnion<T, K extends string> = T extends any ? Omit<T, K> : never;

export type Merge<T, U> = Omit<T, keyof U> & U;

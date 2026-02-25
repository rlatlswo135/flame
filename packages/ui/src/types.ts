import type { ReactElement, ReactNode } from "react";

export type ClickableElement = ReactElement<{ onClick: () => void }>;

export type RenderChildrenProps<T extends Record<string, unknown>> = {
  children: ReactElement | ((props: T) => ReactNode);
};

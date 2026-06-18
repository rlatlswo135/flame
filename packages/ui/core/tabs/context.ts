import { createContext } from "react";

type TabsContextValue = {
	value: string;
	onChange: (value: string) => void;
	orientation: "horizontal" | "vertical";
};

export const TabsContext = createContext<TabsContextValue | null>(null);

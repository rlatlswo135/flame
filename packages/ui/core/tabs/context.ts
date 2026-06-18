import { createContext } from "react";

type TabsContextValue = {
	selected: string;
	onChange: (value: string) => void;
};

export const TabsContext = createContext<TabsContextValue | null>(null);

import { createContext } from "react";

type FunnelContextValue = {
  step: number;
  total: number;
  next: () => void;
  prev: () => void;
  jump: (step: number) => void;
};

export const FunnelContext = createContext<FunnelContextValue | null>(null);

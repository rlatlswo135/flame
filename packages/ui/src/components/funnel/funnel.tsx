"use client";

import {
	Children,
	cloneElement,
	isValidElement,
	type PropsWithChildren,
	useEffect,
	useState,
} from "react";
import { useCtx } from "@/src/hooks/use-ctx";
import type {
	ClickableElement,
	ElementFnChildren,
	FnChildren,
} from "@/src/types";
import { FunnelContext } from "./context";

type FunnelProps = PropsWithChildren;

type FunnelStepProps = FnChildren<{ jump: (step: number) => void }>;

type FunnelNextProps = ElementFnChildren<{ next: () => void }>;

type FunnelPrevProps = ElementFnChildren<{ prev: () => void }>;

const Funnel = ({ children }: FunnelProps) => {
	const [step, setStep] = useState(0);

	const childrenArray = Children.toArray(children);

	const total = childrenArray.length;

	const next = () => {
		if (step === childrenArray.length - 1) return;
		setStep(step + 1);
	};

	const prev = () => {
		if (step === 0) return;
		setStep(step - 1);
	};

	const jump = (jumpTo: number) => {
		if (jumpTo < 0 || jumpTo >= total) return;
		setStep(jumpTo);
	};

	useEffect(() => {
		if (process.env.NODE_ENV === "development") {
			childrenArray.forEach((children) => {
				if (!isValidElement(children) || children.type !== Step) {
					console.warn("⚠️ <Funnel /> expects only Step components as children");
				}
			});
		}
	}, [childrenArray.forEach]);

	const context = { step, total, prev, next, jump };

	return <FunnelContext value={context}>{childrenArray[step]}</FunnelContext>;
};

const Step = (props: FunnelStepProps) => {
	const { jump } = useCtx(FunnelContext);

	if (typeof props.children === "function") return props.children({ jump });

	return props.children;
};

const Next = ({ children }: FunnelNextProps) => {
	const { next } = useCtx(FunnelContext);

	if (typeof children === "function") return children({ next });

	return cloneElement(children as ClickableElement, { onClick: next });
};

const Prev = ({ children }: FunnelPrevProps) => {
	const { prev } = useCtx(FunnelContext);

	if (typeof children === "function") return children({ prev });

	return cloneElement(children as ClickableElement, { onClick: prev });
};

Step.displayName = "Funnel.Step";
Next.displayName = "Funnel.Next";
Prev.displayName = "Funnel.Prev";

Funnel.Step = Step;
Funnel.Next = Next;
Funnel.Prev = Prev;

export {
	Funnel,
	type FunnelProps,
	type FunnelStepProps,
	type FunnelNextProps,
	type FunnelPrevProps,
};

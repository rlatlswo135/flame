"use client";

import {
	Children,
	cloneElement,
	isValidElement,
	type PropsWithChildren,
	useEffect,
	useState,
} from "react";
import type {
	ClickableElement,
	ElementFnChildren,
	FnChildren,
} from "@/core/types";
import { useCtx } from "@/hooks/use-ctx";
import { FunnelContext } from "./context";

const FunnelRoot = ({ children }: PropsWithChildren) => {
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

export type FunnelStepProps = FnChildren<{ jump: (step: number) => void }>;

const Step = (props: FunnelStepProps) => {
	const { jump } = useCtx(FunnelContext);

	if (typeof props.children === "function") return props.children({ jump });

	return props.children;
};

export type FunnelNextProps = ElementFnChildren<{ next: () => void }>;

const Next = ({ children }: FunnelNextProps) => {
	const { next, step, total } = useCtx(FunnelContext);
	const isLast = step === total - 1;

	if (typeof children === "function") return children({ next });

	return cloneElement(children as ClickableElement, {
		onClick: next,
		"aria-disabled": isLast,
	});
};

export type FunnelPrevProps = ElementFnChildren<{ prev: () => void }>;

const Prev = ({ children }: FunnelPrevProps) => {
	const { prev, step } = useCtx(FunnelContext);
	const isFirst = step === 0;

	if (typeof children === "function") return children({ prev });

	return cloneElement(children as ClickableElement, {
		onClick: prev,
		"aria-disabled": isFirst,
	});
};

export const Funnel = Object.assign(FunnelRoot, {
	Step,
	Next,
	Prev,
});

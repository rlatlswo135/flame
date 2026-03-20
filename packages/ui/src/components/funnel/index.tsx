import {
	Children,
	cloneElement,
	isValidElement,
	type PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
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

const Funnel = ({ children }: FunnelProps) => {
	const [step, setStep] = useState(0);

	const childrenArray = Children.toArray(children);

	const total = childrenArray.length;

	const next = useCallback(() => {
		if (step === childrenArray.length - 1) return;
		setStep(step + 1);
	}, [childrenArray.length, step]);

	const prev = useCallback(() => {
		if (step === 0) return;
		setStep(step - 1);
	}, [step]);

	const jump = useCallback(
		(jumpTo: number) => {
			if (jumpTo < 0 || jumpTo >= total) return;
			setStep(jumpTo);
		},
		[total],
	);

	useEffect(() => {
		if (process.env.NODE_ENV === "development") {
			childrenArray.forEach((children) => {
				if (!isValidElement(children) || children.type !== Step) {
					console.warn("⚠️ <Funnel /> expects only Step components as children");
				}
			});
		}
	}, [childrenArray.forEach]);

	const context = useMemo(
		() => ({ step, total, prev, next, jump }),
		[step, total, prev, next, jump],
	);

	return <FunnelContext value={context}>{childrenArray[step]}</FunnelContext>;
};

const Step = (props: FnChildren<{ jump: (step: number) => void }>) => {
	const { jump } = useCtx(FunnelContext);

	if (typeof props.children === "function") return props.children({ jump });

	return props.children;
};

const Next = ({ children }: ElementFnChildren<{ next: () => void }>) => {
	const { next } = useCtx(FunnelContext);

	if (typeof children === "function") return children({ next });

	return cloneElement(children as ClickableElement, { onClick: next });
};

const Prev = ({ children }: ElementFnChildren<{ prev: () => void }>) => {
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

export { Funnel, type FunnelProps };

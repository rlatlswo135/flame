import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useCtx } from "@/src/hooks/use-ctx";
import { AccordionContext, AccordionItemContext } from "./context";

type AccordionProps = PropsWithChildren<{
	single?: boolean;
}>;

type AccordionItemProps = PropsWithChildren;

const Accordion = ({ single = false, children }: AccordionProps) => {
	const value = useMemo(() => ({ single }), [single]);
	return <AccordionContext value={value}>{children}</AccordionContext>;
};

const Item = ({ children }: AccordionItemProps) => {
	// TODO: open state control when single mode
	const { single } = useCtx(AccordionContext);

	const [isExpanded, setIsExpanded] = useState(false);

	const toggle = useCallback(() => {
		setIsExpanded((prev) => !prev);
	}, []);

	const value = useMemo(
		() => ({
			isExpanded,
			toggle,
		}),
		[isExpanded, toggle],
	);

	return <AccordionItemContext value={value}>{children}</AccordionItemContext>;
};

const Trigger = ({ children }: PropsWithChildren) => {
	const { toggle } = useCtx(AccordionItemContext);

	return (
		<button type="button" onClick={toggle}>
			{children}
		</button>
	);
};

const Content = ({ children }: PropsWithChildren) => {
	return <div>{children}</div>;
};

Accordion.Item = Item;
Accordion.Trigger = Trigger;
Accordion.Content = Content;

export { Accordion, type AccordionProps };

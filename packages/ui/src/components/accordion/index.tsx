import {
	type PropsWithChildren,
	useCallback,
	useId,
	useMemo,
	useState,
} from "react";
import { useCtx } from "@/src/hooks/use-ctx";
import { AccordionContext, AccordionItemContext } from "./context";

type AccordionProps = PropsWithChildren<{
	single?: boolean;
}>;

type AccordionItemProps = PropsWithChildren;

const Accordion = ({ single = false, children }: AccordionProps) => {
	const [expandedId, setExpandedId] = useState("");

	const value = useMemo(
		() => ({ expandedId, setExpandedId, single }),
		[expandedId, single],
	);

	return <AccordionContext value={value}>{children}</AccordionContext>;
};

const Item = ({ children }: AccordionItemProps) => {
	const id = useId();
	const { single, expandedId } = useCtx(AccordionContext);

	const [internalExpanded, setInternalExpanded] = useState(false);

	const isExpanded = single ? expandedId === "" : internalExpanded;

	const toggle = useCallback(() => {
		setInternalExpanded((prev) => !prev);
	}, []);

	const value = useMemo(
		() => ({
			id,
			toggle,
			isExpanded,
		}),
		[toggle, isExpanded, id],
	);

	return <AccordionItemContext value={value}>{children}</AccordionItemContext>;
};

const Trigger = ({ children }: PropsWithChildren) => {
	const { toggle, id } = useCtx(AccordionItemContext);
	const { expandedId, setExpandedId, single } = useCtx(AccordionContext);

	const onClickTrigger = () => {
		if (single) {
			setExpandedId(id === expandedId ? "" : id);
		} else {
			toggle();
		}
	};

	return (
		<button type="button" onClick={onClickTrigger}>
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

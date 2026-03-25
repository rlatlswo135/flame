import {
	type ComponentPropsWithRef,
	cloneElement,
	type PropsWithChildren,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useState,
} from "react";
import { useCtx } from "@/src/hooks/use-ctx";
import type { ClickableElement, ElementFnChildren } from "@/src/types";
import { AccordionContext, AccordionItemContext } from "./context";

type AccordionProps = PropsWithChildren<{
	single?: boolean;
}>;

type AccordionItemProps = PropsWithChildren<{
	initialOpen?: boolean;
}>;

const Accordion = ({ single = false, children }: AccordionProps) => {
	const [activeItemId, setActiveItemId] = useState("");

	const value = useMemo(
		() => ({ activeItemId, setActiveItemId, single }),
		[activeItemId, single],
	);

	return <AccordionContext value={value}>{children}</AccordionContext>;
};

const Item = ({ children, initialOpen = false }: AccordionItemProps) => {
	const id = useId();
	const { single, activeItemId, setActiveItemId } = useCtx(AccordionContext);

	const [localExpanded, setLocalExpanded] = useState(initialOpen);

	// biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회 초기화
	useEffect(() => {
		if (single && initialOpen) {
			setActiveItemId(id);
		}
	}, []);

	const isExpanded = single ? activeItemId === id : localExpanded;

	const toggle = useCallback(() => {
		if (single) {
			setActiveItemId((activeId) => (activeId === id ? "" : id));
		} else {
			setLocalExpanded((isOpen) => !isOpen);
		}
	}, [single, id, setActiveItemId]);

	const value = useMemo(() => ({ toggle, isExpanded }), [toggle, isExpanded]);

	return <AccordionItemContext value={value}>{children}</AccordionItemContext>;
};

const Trigger = ({ children }: ElementFnChildren<{ toggle: () => void }>) => {
	const { toggle } = useCtx(AccordionItemContext);

	if (typeof children === "function") return children({ toggle });

	return cloneElement(children as ClickableElement, { onClick: toggle });
};

const Content = ({
	children,
	...props
}: PropsWithChildren<ComponentPropsWithRef<"section">>) => {
	const { isExpanded } = useCtx(AccordionItemContext);

	if (!isExpanded) return null;

	return <section {...props}>{children}</section>;
};

Accordion.Item = Item;
Accordion.Trigger = Trigger;
Accordion.Content = Content;

export { Accordion, type AccordionProps };

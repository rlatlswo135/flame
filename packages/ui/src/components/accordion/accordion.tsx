"use client";

import {
	type ComponentPropsWithRef,
	cloneElement,
	type PropsWithChildren,
	useEffect,
	useId,
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

type AccordionTriggerProps = ElementFnChildren<{ toggle: () => void }>;

type AccordionContentProps = PropsWithChildren<ComponentPropsWithRef<"div">>;

const Accordion = ({ single = false, children }: AccordionProps) => {
	const [activeItemId, setActiveItemId] = useState<string | null>(null);

	const value = { activeItemId, setActiveItemId, single };

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

	const toggle = () => {
		if (single) {
			setActiveItemId((activeId) => (activeId === id ? null : id));
		} else {
			setLocalExpanded((isOpen) => !isOpen);
		}
	};

	const value = { toggle, isExpanded };

	return <AccordionItemContext value={value}>{children}</AccordionItemContext>;
};

const Trigger = ({ children }: AccordionTriggerProps) => {
	const { toggle, isExpanded } = useCtx(AccordionItemContext);

	if (typeof children === "function") return children({ toggle });

	return cloneElement(children as ClickableElement, {
		onClick: toggle,
		"aria-expanded": isExpanded,
	});
};

const Content = ({ children, ...props }: AccordionContentProps) => {
	const { isExpanded } = useCtx(AccordionItemContext);

	if (!isExpanded) return null;

	return (
		<div data-expanded={isExpanded} aria-hidden={!isExpanded} {...props}>
			{children}
		</div>
	);
};

Item.displayName = "Accordion.Item";
Trigger.displayName = "Accordion.Trigger";
Content.displayName = "Accordion.Content";

Accordion.Item = Item;
Accordion.Trigger = Trigger;
Accordion.Content = Content;

export {
	Accordion,
	type AccordionProps,
	type AccordionItemProps,
	type AccordionTriggerProps,
	type AccordionContentProps,
};

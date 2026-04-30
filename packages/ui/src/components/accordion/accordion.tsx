"use client";

import {
	type ComponentPropsWithRef,
	type CSSProperties,
	cloneElement,
	type PropsWithChildren,
	type RefObject,
	useEffect,
	useId,
	useState,
} from "react";
import { useCtx } from "@/src/hooks/use-ctx";
import { useExitTransition } from "@/src/hooks/use-exit-transition";
import { useResolvedId } from "@/src/hooks/use-resolved-id";
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

const TRANSITION = "250ms ease";

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

	const contentId = useResolvedId();

	const isExpanded = single ? activeItemId === id : localExpanded;
	const { mounted, status, transitionRef } = useExitTransition(isExpanded);

	const toggle = () => {
		if (single) {
			setActiveItemId((activeId) => (activeId === id ? null : id));
		} else {
			setLocalExpanded((isOpen) => !isOpen);
		}
	};

	const value = {
		toggle,
		isExpanded,
		contentId,
		mounted,
		status,
		transitionRef,
	};

	return <AccordionItemContext value={value}>{children}</AccordionItemContext>;
};

const Trigger = ({ children }: AccordionTriggerProps) => {
	const { toggle, isExpanded, contentId } = useCtx(AccordionItemContext);

	if (typeof children === "function") return children({ toggle });

	return cloneElement(children as ClickableElement, {
		onClick: toggle,
		"aria-expanded": isExpanded,
		"aria-controls": contentId,
	});
};

const Content = ({ children, ...props }: AccordionContentProps) => {
	const { isExpanded, contentId, mounted, status, transitionRef } =
		useCtx(AccordionItemContext);

	if (!mounted) return null;

	const isVisible = status === "entering" || status === "entered";

	const sectionStyle: CSSProperties = {
		...props.style,
		display: "grid",
		gridTemplateRows: isVisible ? "1fr" : "0fr",
		transition: `grid-template-rows ${TRANSITION}`,
	};

	return (
		<section
			{...props}
			ref={transitionRef as RefObject<HTMLElement>}
			id={contentId}
			data-expanded={isExpanded}
			aria-hidden={!isVisible}
			style={sectionStyle}
		>
			<div style={{ overflow: "hidden", minHeight: 0 }}>{children}</div>
		</section>
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

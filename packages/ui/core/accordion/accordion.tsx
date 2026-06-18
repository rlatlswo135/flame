"use client";

import {
	type ComponentPropsWithRef,
	type CSSProperties,
	cloneElement,
	type PropsWithChildren,
	useEffect,
	useState,
} from "react";
import type { ClickableElement, ElementFnChildren } from "@/core/types";
import { useCtx } from "@/hooks/use-ctx";
import { useResolvedId } from "@/hooks/use-resolved-id";
import { AccordionContext, AccordionItemContext } from "./context";

export type AccordionRootProps = {
	single?: boolean;
};

const AccordionRoot = ({
	single = false,
	children,
}: PropsWithChildren<AccordionRootProps>) => {
	const [activeItemId, setActiveItemId] = useState<string | null>(null);

	const value = { activeItemId, setActiveItemId, single };

	return <AccordionContext value={value}>{children}</AccordionContext>;
};

export type AccordionItemProps = {
	initialOpen?: boolean;
};

const Item = ({
	children,
	initialOpen = false,
}: PropsWithChildren<AccordionItemProps>) => {
	const id = useResolvedId();
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

	const value = { toggle, isExpanded, contentId: id };

	return <AccordionItemContext value={value}>{children}</AccordionItemContext>;
};

export type AccordionTriggerProps = ElementFnChildren<{ toggle: () => void }>;

const Trigger = ({ children }: AccordionTriggerProps) => {
	const { toggle, isExpanded, contentId } = useCtx(AccordionItemContext);

	if (typeof children === "function") return children({ toggle });

	return cloneElement(children as ClickableElement, {
		onClick: toggle,
		"aria-expanded": isExpanded,
		"aria-controls": contentId,
	});
};

export type AccordionContentProps = ComponentPropsWithRef<"div">;

const Content = ({ children, ...props }: AccordionContentProps) => {
	const { isExpanded, contentId } = useCtx(AccordionItemContext);

	const sectionStyle: CSSProperties = {
		...props.style,
		display: "grid",
		gridTemplateRows: isExpanded ? "1fr" : "0fr",
		transition: "grid-template-rows 250ms ease",
	};

	return (
		<section
			{...props}
			id={contentId}
			data-expanded={isExpanded}
			aria-hidden={!isExpanded}
			style={sectionStyle}
		>
			<div style={{ overflow: "hidden", minHeight: 0 }}>{children}</div>
		</section>
	);
};

export const Accordion = Object.assign(AccordionRoot, {
	Item,
	Trigger,
	Content,
});

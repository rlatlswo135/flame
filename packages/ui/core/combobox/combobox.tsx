"use client";

import {
	type ComponentPropsWithoutRef,
	type PropsWithChildren,
	useEffect,
	useRef,
	useState,
} from "react";
import type { OmitUnion } from "@/core/types";
import { useCtx } from "@/hooks/use-ctx";
import {
	type FloatingBaseProps,
	type FloatingContentProps,
	useFloatingBase,
} from "@/hooks/use-floating-base";
import { useListNavigation } from "@/hooks/use-list-navigation";
import { useResolvedId } from "@/hooks/use-resolved-id";
import { OptionalPortal } from "@/primitives/optional-portal";
import { ComboboxContext } from "./context";

export type ComboboxRootProps = {
	value: string;
	onChange: (value: string) => void;
} & OmitUnion<FloatingBaseProps, "click" | "hover" | "focus">;

const ComboboxRoot = ({
	value,
	onChange,
	children,
	...props
}: PropsWithChildren<ComboboxRootProps>) => {
	// keyboardHandlers를 끄지 않으면 useClick이 input의 Enter/Space를 가로채
	// 옵션 선택/공백 입력을 막는다.
	const base = useFloatingBase({
		click: { enabled: true, keyboardHandlers: false },
		...props,
	});
	const { open, onOpenChange } = base.floating.context;

	const listId = useResolvedId();
	const [inputValue, setInputValue] = useState("");
	// 선택된 항목의 레이블 — 닫힐 때 입력값 복원에만 쓰여 렌더와 무관하므로 ref로 둔다.
	const selectedLabelRef = useRef("");

	const matches = (label: string) => {
		const keyword = inputValue.trim().toLowerCase();
		if (!keyword) return true;
		return label.toLowerCase().includes(keyword);
	};

	const { activeId, setActiveId, onKeyDown } = useListNavigation({
		open,
		onOpenChange,
		listRef: base.floating.refs.floating,
		onSelect: (option) =>
			selectOption(
				option.dataset.value ?? "",
				option.dataset.label ?? option.textContent ?? "",
			),
	});

	const selectOption = (nextValue: string, label: string) => {
		onChange(nextValue);
		selectedLabelRef.current = label;
		setInputValue(label);
		setActiveId(null);
		onOpenChange(false);
	};

	const onInputChange = (next: string) => {
		setInputValue(next);
		setActiveId(null);
		if (!open) onOpenChange(true);
	};

	// Escape · 외부 클릭 · 선택 등 어떤 이유로 닫히든 입력값을 선택된 레이블로 복원한다.
	const prevOpenRef = useRef(open);
	useEffect(() => {
		if (prevOpenRef.current && !open) {
			setInputValue(selectedLabelRef.current);
			setActiveId(null);
		}
		prevOpenRef.current = open;
	}, [open, setActiveId]);

	const context = {
		...base,
		value,
		listId,
		inputValue,
		activeId,
		matches,
		onInputChange,
		onSearchKeyDown: onKeyDown,
		setActiveId,
		selectOption,
	};

	return <ComboboxContext value={context}>{children}</ComboboxContext>;
};

export type ComboboxSearchProps = ComponentPropsWithoutRef<"input">;

const Search = ({ onChange, onKeyDown, ...props }: ComboboxSearchProps) => {
	const {
		baseTriggerProps,
		interactions,
		floating,
		listId,
		inputValue,
		activeId,
		onInputChange,
		onSearchKeyDown,
	} = useCtx(ComboboxContext);

	return (
		<input
			{...interactions.getReferenceProps({ ...baseTriggerProps, ...props })}
			role="combobox"
			aria-autocomplete="list"
			aria-haspopup="listbox"
			aria-expanded={floating.context.open}
			aria-controls={listId}
			aria-activedescendant={activeId ?? undefined}
			value={inputValue}
			onChange={(event) => {
				onChange?.(event);
				onInputChange(event.target.value);
			}}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				onSearchKeyDown(event);
			}}
		/>
	);
};

export type ComboboxOptionsProps = FloatingContentProps<"div">;

const Options = ({ children, portal, ...props }: ComboboxOptionsProps) => {
	const { floating, transition, interactions, baseContentProps, listId } =
		useCtx(ComboboxContext);

	const shouldMount = transition ? transition.isMounted : floating.context.open;

	if (!shouldMount) return null;

	if (typeof children === "function")
		return children({ floating, interactions });

	return (
		<OptionalPortal portal={portal}>
			<div
				{...interactions.getFloatingProps(props)}
				{...baseContentProps}
				id={listId}
				role="listbox"
			>
				{children}
			</div>
		</OptionalPortal>
	);
};

export type ComboboxOptionProps = ComponentPropsWithoutRef<"div"> & {
	value: string;
	/** 필터링·입력값 표시에 쓰일 레이블. 생략하면 문자열 children을 사용한다. */
	label?: string;
};

const Option = ({
	value,
	label,
	children,
	id: idProp,
	onClick,
	onPointerMove,
	...props
}: ComboboxOptionProps) => {
	const {
		value: selectedValue,
		activeId,
		matches,
		selectOption,
		setActiveId,
	} = useCtx(ComboboxContext);
	const id = useResolvedId(idProp);

	const resolvedLabel = label ?? (typeof children === "string" ? children : "");

	if (!matches(resolvedLabel)) return null;

	const isActive = id === activeId;

	return (
		<div
			{...props}
			id={id}
			role="option"
			tabIndex={-1}
			aria-selected={value === selectedValue}
			data-value={value}
			data-label={resolvedLabel}
			data-active={isActive ? "true" : undefined}
			onClick={(event) => {
				onClick?.(event);
				selectOption(value, resolvedLabel);
			}}
			onPointerMove={(event) => {
				onPointerMove?.(event);
				setActiveId(id);
			}}
		>
			{children}
		</div>
	);
};

export const Combobox = Object.assign(ComboboxRoot, {
	Search,
	Options,
	Option,
});

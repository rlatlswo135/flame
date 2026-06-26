"use client";

import {
	type ComponentPropsWithoutRef,
	type PropsWithChildren,
	useState,
} from "react";
import { useCtx } from "@/hooks/use-ctx";
import { TabsContext } from "./context";

export type TabsRootProps = {
	initialTab?: string;
	onChange?: (value: string) => void;
} & Omit<ComponentPropsWithoutRef<"div">, "onChange">;

const TabsRoot = ({
	initialTab = "",
	onChange: onChangeProp,
	children,
	...props
}: PropsWithChildren<TabsRootProps>) => {
	const [selected, setSelected] = useState(initialTab);

	const onChange = (value: string) => {
		setSelected(value);
		onChangeProp?.(value);
	};

	return (
		<TabsContext value={{ selected, onChange }}>
			<div role="tablist" {...props}>
				{children}
			</div>
		</TabsContext>
	);
};

export type TabsItemProps = ComponentPropsWithoutRef<"button"> & {
	value: string;
};

const Item = ({ value, ...props }: TabsItemProps) => {
	const { selected, onChange } = useCtx(TabsContext);

	const isSelected = value === selected;

	const onClick = () => {
		onChange(value);
	};

	// NOTE(a11y): tablist 키보드 내비게이션(방향키/Home/End roving tabindex) 미구현.
	// tabpanel/aria-controls 연계도 없어 패널 연결은 소비자 몫(컴포넌트는 탭 버튼만 제공).
	return (
		<button
			role="tab"
			type="button"
			onClick={onClick}
			aria-selected={isSelected}
			data-selected={isSelected}
			{...props}
		/>
	);
};

export const Tabs = Object.assign(TabsRoot, { Item });

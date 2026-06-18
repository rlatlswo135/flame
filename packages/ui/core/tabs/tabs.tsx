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
} & ComponentPropsWithoutRef<"div">;

const TabsRoot = ({
	initialTab = "",
	onChange: onChangeProp,
	children,
	...props
}: PropsWithChildren<TabsRootProps>) => {
	const [selected, setSelected] = useState(initialTab);

	const onChange = (value: string) => {
		setSelected(value);

		if (onChangeProp) {
			onChangeProp(value);
		}
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

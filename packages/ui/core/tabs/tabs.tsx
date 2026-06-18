"use client";

import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { useCtx } from "@/hooks/use-ctx";
import { TabsContext } from "./context";

export type TabsRootProps = ComponentPropsWithoutRef<"div"> & {
	value: string;
	onChange: (value: string) => void;
	orientation?: "horizontal" | "vertical";
};

const TabsRoot = ({
	value,
	onChange,
	orientation = "horizontal",
	children,
	...props
}: PropsWithChildren<TabsRootProps>) => {
	return (
		<TabsContext value={{ value, onChange, orientation }}>
			<div role="tablist" aria-orientation={orientation} {...props}>
				{children}
			</div>
		</TabsContext>
	);
};

export type TabsItemProps = ComponentPropsWithoutRef<"button"> & {
	value: string;
};

const Item = ({ value, onClick, ...props }: TabsItemProps) => {
	const { value: selectedValue, onChange } = useCtx(TabsContext);
	const isSelected = value === selectedValue;

	return (
		<button
			type="button"
			role="tab"
			aria-selected={isSelected}
			data-state={isSelected ? "active" : "inactive"}
			onClick={(e) => {
				onClick?.(e);
				onChange(value);
			}}
			{...props}
		/>
	);
};

export const Tabs = Object.assign(TabsRoot, { Item });

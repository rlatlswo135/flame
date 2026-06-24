import { Combobox } from "@flame/ui";
import { useState } from "react";

const FRUITS = [
	{ value: "apple", label: "사과" },
	{ value: "banana", label: "바나나" },
	{ value: "cherry", label: "체리" },
	{ value: "grape", label: "포도" },
	{ value: "mango", label: "망고" },
	{ value: "orange", label: "오렌지" },
];

export const DefaultExample = () => {
	const [value, setValue] = useState("");
	const [search, setSearch] = useState("");

	const filtered = FRUITS.filter((f) =>
		f.label.toLowerCase().includes(search.toLowerCase()),
	);

	const selectedLabel = FRUITS.find((f) => f.value === value)?.label;

	return (
		<Combobox
			value={value}
			onChange={setValue}
			search={search}
			onSearchChange={setSearch}
		>
			<Combobox.Trigger>
				<button type="button">{selectedLabel || "과일을 선택하세요"}</button>
			</Combobox.Trigger>
			<Combobox.Options>
				<Combobox.Search placeholder="검색..." />
				{filtered.map((f) => (
					<Combobox.Option key={f.value} value={f.value}>
						{f.label}
					</Combobox.Option>
				))}
			</Combobox.Options>
		</Combobox>
	);
};

export const WithTransitionExample = () => {
	const [value, setValue] = useState("");
	const [search, setSearch] = useState("");

	const filtered = FRUITS.filter((f) =>
		f.label.toLowerCase().includes(search.toLowerCase()),
	);

	const selectedLabel = FRUITS.find((f) => f.value === value)?.label;

	return (
		<Combobox
			value={value}
			onChange={setValue}
			search={search}
			onSearchChange={setSearch}
			transition
		>
			<Combobox.Trigger>
				<button type="button">{selectedLabel || "과일을 선택하세요"}</button>
			</Combobox.Trigger>
			<Combobox.Options>
				<Combobox.Search placeholder="검색..." />
				{filtered.map((f) => (
					<Combobox.Option key={f.value} value={f.value}>
						{f.label}
					</Combobox.Option>
				))}
			</Combobox.Options>
		</Combobox>
	);
};

export const FullCustomExample = () => {
	const [value, setValue] = useState("");
	const [search, setSearch] = useState("");

	const filtered = FRUITS.filter((f) =>
		f.label.toLowerCase().includes(search.toLowerCase()),
	);

	const selectedLabel = FRUITS.find((f) => f.value === value)?.label;

	return (
		<Combobox
			value={value}
			onChange={setValue}
			search={search}
			onSearchChange={setSearch}
		>
			<Combobox.Trigger>
				<button type="button">{selectedLabel || "과일을 선택하세요"}</button>
			</Combobox.Trigger>
			<Combobox.Options>
				{({ floating, interactions }) => (
					<div
						ref={floating.refs.setFloating}
						style={floating.floatingStyles}
						{...interactions.getFloatingProps()}
					>
						<Combobox.Search placeholder="검색..." />
						{filtered.map((f) => (
							<Combobox.Option key={f.value} value={f.value}>
								{f.label}
							</Combobox.Option>
						))}
					</div>
				)}
			</Combobox.Options>
		</Combobox>
	);
};

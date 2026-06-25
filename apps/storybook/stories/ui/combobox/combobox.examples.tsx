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

	return (
		<Combobox value={value} onChange={setValue}>
			<Combobox.Search placeholder="검색..." />
			<Combobox.Options>
				{FRUITS.map((f) => (
					<Combobox.Option key={f.value} value={f.value} label={f.label}>
						{f.label}
					</Combobox.Option>
				))}
			</Combobox.Options>
		</Combobox>
	);
};

export const WithTransitionExample = () => {
	const [value, setValue] = useState("");

	return (
		<Combobox value={value} onChange={setValue} transition>
			<Combobox.Search placeholder="검색..." />
			<Combobox.Options>
				{FRUITS.map((f) => (
					<Combobox.Option key={f.value} value={f.value} label={f.label}>
						{f.label}
					</Combobox.Option>
				))}
			</Combobox.Options>
		</Combobox>
	);
};

export const FullCustomExample = () => {
	const [value, setValue] = useState("");

	return (
		<Combobox value={value} onChange={setValue}>
			<Combobox.Search placeholder="검색..." />
			<Combobox.Options>
				{({ floating, interactions }) => (
					<div
						ref={floating.refs.setFloating}
						style={floating.floatingStyles}
						{...interactions.getFloatingProps()}
					>
						{FRUITS.map((f) => (
							<Combobox.Option key={f.value} value={f.value} label={f.label}>
								{f.label}
							</Combobox.Option>
						))}
					</div>
				)}
			</Combobox.Options>
		</Combobox>
	);
};

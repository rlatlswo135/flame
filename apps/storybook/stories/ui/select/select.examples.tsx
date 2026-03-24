import { Select } from "@flame/ui";
import { useState } from "react";

export const DefaultExample = () => {
	const [value, setValue] = useState("");

	return (
		<Select value={value} onChange={setValue}>
			<Select.Trigger>
				<button type="button">{value || "과일을 선택하세요"}</button>
			</Select.Trigger>
			<Select.Options>
				<Select.Option value="apple">사과</Select.Option>
				<Select.Option value="banana">바나나</Select.Option>
				<Select.Option value="cherry">체리</Select.Option>
			</Select.Options>
		</Select>
	);
};

export const WithTransitionExample = () => {
	const [value, setValue] = useState("");

	return (
		<Select value={value} onChange={setValue} transition>
			<Select.Trigger>
				<button type="button">{value || "과일을 선택하세요"}</button>
			</Select.Trigger>
			<Select.Options>
				<Select.Option value="apple">사과</Select.Option>
				<Select.Option value="banana">바나나</Select.Option>
				<Select.Option value="cherry">체리</Select.Option>
			</Select.Options>
		</Select>
	);
};

export const FullCustomExample = () => {
	const [value, setValue] = useState("");

	return (
		<Select value={value} onChange={setValue}>
			<Select.Trigger>
				<button type="button">{value || "과일을 선택하세요"}</button>
			</Select.Trigger>
			<Select.Options>
				{({ floating, interactions }) => (
					<ul
						ref={floating.refs.setFloating}
						style={floating.floatingStyles}
						{...interactions.getFloatingProps()}
					>
						<Select.Option value="apple">사과</Select.Option>
						<Select.Option value="banana">바나나</Select.Option>
						<Select.Option value="cherry">체리</Select.Option>
					</ul>
				)}
			</Select.Options>
		</Select>
	);
};

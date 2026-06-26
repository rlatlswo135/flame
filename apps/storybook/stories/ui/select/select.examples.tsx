import { Select } from "flame-ui";
import { type ComponentProps, useState } from "react";

type ControlledSelectProps = Omit<
	ComponentProps<typeof Select>,
	"value" | "onChange" | "children"
>;

// Select은 controlled 컴포넌트라 데모에서 value를 useState로 관리한다.
// Storybook args(transition, options 등)는 그대로 Select로 전달된다.
export const ControlledSelect = (props: ControlledSelectProps) => {
	const [value, setValue] = useState("");

	return (
		<Select {...props} value={value} onChange={setValue}>
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

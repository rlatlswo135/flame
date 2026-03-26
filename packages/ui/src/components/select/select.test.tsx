import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./select";

const renderSelect = (props?: Partial<Parameters<typeof Select>[0]>) => {
	const user = userEvent.setup();
	const onChange = props?.onChange ?? vi.fn();

	render(
		<Select value={props?.value ?? ""} onChange={onChange} {...props}>
			<Select.Trigger>
				<button type="button">선택</button>
			</Select.Trigger>
			<Select.Options data-testid="options">
				<Select.Option value="apple">사과</Select.Option>
				<Select.Option value="banana">바나나</Select.Option>
				<Select.Option value="cherry">체리</Select.Option>
			</Select.Options>
		</Select>,
	);

	return { user, onChange };
};

describe("Select", () => {
	describe("렌더링", () => {
		it("Trigger가 렌더링된다", () => {
			renderSelect();
			expect(screen.getByText("선택")).toBeInTheDocument();
		});

		it("초기 상태에서 Options가 보이지 않는다", () => {
			renderSelect();
			expect(screen.queryByTestId("options")).not.toBeInTheDocument();
		});
	});

	describe("클릭 인터랙션", () => {
		it("Trigger 클릭 시 Options가 열린다", async () => {
			const { user } = renderSelect();
			await user.click(screen.getByText("선택"));
			expect(screen.getByTestId("options")).toBeInTheDocument();
		});

		it("열린 상태에서 Trigger 재클릭 시 닫힌다", async () => {
			const { user } = renderSelect();
			await user.click(screen.getByText("선택"));
			await user.click(screen.getByText("선택"));
			expect(screen.queryByTestId("options")).not.toBeInTheDocument();
		});
	});

	describe("Option 선택", () => {
		it("Option 클릭 시 onChange가 해당 value로 호출된다", async () => {
			const { user, onChange } = renderSelect();
			await user.click(screen.getByText("선택"));
			await user.click(screen.getByText("바나나"));
			expect(onChange).toHaveBeenCalledWith("banana");
		});

		it("Option 클릭 시 onChange가 한 번만 호출된다", async () => {
			const { user, onChange } = renderSelect();
			await user.click(screen.getByText("선택"));
			await user.click(screen.getByText("사과"));
			expect(onChange).toHaveBeenCalledOnce();
		});
	});

	describe("Options children", () => {
		it("function children일 때 floating, interactions를 인자로 받는다", async () => {
			const childrenFn = vi.fn(() => <div>커스텀</div>);
			const user = userEvent.setup();

			render(
				<Select value="" onChange={vi.fn()}>
					<Select.Trigger>
						<button type="button">선택</button>
					</Select.Trigger>
					<Select.Options>{childrenFn}</Select.Options>
				</Select>,
			);

			await user.click(screen.getByText("선택"));

			expect(childrenFn).toHaveBeenCalledWith(
				expect.objectContaining({
					floating: expect.any(Object),
					interactions: expect.any(Object),
				}),
			);
		});

		it("ReactNode일 때 ul로 렌더링된다", async () => {
			const { user } = renderSelect();
			await user.click(screen.getByText("선택"));
			expect(screen.getByTestId("options").tagName).toBe("UL");
		});
	});
});

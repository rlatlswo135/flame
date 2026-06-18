import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./tabs";

const renderTabs = (props?: Partial<Parameters<typeof Tabs>[0]>) => {
	const user = userEvent.setup();

	render(
		<Tabs {...props}>
			<Tabs.Item value="tab1">탭 1</Tabs.Item>
			<Tabs.Item value="tab2">탭 2</Tabs.Item>
			<Tabs.Item value="tab3">탭 3</Tabs.Item>
		</Tabs>,
	);

	return { user };
};

describe("Tabs", () => {
	describe("탭 전환", () => {
		it("탭 클릭 시 해당 탭이 선택된다", async () => {
			const { user } = renderTabs();
			await user.click(screen.getByText("탭 2"));
			expect(screen.getByText("탭 2")).toHaveAttribute(
				"aria-selected",
				"true",
			);
		});

		it("탭 전환 시 이전 탭의 선택이 해제된다", async () => {
			const { user } = renderTabs({ initialTab: "tab1" });
			await user.click(screen.getByText("탭 2"));
			expect(screen.getByText("탭 1")).toHaveAttribute(
				"aria-selected",
				"false",
			);
		});

		it("연속으로 다른 탭을 클릭해도 마지막으로 클릭한 탭만 선택된다", async () => {
			const { user } = renderTabs();
			await user.click(screen.getByText("탭 1"));
			await user.click(screen.getByText("탭 3"));
			expect(screen.getByText("탭 3")).toHaveAttribute(
				"aria-selected",
				"true",
			);
			expect(screen.getByText("탭 1")).toHaveAttribute(
				"aria-selected",
				"false",
			);
		});
	});

	describe("initialTab", () => {
		it("initialTab에 해당하는 탭이 초기부터 선택된다", () => {
			renderTabs({ initialTab: "tab2" });
			expect(screen.getByText("탭 2")).toHaveAttribute(
				"aria-selected",
				"true",
			);
		});
	});

	describe("onChange 콜백", () => {
		it("탭 클릭 시 onChange가 해당 value로 호출된다", async () => {
			const onChange = vi.fn();
			const { user } = renderTabs({ onChange });
			await user.click(screen.getByText("탭 2"));
			expect(onChange).toHaveBeenCalledWith("tab2");
		});

		it("탭 클릭 시 onChange가 정확히 한 번 호출된다", async () => {
			const onChange = vi.fn();
			const { user } = renderTabs({ onChange });
			await user.click(screen.getByText("탭 1"));
			expect(onChange).toHaveBeenCalledTimes(1);
		});
	});

	describe("에러 처리", () => {
		it("Tabs.Item을 TabsRoot 외부에서 렌더링하면 에러가 발생한다", () => {
			expect(() =>
				render(<Tabs.Item value="tab1">탭 1</Tabs.Item>),
			).toThrow();
		});
	});
});

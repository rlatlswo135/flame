import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer } from "./drawer";

const renderDrawer = (props?: Parameters<typeof Drawer>[0]) => {
	const user = userEvent.setup();

	render(
		<Drawer {...props}>
			<Drawer.Trigger>
				<button type="button">열기</button>
			</Drawer.Trigger>
			<Drawer.Content data-testid="drawer">
				<p>드로어 내용</p>
			</Drawer.Content>
		</Drawer>,
	);

	return { user };
};

describe("Drawer", () => {
	describe("렌더링", () => {
		it("Trigger이 렌더링된다", () => {
			renderDrawer();
			expect(screen.getByText("열기")).toBeInTheDocument();
		});

		it("초기 상태에서 Content가 보이지 않는다", () => {
			renderDrawer();
			expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
		});
	});

	describe("열기/닫기", () => {
		it("Trigger 클릭 시 Content가 열린다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			expect(screen.getByTestId("drawer")).toBeInTheDocument();
		});

		it("backdrop 클릭 시 Content가 닫힌다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			await user.click(screen.getByTestId("drawer"));
			expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
		});

		it("ESC 키 누를 시 Content가 닫힌다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			await user.keyboard("{Escape}");
			expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
		});
	});

	describe("placement", () => {
		it("기본 placement는 right이다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			expect(screen.getByTestId("drawer")).toHaveAttribute(
				"data-placement",
				"right",
			);
		});

		it.each([
			"top",
			"left",
			"right",
			"bottom",
		] as const)("placement=%s 일 때 data-placement가 적용된다", async (placement) => {
			const { user } = renderDrawer({ placement });
			await user.click(screen.getByText("열기"));
			expect(screen.getByTestId("drawer")).toHaveAttribute(
				"data-placement",
				placement,
			);
		});
	});

	describe("콜백", () => {
		it("열릴 때 onOpen이 호출된다", async () => {
			const onOpen = vi.fn();
			const { user } = renderDrawer({ onOpen });
			await user.click(screen.getByText("열기"));
			expect(onOpen).toHaveBeenCalledOnce();
		});

		it("닫힐 때 onClose가 호출된다", async () => {
			const onClose = vi.fn();
			const { user } = renderDrawer({ onClose });
			await user.click(screen.getByText("열기"));
			await user.click(screen.getByTestId("drawer"));
			expect(onClose).toHaveBeenCalledOnce();
		});
	});
});

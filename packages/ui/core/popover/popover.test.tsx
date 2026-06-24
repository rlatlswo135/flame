import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "./popover";

const renderPopover = (props?: Parameters<typeof Popover>[0]) => {
	const user = userEvent.setup();

	render(
		<Popover {...props}>
			<Popover.Trigger>
				<button type="button">트리거</button>
			</Popover.Trigger>
			<Popover.Content data-testid="content">
				<p>콘텐츠</p>
			</Popover.Content>
		</Popover>,
	);

	return { user };
};

describe("Popover", () => {
	describe("클릭 인터랙션", () => {
		it("Trigger 클릭 시 Content가 열린다", async () => {
			const { user } = renderPopover();
			await user.click(screen.getByText("트리거"));
			expect(screen.getByTestId("content")).toBeInTheDocument();
		});

		it("열린 상태에서 Trigger 재클릭 시 닫힌다", async () => {
			const { user } = renderPopover();
			await user.click(screen.getByText("트리거"));
			await user.click(screen.getByText("트리거"));
			expect(screen.queryByTestId("content")).not.toBeInTheDocument();
		});
	});

	describe("dismiss", () => {
		it("외부 클릭 시 Content가 닫힌다", async () => {
			const { user } = renderPopover();
			await user.click(screen.getByText("트리거"));
			await user.click(document.body);
			expect(screen.queryByTestId("content")).not.toBeInTheDocument();
		});

		it("Escape 키로 Content가 닫힌다", async () => {
			const { user } = renderPopover();
			await user.click(screen.getByText("트리거"));
			await user.keyboard("{Escape}");
			expect(screen.queryByTestId("content")).not.toBeInTheDocument();
		});
	});

	describe("콜백", () => {
		it("열릴 때 onOpen이 호출된다", async () => {
			const onOpen = vi.fn();
			const { user } = renderPopover({ onOpen });
			await user.click(screen.getByText("트리거"));
			expect(onOpen).toHaveBeenCalledOnce();
		});

		it("닫힐 때 onClose가 호출된다", async () => {
			const onClose = vi.fn();
			const { user } = renderPopover({ onClose });
			await user.click(screen.getByText("트리거"));
			await user.click(screen.getByText("트리거"));
			expect(onClose).toHaveBeenCalledOnce();
		});
	});
});

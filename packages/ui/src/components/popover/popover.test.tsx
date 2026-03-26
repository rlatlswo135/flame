import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from ".";

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
	describe("렌더링", () => {
		it("Trigger이 렌더링된다", () => {
			renderPopover();
			expect(screen.getByText("트리거")).toBeInTheDocument();
		});

		it("초기 상태에서 Content가 보이지 않는다", () => {
			renderPopover();
			expect(screen.queryByTestId("content")).not.toBeInTheDocument();
		});
	});

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

	describe("Content children", () => {
		it("function children일 때 floating, interactions를 인자로 받는다", async () => {
			const childrenFn = vi.fn(() => <div>렌더</div>);
			const user = userEvent.setup();

			render(
				<Popover>
					<Popover.Trigger>
						<button type="button">트리거</button>
					</Popover.Trigger>
					<Popover.Content>{childrenFn}</Popover.Content>
				</Popover>,
			);

			await user.click(screen.getByText("트리거"));

			expect(childrenFn).toHaveBeenCalledWith(
				expect.objectContaining({
					floating: expect.any(Object),
					interactions: expect.any(Object),
				}),
			);
		});

		it("ReactNode일 때 section으로 렌더링된다", async () => {
			const { user } = renderPopover();
			await user.click(screen.getByText("트리거"));
			expect(screen.getByTestId("content").tagName).toBe("SECTION");
		});
	});
});

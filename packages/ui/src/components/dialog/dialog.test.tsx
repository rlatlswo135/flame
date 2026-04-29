import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "./dialog";

const renderDialog = (props?: Parameters<typeof Dialog>[0]) => {
	const user = userEvent.setup();

	render(
		<Dialog {...props}>
			<Dialog.Trigger>
				<button type="button">열기</button>
			</Dialog.Trigger>
			<Dialog.Content data-testid="dialog">
				<p>다이얼로그 내용</p>
				<Dialog.Closer>
					<button type="button">닫기</button>
				</Dialog.Closer>
			</Dialog.Content>
		</Dialog>,
	);

	return { user };
};

describe("Dialog", () => {
	describe("렌더링", () => {
		it("Trigger이 렌더링된다", () => {
			renderDialog();
			expect(screen.getByText("열기")).toBeInTheDocument();
		});

		it("Content(dialog)가 DOM에 존재한다", () => {
			renderDialog();
			expect(screen.getByTestId("dialog")).toBeInTheDocument();
		});
	});

	describe("접근성", () => {
		it("Trigger의 aria-controls가 Content의 id를 참조한다", () => {
			renderDialog();
			const trigger = screen.getByText("열기");
			const dialog = screen.getByTestId("dialog");
			expect(trigger).toHaveAttribute("aria-controls", dialog.id);
		});
	});

	describe("열기/닫기", () => {
		it("Trigger 클릭 시 Content가 열린다", async () => {
			const { user } = renderDialog();
			await user.click(screen.getByText("열기"));
			expect(screen.getByTestId("dialog").hasAttribute("open")).toBe(true);
		});

		it("Closer 클릭 시 Content가 닫힌다", async () => {
			const { user } = renderDialog();
			await user.click(screen.getByText("열기"));
			await user.click(screen.getByText("닫기"));
			expect(screen.getByTestId("dialog").hasAttribute("open")).toBe(false);
		});
	});

	describe("closeOutside", () => {
		it("closeOutside=true일 때 backdrop 클릭 시 닫힌다", async () => {
			const { user } = renderDialog({ closeOutside: true });
			await user.click(screen.getByText("열기"));
			await user.click(screen.getByTestId("dialog"));
			expect(screen.getByTestId("dialog").hasAttribute("open")).toBe(false);
		});

		it("closeOutside=false(기본)일 때 backdrop 클릭해도 닫히지 않는다", async () => {
			const { user } = renderDialog();
			await user.click(screen.getByText("열기"));
			await user.click(screen.getByTestId("dialog"));
			expect(screen.getByTestId("dialog").hasAttribute("open")).toBe(true);
		});
	});

	describe("keepMounted", () => {
		it("keepMounted=false(기본)일 때 닫히면 children이 렌더링되지 않는다", async () => {
			renderDialog();
			expect(screen.queryByText("다이얼로그 내용")).not.toBeInTheDocument();
		});

		it("keepMounted=true일 때 닫혀도 children이 렌더링된다", () => {
			renderDialog({ keepMounted: true });
			expect(screen.getByText("다이얼로그 내용")).toBeInTheDocument();
		});
	});

	describe("function children", () => {
		it("Trigger의 function children이 open을 인자로 받는다", () => {
			const childrenFn = vi.fn(() => (
				<button type="button">커스텀 열기</button>
			));

			render(
				<Dialog>
					<Dialog.Trigger>{childrenFn}</Dialog.Trigger>
					<Dialog.Content>
						<p>내용</p>
					</Dialog.Content>
				</Dialog>,
			);

			expect(childrenFn).toHaveBeenCalledWith(
				expect.objectContaining({ open: expect.any(Function) }),
			);
		});

		it("Closer의 function children이 close를 인자로 받는다", () => {
			const childrenFn = vi.fn(() => (
				<button type="button">커스텀 닫기</button>
			));

			render(
				<Dialog keepMounted>
					<Dialog.Trigger>
						<button type="button">열기</button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Closer>{childrenFn}</Dialog.Closer>
					</Dialog.Content>
				</Dialog>,
			);

			expect(childrenFn).toHaveBeenCalledWith(
				expect.objectContaining({ close: expect.any(Function) }),
			);
		});
	});
});

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
});

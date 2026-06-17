import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./accordion";

const renderAccordion = (props?: Parameters<typeof Accordion>[0]) => {
	const user = userEvent.setup();

	render(
		<Accordion {...props}>
			<Accordion.Item>
				<Accordion.Trigger>
					<button type="button">항목 1</button>
				</Accordion.Trigger>
				<Accordion.Content data-testid="content-1">
					<p>내용 1</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item>
				<Accordion.Trigger>
					<button type="button">항목 2</button>
				</Accordion.Trigger>
				<Accordion.Content data-testid="content-2">
					<p>내용 2</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion>,
	);

	return { user };
};

describe("Accordion", () => {
	describe("열기/닫기", () => {
		it("Trigger 클릭 시 해당 Content가 열린다", async () => {
			const { user } = renderAccordion();
			await user.click(screen.getByText("항목 1"));
			expect(screen.getByTestId("content-1")).toHaveAttribute(
				"data-expanded",
				"true",
			);
		});

		it("열린 상태에서 Trigger 재클릭 시 닫힌다", async () => {
			const { user } = renderAccordion();
			await user.click(screen.getByText("항목 1"));
			await user.click(screen.getByText("항목 1"));
			expect(screen.getByTestId("content-1")).toHaveAttribute(
				"data-expanded",
				"false",
			);
		});

		it("다른 Item의 Trigger를 클릭해도 기존 Item은 유지된다", async () => {
			const { user } = renderAccordion();
			await user.click(screen.getByText("항목 1"));
			await user.click(screen.getByText("항목 2"));
			expect(screen.getByTestId("content-1")).toHaveAttribute(
				"data-expanded",
				"true",
			);
			expect(screen.getByTestId("content-2")).toHaveAttribute(
				"data-expanded",
				"true",
			);
		});
	});

	describe("initialOpen", () => {
		it("initialOpen=true인 Item은 초기부터 열려있다", () => {
			render(
				<Accordion>
					<Accordion.Item initialOpen>
						<Accordion.Trigger>
							<button type="button">항목 1</button>
						</Accordion.Trigger>
						<Accordion.Content data-testid="content-1">
							<p>내용 1</p>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>,
			);

			expect(screen.getByTestId("content-1")).toHaveAttribute(
				"data-expanded",
				"true",
			);
		});
	});

	describe("single 모드", () => {
		it("다른 Item을 열면 기존 Item이 닫힌다", async () => {
			const { user } = renderAccordion({ single: true });
			await user.click(screen.getByText("항목 1"));
			await user.click(screen.getByText("항목 2"));
			expect(screen.getByTestId("content-1")).toHaveAttribute(
				"data-expanded",
				"false",
			);
			expect(screen.getByTestId("content-2")).toHaveAttribute(
				"data-expanded",
				"true",
			);
		});

		it("initialOpen과 함께 사용하면 해당 Item이 초기부터 열려있다", () => {
			render(
				<Accordion single>
					<Accordion.Item initialOpen>
						<Accordion.Trigger>
							<button type="button">항목 1</button>
						</Accordion.Trigger>
						<Accordion.Content data-testid="content-1">
							<p>내용 1</p>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item>
						<Accordion.Trigger>
							<button type="button">항목 2</button>
						</Accordion.Trigger>
						<Accordion.Content data-testid="content-2">
							<p>내용 2</p>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>,
			);

			expect(screen.getByTestId("content-1")).toHaveAttribute(
				"data-expanded",
				"true",
			);
			expect(screen.getByTestId("content-2")).toHaveAttribute(
				"data-expanded",
				"false",
			);
		});
	});

	describe("에러 처리", () => {
		it("Item 없이 Trigger를 렌더링하면 에러가 발생한다", () => {
			expect(() =>
				render(
					<Accordion.Trigger>
						<button type="button">항목</button>
					</Accordion.Trigger>,
				),
			).toThrow();
		});

		it("Item 없이 Content를 렌더링하면 에러가 발생한다", () => {
			expect(() =>
				render(<Accordion.Content>내용</Accordion.Content>),
			).toThrow();
		});
	});
});

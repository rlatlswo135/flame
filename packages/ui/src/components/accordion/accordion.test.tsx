import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from ".";

const renderAccordion = (props?: Parameters<typeof Accordion>[0]) => {
	const user = userEvent.setup();

	render(
		<Accordion {...props}>
			<Accordion.Item>
				<Accordion.Trigger>항목 1</Accordion.Trigger>
				<Accordion.Content data-testid="content-1">
					<p>내용 1</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item>
				<Accordion.Trigger>항목 2</Accordion.Trigger>
				<Accordion.Content data-testid="content-2">
					<p>내용 2</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion>,
	);

	return { user };
};

describe("Accordion", () => {
	describe("렌더링", () => {
		it("Trigger들이 렌더링된다", () => {
			renderAccordion();
			expect(screen.getByText("항목 1")).toBeInTheDocument();
			expect(screen.getByText("항목 2")).toBeInTheDocument();
		});

		it("초기 상태에서 Content가 보이지 않는다", () => {
			renderAccordion();
			expect(screen.queryByTestId("content-1")).not.toBeInTheDocument();
			expect(screen.queryByTestId("content-2")).not.toBeInTheDocument();
		});
	});

	describe("열기/닫기", () => {
		it("Trigger 클릭 시 해당 Content가 열린다", async () => {
			const { user } = renderAccordion();
			await user.click(screen.getByText("항목 1"));
			expect(screen.getByTestId("content-1")).toBeInTheDocument();
		});

		it("열린 상태에서 Trigger 재클릭 시 닫힌다", async () => {
			const { user } = renderAccordion();
			await user.click(screen.getByText("항목 1"));
			await user.click(screen.getByText("항목 1"));
			expect(screen.queryByTestId("content-1")).not.toBeInTheDocument();
		});

		it("다른 Item의 Trigger를 클릭해도 기존 Item은 유지된다", async () => {
			const { user } = renderAccordion();
			await user.click(screen.getByText("항목 1"));
			await user.click(screen.getByText("항목 2"));
			expect(screen.getByTestId("content-1")).toBeInTheDocument();
			expect(screen.getByTestId("content-2")).toBeInTheDocument();
		});
	});

	describe("initialOpen", () => {
		it("initialOpen=true일 때 초기 상태에서 Content가 보인다", () => {
			render(
				<Accordion>
					<Accordion.Item initialOpen>
						<Accordion.Trigger>항목 1</Accordion.Trigger>
						<Accordion.Content data-testid="content-1">
							<p>내용 1</p>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>,
			);

			expect(screen.getByTestId("content-1")).toBeInTheDocument();
		});
	});

	describe("single 모드", () => {
		it("single=true일 때 다른 Item을 열면 기존 Item이 닫힌다", async () => {
			const { user } = renderAccordion({ single: true });
			await user.click(screen.getByText("항목 1"));
			await user.click(screen.getByText("항목 2"));
			expect(screen.queryByTestId("content-1")).not.toBeInTheDocument();
			expect(screen.getByTestId("content-2")).toBeInTheDocument();
		});
	});
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Funnel } from "./funnel";

const renderFunnel = () => {
	const user = userEvent.setup();

	render(
		<Funnel>
			<Funnel.Step>
				<p>스텝 1</p>
				<Funnel.Next>
					<button type="button">다음</button>
				</Funnel.Next>
			</Funnel.Step>
			<Funnel.Step>
				<p>스텝 2</p>
				<Funnel.Prev>
					<button type="button">이전</button>
				</Funnel.Prev>
				<Funnel.Next>
					<button type="button">다음</button>
				</Funnel.Next>
			</Funnel.Step>
			<Funnel.Step>
				<p>스텝 3</p>
				<Funnel.Prev>
					<button type="button">이전</button>
				</Funnel.Prev>
			</Funnel.Step>
		</Funnel>,
	);

	return { user };
};

describe("Funnel", () => {
	describe("렌더링", () => {
		it("초기 상태에서 첫 번째 Step이 렌더링된다", () => {
			renderFunnel();
			expect(screen.getByText("스텝 1")).toBeInTheDocument();
		});

		it("초기 상태에서 두 번째 Step은 렌더링되지 않는다", () => {
			renderFunnel();
			expect(screen.queryByText("스텝 2")).not.toBeInTheDocument();
		});
	});

	describe("Next", () => {
		it("Next 클릭 시 다음 Step으로 이동한다", async () => {
			const { user } = renderFunnel();
			await user.click(screen.getByText("다음"));
			expect(screen.getByText("스텝 2")).toBeInTheDocument();
			expect(screen.queryByText("스텝 1")).not.toBeInTheDocument();
		});

		it("마지막 Step에서 Next 클릭 시 이동하지 않는다", async () => {
			const { user } = renderFunnel();
			await user.click(screen.getByText("다음"));
			await user.click(screen.getByText("다음"));
			expect(screen.getByText("스텝 3")).toBeInTheDocument();
		});
	});

	describe("Prev", () => {
		it("Prev 클릭 시 이전 Step으로 이동한다", async () => {
			const { user } = renderFunnel();
			await user.click(screen.getByText("다음"));
			await user.click(screen.getByText("이전"));
			expect(screen.getByText("스텝 1")).toBeInTheDocument();
		});

		it("첫 번째 Step에서 Prev 클릭 시 이동하지 않는다", () => {
			renderFunnel();
			expect(screen.getByText("스텝 1")).toBeInTheDocument();
		});
	});

	describe("접근성", () => {
		it("첫 번째 Step에서 Prev가 aria-disabled=true를 가진다", async () => {
			const { user } = renderFunnel();
			await user.click(screen.getByText("다음"));
			await user.click(screen.getByText("이전"));
			expect(screen.queryByText("이전")).not.toBeInTheDocument();
		});

		it("첫 번째 Step에서 Next가 aria-disabled=false를 가진다", () => {
			renderFunnel();
			expect(screen.getByText("다음")).toHaveAttribute("aria-disabled", "false");
		});

		it("중간 Step에서 Next와 Prev가 aria-disabled=false를 가진다", async () => {
			const { user } = renderFunnel();
			await user.click(screen.getByText("다음"));
			expect(screen.getByText("다음")).toHaveAttribute("aria-disabled", "false");
			expect(screen.getByText("이전")).toHaveAttribute("aria-disabled", "false");
		});
	});

	describe("jump", () => {
		it("function children으로 jump를 받아 특정 Step으로 이동한다", async () => {
			const user = userEvent.setup();

			render(
				<Funnel>
					<Funnel.Step>
						{({ jump }) => (
							<div>
								<p>스텝 1</p>
								<button type="button" onClick={() => jump(2)}>
									3번째로 이동
								</button>
							</div>
						)}
					</Funnel.Step>
					<Funnel.Step>
						<p>스텝 2</p>
					</Funnel.Step>
					<Funnel.Step>
						<p>스텝 3</p>
					</Funnel.Step>
				</Funnel>,
			);

			await user.click(screen.getByText("3번째로 이동"));
			expect(screen.getByText("스텝 3")).toBeInTheDocument();
		});

		it("범위 밖 jump는 무시된다", async () => {
			const user = userEvent.setup();

			render(
				<Funnel>
					<Funnel.Step>
						{({ jump }) => (
							<div>
								<p>스텝 1</p>
								<button type="button" onClick={() => jump(99)}>
									범위 밖 이동
								</button>
							</div>
						)}
					</Funnel.Step>
					<Funnel.Step>
						<p>스텝 2</p>
					</Funnel.Step>
				</Funnel>,
			);

			await user.click(screen.getByText("범위 밖 이동"));
			expect(screen.getByText("스텝 1")).toBeInTheDocument();
		});
	});
});

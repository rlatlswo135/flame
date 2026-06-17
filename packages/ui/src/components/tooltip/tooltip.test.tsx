import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip, type TooltipProps } from "./tooltip";

const TOOLTIP_TEXT = "툴팁 내용";

const renderTooltip = (props?: Partial<TooltipProps>) => {
	const user = userEvent.setup();

	render(
		<Tooltip {...props}>
			<Tooltip.Trigger>
				<button type="button">트리거</button>
			</Tooltip.Trigger>
			<Tooltip.Content>{TOOLTIP_TEXT}</Tooltip.Content>
		</Tooltip>,
	);

	return { user, trigger: screen.getByText("트리거") };
};

describe("Tooltip", () => {
	describe("렌더링", () => {
		it("Trigger가 렌더링된다", () => {
			renderTooltip();
			expect(screen.getByText("트리거")).toBeInTheDocument();
		});

		it("초기 상태에서는 Content가 보이지 않는다", () => {
			renderTooltip();
			expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeInTheDocument();
		});
	});

	describe("hover 인터랙션", () => {
		it("Trigger에 hover하면 Content가 열린다", async () => {
			const { user, trigger } = renderTooltip();
			await user.hover(trigger);
			expect(await screen.findByText(TOOLTIP_TEXT)).toBeInTheDocument();
		});

		it("hover를 벗어나면 Content가 닫힌다", async () => {
			const { user, trigger } = renderTooltip();
			await user.hover(trigger);
			await screen.findByText(TOOLTIP_TEXT);

			await user.unhover(trigger);
			await waitFor(() => {
				expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeInTheDocument();
			});
		});
	});

	describe("focus 인터랙션", () => {
		it("Trigger가 focus되면 Content가 열린다(키보드 접근성)", async () => {
			const { user } = renderTooltip();
			await user.tab();
			expect(await screen.findByText(TOOLTIP_TEXT)).toBeInTheDocument();
		});
	});

	describe("dismiss", () => {
		it("Escape 키로 Content가 닫힌다", async () => {
			const { user, trigger } = renderTooltip();
			await user.hover(trigger);
			await screen.findByText(TOOLTIP_TEXT);

			await user.keyboard("{Escape}");
			await waitFor(() => {
				expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeInTheDocument();
			});
		});
	});

	describe("enabled", () => {
		it("enabled가 false면 hover해도 Content가 열리지 않는다", async () => {
			const { user, trigger } = renderTooltip({ enabled: false });
			await user.hover(trigger);

			await waitFor(() => {
				expect(screen.queryByText(TOOLTIP_TEXT)).not.toBeInTheDocument();
			});
		});
	});

	describe("접근성", () => {
		it("열린 Content에 role='tooltip'이 부여된다", async () => {
			const { user, trigger } = renderTooltip();
			await user.hover(trigger);
			expect(await screen.findByRole("tooltip")).toBeInTheDocument();
		});

		it("열리면 Trigger가 aria-describedby로 Content를 가리킨다", async () => {
			const { user, trigger } = renderTooltip();
			await user.hover(trigger);
			const tooltip = await screen.findByRole("tooltip");

			expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
		});
	});

	describe("Content children", () => {
		it("function children일 때 floating, interactions를 인자로 받는다", async () => {
			const childrenFn = vi.fn(() => <div>렌더</div>);
			const user = userEvent.setup();

			render(
				<Tooltip>
					<Tooltip.Trigger>
						<button type="button">트리거</button>
					</Tooltip.Trigger>
					<Tooltip.Content>{childrenFn}</Tooltip.Content>
				</Tooltip>,
			);

			await user.hover(screen.getByText("트리거"));

			expect(childrenFn).toHaveBeenCalledWith(
				expect.objectContaining({
					floating: expect.any(Object),
					interactions: expect.any(Object),
				}),
			);
		});

		it("ReactNode children이 렌더링된다", async () => {
			const { user, trigger } = renderTooltip();
			await user.hover(trigger);
			expect(await screen.findByText(TOOLTIP_TEXT)).toBeInTheDocument();
		});
	});

	describe("콜백", () => {
		it("열릴 때 onOpen이 호출된다", async () => {
			const onOpen = vi.fn();
			const { user, trigger } = renderTooltip({ onOpen });
			await user.hover(trigger);

			await waitFor(() => expect(onOpen).toHaveBeenCalledOnce());
		});

		it("닫힐 때 onClose가 호출된다", async () => {
			const onClose = vi.fn();
			const { user, trigger } = renderTooltip({ onClose });
			await user.hover(trigger);
			await screen.findByText(TOOLTIP_TEXT);

			await user.unhover(trigger);
			await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
		});
	});
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip, type TooltipRootProps } from "./tooltip";

const TOOLTIP_TEXT = "툴팁 내용";

const renderTooltip = (props?: Partial<TooltipRootProps>) => {
	const user = userEvent.setup();

	render(
		<Tooltip {...props}>
			<Tooltip.Trigger>
				<button type="button">트리거</button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<span>{TOOLTIP_TEXT}</span>
			</Tooltip.Content>
		</Tooltip>,
	);

	return { user, trigger: screen.getByText("트리거") };
};

describe("Tooltip", () => {
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
		it("Trigger가 focus되면 Content가 열린다", async () => {
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

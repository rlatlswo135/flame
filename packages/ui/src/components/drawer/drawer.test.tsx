import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer } from "./drawer";

const getDim = (content: HTMLElement) =>
	content.previousElementSibling as HTMLElement;

const renderDrawer = (props?: Parameters<typeof Drawer>[0]) => {
	const user = userEvent.setup();

	render(
		<Drawer {...props}>
			<Drawer.Trigger>
				<button type="button">열기</button>
			</Drawer.Trigger>
			<Drawer.Content data-testid="drawer">
				<p>드로어 내용</p>
				<form>
					<input />
					<button type="submit">Submit</button>
				</form>
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

		it("dim 영역 클릭 시 Content가 닫힌다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			await user.click(getDim(screen.getByTestId("drawer")));
			await waitFor(() =>
				expect(screen.queryByTestId("drawer")).not.toBeInTheDocument(),
			);
		});

		it("ESC 키 누를 시 Content가 닫힌다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			await user.keyboard("{Escape}");
			await waitFor(() =>
				expect(screen.queryByTestId("drawer")).not.toBeInTheDocument(),
			);
		});

		it("Content 내부 클릭 시 닫히지 않는다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			await user.click(screen.getByText("드로어 내용"));
			expect(screen.getByTestId("drawer")).toBeInTheDocument();
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

	describe("접근성", () => {
		it("Content에 role=dialog가 부여된다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			expect(screen.getByTestId("drawer")).toHaveAttribute("role", "dialog");
		});

		it("Content에 aria-modal=true가 부여된다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			expect(screen.getByTestId("drawer")).toHaveAttribute(
				"aria-modal",
				"true",
			);
		});

		it("Trigger에 aria-expanded가 상태에 따라 변한다", async () => {
			const { user } = renderDrawer();
			const trigger = screen.getByText("열기");
			expect(trigger).toHaveAttribute("aria-expanded", "false");
			await user.click(trigger);
			expect(trigger).toHaveAttribute("aria-expanded", "true");
		});

		it("열릴 때 Content 내부로 포커스가 이동한다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			await waitFor(() => {
				const drawer = screen.getByTestId("drawer");
				expect(drawer.contains(document.activeElement)).toBe(true);
			});
		});

		it("Tab 키로 포커스가 Content 밖으로 나가지 않는다", async () => {
			const user = userEvent.setup();
			render(
				<Drawer>
					<Drawer.Trigger>
						<button type="button">열기</button>
					</Drawer.Trigger>
					<Drawer.Content data-testid="drawer">
						<button type="button">첫 번째</button>
						<button type="button">두 번째</button>
					</Drawer.Content>
				</Drawer>,
			);
			await user.click(screen.getByText("열기"));
			await waitFor(() => {
				const drawer = screen.getByTestId("drawer");
				expect(drawer.contains(document.activeElement)).toBe(true);
			});
			const drawer = screen.getByTestId("drawer");

			// 마지막 요소에서 Tab → 첫 번째 요소로 순환
			screen.getByText("두 번째").focus();
			await user.tab();
			expect(drawer.contains(document.activeElement)).toBe(true);
		});

		it("Shift+Tab으로도 포커스가 Content 밖으로 나가지 않는다", async () => {
			const user = userEvent.setup();
			render(
				<Drawer>
					<Drawer.Trigger>
						<button type="button">열기</button>
					</Drawer.Trigger>
					<Drawer.Content data-testid="drawer">
						<button type="button">첫 번째</button>
						<button type="button">두 번째</button>
					</Drawer.Content>
				</Drawer>,
			);
			await user.click(screen.getByText("열기"));
			await waitFor(() => {
				const drawer = screen.getByTestId("drawer");
				expect(drawer.contains(document.activeElement)).toBe(true);
			});
			const drawer = screen.getByTestId("drawer");

			// 첫 번째 요소에서 Shift+Tab → 마지막 요소로 순환
			screen.getByText("첫 번째").focus();
			await user.tab({ shift: true });
			expect(drawer.contains(document.activeElement)).toBe(true);
		});

		it("닫힐 때 Trigger로 포커스가 복원된다", async () => {
			const { user } = renderDrawer();
			const trigger = screen.getByText("열기");
			await user.click(trigger);
			await user.click(getDim(screen.getByTestId("drawer")));
			await waitFor(() => expect(document.activeElement).toBe(trigger));
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
			await user.click(getDim(screen.getByTestId("drawer")));
			expect(onClose).toHaveBeenCalledOnce();
		});
	});

	describe("Closer", () => {
		it("Closer 클릭 시 Content가 닫힌다", async () => {
			const user = userEvent.setup();
			render(
				<Drawer>
					<Drawer.Trigger>
						<button type="button">열기</button>
					</Drawer.Trigger>
					<Drawer.Content data-testid="drawer">
						<Drawer.Closer>
							<button type="button">닫기</button>
						</Drawer.Closer>
						<p>드로어 내용</p>
					</Drawer.Content>
				</Drawer>,
			);
			await user.click(screen.getByText("열기"));
			expect(screen.getByTestId("drawer")).toBeInTheDocument();
			await user.click(screen.getByText("닫기"));
			await waitFor(() =>
				expect(screen.queryByTestId("drawer")).not.toBeInTheDocument(),
			);
		});
	});

	describe("portal", () => {
		it("Content가 document.body에 portal로 렌더링된다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			const drawer = screen.getByTestId("drawer");
			expect(document.body).toContainElement(drawer);
		});
	});

	describe("중첩 drawer", () => {
		const renderNestedDrawer = () => {
			const user = userEvent.setup();
			render(
				<Drawer>
					<Drawer.Trigger>
						<button type="button">외부 열기</button>
					</Drawer.Trigger>
					<Drawer.Content data-testid="outer-drawer">
						<p>외부 드로어</p>
						<Drawer>
							<Drawer.Trigger>
								<button type="button">내부 열기</button>
							</Drawer.Trigger>
							<Drawer.Content data-testid="inner-drawer">
								<p>내부 드로어</p>
							</Drawer.Content>
						</Drawer>
					</Drawer.Content>
				</Drawer>,
			);
			return { user };
		};

		it("외부 drawer 안에서 내부 drawer를 열 수 있다", async () => {
			const { user } = renderNestedDrawer();
			await user.click(screen.getByText("외부 열기"));
			await user.click(screen.getByText("내부 열기"));
			expect(screen.getByTestId("inner-drawer")).toBeInTheDocument();
			expect(screen.getByTestId("outer-drawer")).toBeInTheDocument();
		});

		it("내부 drawer의 dim 클릭 시 내부만 닫힌다", async () => {
			const { user } = renderNestedDrawer();
			await user.click(screen.getByText("외부 열기"));
			await user.click(screen.getByText("내부 열기"));
			await user.click(getDim(screen.getByTestId("inner-drawer")));
			await waitFor(() =>
				expect(screen.queryByTestId("inner-drawer")).not.toBeInTheDocument(),
			);
			expect(screen.getByTestId("outer-drawer")).toBeInTheDocument();
		});

		it("내부 drawer의 ESC 시 내부만 닫힌다", async () => {
			const { user } = renderNestedDrawer();
			await user.click(screen.getByText("외부 열기"));
			await user.click(screen.getByText("내부 열기"));
			await user.keyboard("{Escape}");
			await waitFor(() =>
				expect(screen.queryByTestId("inner-drawer")).not.toBeInTheDocument(),
			);
			expect(screen.getByTestId("outer-drawer")).toBeInTheDocument();
		});

		it("내부 drawer가 외부보다 높은 z-index를 갖는다", async () => {
			const { user } = renderNestedDrawer();
			await user.click(screen.getByText("외부 열기"));
			await user.click(screen.getByText("내부 열기"));
			const outer = screen.getByTestId("outer-drawer");
			const inner = screen.getByTestId("inner-drawer");
			const outerZ = Number(outer.parentElement?.style.zIndex || 0);
			const innerZ = Number(inner.parentElement?.style.zIndex || 0);
			expect(innerZ).toBeGreaterThan(outerZ);
		});
	});

	describe("에러 처리", () => {
		it("Drawer 없이 Trigger를 렌더링하면 에러가 발생한다", () => {
			expect(() =>
				render(
					<Drawer.Trigger>
						<button type="button">열기</button>
					</Drawer.Trigger>,
				),
			).toThrow();
		});

		it("Drawer 없이 Content를 렌더링하면 에러가 발생한다", () => {
			expect(() =>
				render(<Drawer.Content>내용</Drawer.Content>),
			).toThrow();
		});
	});
});

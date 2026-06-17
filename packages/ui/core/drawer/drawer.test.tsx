import { render, screen } from "@testing-library/react";
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
	describe("열기/닫기", () => {
		it("Trigger 클릭 시 Content가 열린다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			expect(screen.getByTestId("drawer").style.visibility).toBe("visible");
		});

		it("dim 영역 클릭 시 Content가 닫힌다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			await user.click(getDim(screen.getByTestId("drawer")));
			expect(screen.getByTestId("drawer").style.visibility).toBe("hidden");
		});

		it("ESC 키 누를 시 Content가 닫힌다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			await user.keyboard("{Escape}");
			expect(screen.getByTestId("drawer").style.visibility).toBe("hidden");
		});

		it("Content 내부 클릭 시 닫히지 않는다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			await user.click(screen.getByText("드로어 내용"));
			expect(screen.getByTestId("drawer").style.visibility).toBe("visible");
		});
	});

	describe("FocusTrap", () => {
		it("열릴 때 Content 내부로 포커스가 이동한다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			const drawer = screen.getByTestId("drawer");
			expect(drawer.contains(document.activeElement)).toBe(true);
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
			const drawer = screen.getByTestId("drawer");

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
			const drawer = screen.getByTestId("drawer");

			screen.getByText("첫 번째").focus();
			await user.tab({ shift: true });
			expect(drawer.contains(document.activeElement)).toBe(true);
		});

		it("닫힐 때 Trigger로 포커스가 복원된다", async () => {
			const { user } = renderDrawer();
			const trigger = screen.getByText("열기");
			await user.click(trigger);
			await user.click(getDim(screen.getByTestId("drawer")));
			expect(document.activeElement).toBe(trigger);
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
			expect(screen.getByTestId("drawer").style.visibility).toBe("visible");
			await user.click(screen.getByText("닫기"));
			expect(screen.getByTestId("drawer").style.visibility).toBe("hidden");
		});
	});

	describe("render function children", () => {
		it("Trigger의 render function이 open 핸들러를 받는다", async () => {
			const user = userEvent.setup();
			render(
				<Drawer>
					<Drawer.Trigger>
						{({ open }) => (
							<button type="button" onClick={open}>
								custom open
							</button>
						)}
					</Drawer.Trigger>
					<Drawer.Content data-testid="drawer">내용</Drawer.Content>
				</Drawer>,
			);
			await user.click(screen.getByText("custom open"));
			expect(screen.getByTestId("drawer").style.visibility).toBe("visible");
		});

		it("Closer의 render function이 close 핸들러를 받는다", async () => {
			const user = userEvent.setup();
			render(
				<Drawer>
					<Drawer.Trigger>
						<button type="button">열기</button>
					</Drawer.Trigger>
					<Drawer.Content data-testid="drawer">
						<Drawer.Closer>
							{({ close }) => (
								<button type="button" onClick={close}>
									custom close
								</button>
							)}
						</Drawer.Closer>
					</Drawer.Content>
				</Drawer>,
			);
			await user.click(screen.getByText("열기"));
			await user.click(screen.getByText("custom close"));
			expect(screen.getByTestId("drawer").style.visibility).toBe("hidden");
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
			expect(screen.getByTestId("inner-drawer").style.visibility).toBe(
				"visible",
			);
			expect(screen.getByTestId("outer-drawer").style.visibility).toBe(
				"visible",
			);
		});

		it("내부 drawer의 dim 클릭 시 내부만 닫힌다", async () => {
			const { user } = renderNestedDrawer();
			await user.click(screen.getByText("외부 열기"));
			await user.click(screen.getByText("내부 열기"));
			await user.click(getDim(screen.getByTestId("inner-drawer")));
			expect(screen.getByTestId("inner-drawer").style.visibility).toBe(
				"hidden",
			);
			expect(screen.getByTestId("outer-drawer").style.visibility).toBe(
				"visible",
			);
		});

		it("내부 drawer의 ESC 시 내부만 닫힌다", async () => {
			const { user } = renderNestedDrawer();
			await user.click(screen.getByText("외부 열기"));
			await user.click(screen.getByText("내부 열기"));
			await user.keyboard("{Escape}");
			expect(screen.getByTestId("inner-drawer").style.visibility).toBe(
				"hidden",
			);
			expect(screen.getByTestId("outer-drawer").style.visibility).toBe(
				"visible",
			);
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
			expect(() => render(<Drawer.Content>내용</Drawer.Content>)).toThrow();
		});
	});
});

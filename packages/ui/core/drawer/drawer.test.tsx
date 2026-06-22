import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer } from "./drawer";

beforeEach(() => {
	HTMLDialogElement.prototype.showModal = vi.fn(function (
		this: HTMLDialogElement,
	) {
		this.setAttribute("open", "");
	});
	HTMLDialogElement.prototype.close = vi.fn(function (
		this: HTMLDialogElement,
	) {
		this.removeAttribute("open");
		this.dispatchEvent(new Event("close"));
	});

	// reducedMotion=true로 설정해 close() 시 transitionend 없이 dialog.close()가 즉시 호출되게 한다.
	// (JSDOM은 CSS transition을 실행하지 않으므로 transitionend가 발화되지 않음)
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		configurable: true,
		value: vi.fn((query: string) => ({
			matches: query === "(prefers-reduced-motion: reduce)",
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		})),
	});
});

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
			expect(screen.getByTestId("drawer").hasAttribute("open")).toBe(true);
		});

		it("Escape 키로 Content가 닫힌다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			const drawer = screen.getByTestId("drawer");
			// JSDOM은 native dialog의 Escape → cancel 이벤트를 발화하지 않아 직접 디스패치
			await act(async () => {
				drawer.dispatchEvent(new Event("cancel", { cancelable: true }));
			});
			expect(drawer.hasAttribute("open")).toBe(false);
		});

		it("Content 내부 클릭 시 닫히지 않는다", async () => {
			const { user } = renderDrawer();
			await user.click(screen.getByText("열기"));
			await user.click(screen.getByText("드로어 내용"));
			expect(screen.getByTestId("drawer").hasAttribute("open")).toBe(true);
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
					</Drawer.Content>
				</Drawer>,
			);
			await user.click(screen.getByText("열기"));
			await user.click(screen.getByText("닫기"));
			expect(screen.getByTestId("drawer").hasAttribute("open")).toBe(false);
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
			const user = userEvent.setup();
			render(
				<Drawer onClose={onClose}>
					<Drawer.Trigger>
						<button type="button">열기</button>
					</Drawer.Trigger>
					<Drawer.Content data-testid="drawer">
						<Drawer.Closer>
							<button type="button">닫기</button>
						</Drawer.Closer>
					</Drawer.Content>
				</Drawer>,
			);
			await user.click(screen.getByText("열기"));
			await user.click(screen.getByText("닫기"));
			expect(onClose).toHaveBeenCalledOnce();
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
			expect(screen.getByTestId("drawer").hasAttribute("open")).toBe(true);
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
			expect(screen.getByTestId("drawer").hasAttribute("open")).toBe(false);
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
			expect(screen.getByTestId("inner-drawer").hasAttribute("open")).toBe(
				true,
			);
			expect(screen.getByTestId("outer-drawer").hasAttribute("open")).toBe(
				true,
			);
		});

		it("내부 drawer를 Escape로 닫아도 외부 drawer는 유지된다", async () => {
			const { user } = renderNestedDrawer();
			await user.click(screen.getByText("외부 열기"));
			await user.click(screen.getByText("내부 열기"));
			const innerDrawer = screen.getByTestId("inner-drawer");
			// cancel은 bubbles:false인 native 이벤트다 — 외부 drawer로 전파되지 않는다
			await act(async () => {
				innerDrawer.dispatchEvent(
					new Event("cancel", { cancelable: true }),
				);
			});
			expect(innerDrawer.hasAttribute("open")).toBe(false);
			expect(screen.getByTestId("outer-drawer").hasAttribute("open")).toBe(
				true,
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

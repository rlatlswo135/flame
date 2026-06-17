import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast, toastStore } from "./store";
import { Toast, Toaster } from "./toast";

const renderToaster = (props?: Parameters<typeof Toaster>[0]) => {
	const user = userEvent.setup();
	render(<Toaster animation={false} {...props} />);
	return { user };
};

describe("Toast", () => {
	beforeEach(() => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
	});

	afterEach(() => {
		toastStore.reset();
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
	});

	describe("toast 추가", () => {
		it("toast() 호출 시 콘텐츠가 렌더링된다", () => {
			renderToaster();
			act(() => {
				toast(<div>알림 메시지</div>);
			});
			expect(screen.getByText("알림 메시지")).toBeInTheDocument();
		});

		it("여러 toast를 추가하면 모두 렌더링된다", () => {
			renderToaster();
			act(() => {
				toast(<div>첫 번째</div>);
				toast(<div>두 번째</div>);
			});
			expect(screen.getByText("첫 번째")).toBeInTheDocument();
			expect(screen.getByText("두 번째")).toBeInTheDocument();
		});

		it("최신 toast가 먼저 렌더링된다", () => {
			renderToaster();
			act(() => {
				toast(<div>먼저</div>);
				toast(<div>나중</div>);
			});
			const wrapper = document.querySelector(
				"[data-toast-container]",
			)?.firstElementChild;
			const items = wrapper?.children;
			expect(items?.[0]?.textContent).toContain("나중");
			expect(items?.[1]?.textContent).toContain("먼저");
		});
	});

	describe("toast 제거", () => {
		it("기본 timeout(3초) 후 자동으로 제거된다", () => {
			renderToaster();
			act(() => {
				toast(<div>사라질 메시지</div>);
			});
			expect(screen.getByText("사라질 메시지")).toBeInTheDocument();

			act(() => {
				vi.advanceTimersByTime(3000);
			});
			expect(screen.queryByText("사라질 메시지")).not.toBeInTheDocument();
		});

		it("커스텀 timeout을 지정할 수 있다", () => {
			renderToaster();
			act(() => {
				toast(<div>5초 메시지</div>, { timeout: 5000 });
			});

			act(() => {
				vi.advanceTimersByTime(3000);
			});
			expect(screen.getByText("5초 메시지")).toBeInTheDocument();

			act(() => {
				vi.advanceTimersByTime(2000);
			});
			expect(screen.queryByText("5초 메시지")).not.toBeInTheDocument();
		});

		it("클릭 시 즉시 제거된다", async () => {
			const { user } = renderToaster();
			act(() => {
				toast(<div>클릭 제거</div>);
			});
			await user.click(screen.getByText("클릭 제거"));
			expect(screen.queryByText("클릭 제거")).not.toBeInTheDocument();
		});
	});

	describe("에러 처리", () => {
		it("Toast 없이 Title을 렌더링하면 에러가 발생한다", () => {
			expect(() => render(<Toast.Title>제목</Toast.Title>)).toThrow();
		});

		it("Toast 없이 Description을 렌더링하면 에러가 발생한다", () => {
			expect(() =>
				render(<Toast.Description>설명</Toast.Description>),
			).toThrow();
		});
	});
});

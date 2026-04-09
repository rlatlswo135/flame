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

	describe("렌더링", () => {
		it("Toaster가 렌더링된다", () => {
			renderToaster();
			expect(
				document.querySelector("[data-toast-container]"),
			).toBeInTheDocument();
		});

		it("초기 상태에서 toast가 없다", () => {
			renderToaster();
			const wrapper = document.querySelector(
				"[data-toast-container]",
			)?.firstElementChild;
			expect(wrapper?.children.length).toBe(0);
		});
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

	describe("Toast compound", () => {
		it("Toast.Title이 렌더링된다", () => {
			renderToaster();
			act(() => {
				toast(
					<Toast>
						<Toast.Title>성공</Toast.Title>
					</Toast>,
				);
			});
			expect(screen.getByText("성공")).toBeInTheDocument();
		});

		it("Toast.Description이 렌더링된다", () => {
			renderToaster();
			act(() => {
				toast(
					<Toast>
						<Toast.Title>알림</Toast.Title>
						<Toast.Description>저장되었습니다</Toast.Description>
					</Toast>,
				);
			});
			expect(screen.getByText("저장되었습니다")).toBeInTheDocument();
		});

		it("Toast에 role=status가 부여된다", () => {
			renderToaster();
			act(() => {
				toast(
					<Toast data-testid="toast-item">
						<Toast.Title>테스트</Toast.Title>
					</Toast>,
				);
			});
			expect(screen.getByTestId("toast-item")).toHaveAttribute(
				"role",
				"status",
			);
		});

		it("Toast.Title과 aria-labelledby가 연결된다", () => {
			renderToaster();
			act(() => {
				toast(
					<Toast data-testid="toast-item">
						<Toast.Title>제목</Toast.Title>
					</Toast>,
				);
			});
			const toastEl = screen.getByTestId("toast-item");
			const labelledBy = toastEl.getAttribute("aria-labelledby");
			const titleEl = document.getElementById(labelledBy!);
			expect(titleEl?.textContent).toBe("제목");
		});

		it("Toast.Description과 aria-describedby가 연결된다", () => {
			renderToaster();
			act(() => {
				toast(
					<Toast data-testid="toast-item">
						<Toast.Title>제목</Toast.Title>
						<Toast.Description>설명</Toast.Description>
					</Toast>,
				);
			});
			const toastEl = screen.getByTestId("toast-item");
			const describedBy = toastEl.getAttribute("aria-describedby");
			const descEl = document.getElementById(describedBy!);
			expect(descEl?.textContent).toBe("설명");
		});
	});

	describe("placement & style", () => {
		const getContainer = () =>
			document.querySelector("[data-toast-container]") as HTMLElement;

		const getWrapper = () => getContainer().firstElementChild as HTMLElement;

		it("컨테이너에 position: fixed, inset: 0, pointerEvents: none이 적용된다", () => {
			renderToaster();
			const container = getContainer();
			expect(container.style.position).toBe("fixed");
			expect(container.style.inset).toBe("0");
			expect(container.style.pointerEvents).toBe("none");
		});

		it("기본 placement(bottom-left) style이 wrapper에 적용된다", () => {
			renderToaster();
			act(() => {
				toast(<div>placement test</div>);
			});
			const wrapper = getWrapper();
			expect(wrapper.style.bottom).toBe("10px");
			expect(wrapper.style.left).toBe("10px");
		});

		it("top-right placement style이 wrapper에 적용된다", () => {
			renderToaster({ placement: "top-right" });
			act(() => {
				toast(<div>placement test</div>);
			});
			const wrapper = getWrapper();
			expect(wrapper.style.top).toBe("10px");
			expect(wrapper.style.right).toBe("10px");
		});

		it("toast item에 pointerEvents: auto가 적용된다", () => {
			renderToaster();
			act(() => {
				toast(<div>wrapper test</div>);
			});
			const toastItem = getWrapper().firstElementChild as HTMLElement;
			expect(toastItem.style.pointerEvents).toBe("auto");
		});

		it("사용자 style prop이 wrapper에 머지된다", () => {
			renderToaster({ style: { zIndex: 9999 } });
			act(() => {
				toast(<div>style test</div>);
			});
			const wrapper = getWrapper();
			expect(wrapper.style.zIndex).toBe("9999");
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

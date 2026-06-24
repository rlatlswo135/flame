describe("Combobox", () => {
	describe("열림/닫힘", () => {
		it("Input 클릭 시 Options가 열린다", async () => {});

		it("Input에 타이핑 시 Options가 열린다", async () => {});

		it("Escape 키로 Options가 닫힌다", async () => {});

		it("외부 클릭 시 Options가 닫힌다", async () => {});
	});

	describe("필터링", () => {
		it("Input 값으로 Options가 필터링된다", async () => {});

		it("매칭되는 항목이 없으면 Options 목록이 비어있다", async () => {});

		it("Input을 지우면 전체 Options가 다시 표시된다", async () => {});
	});

	describe("Option 선택", () => {
		it("Option 클릭 시 onChange가 해당 value로 호출된다", async () => {});

		it("Option 클릭 시 onChange가 한 번만 호출된다", async () => {});

		it("Option 클릭 시 Options가 닫힌다", async () => {});

		it("Option 선택 후 Input에 선택된 항목의 레이블이 표시된다", async () => {});
	});

	describe("키보드 네비게이션", () => {
		it("ArrowDown으로 첫 번째 Option이 활성화된다", async () => {});

		it("ArrowDown 반복으로 다음 Option으로 이동한다", async () => {});

		it("ArrowUp으로 이전 Option으로 이동한다", async () => {});

		it("마지막 Option에서 ArrowDown 시 첫 번째로 순환한다", async () => {});

		it("Enter로 활성화된 Option이 선택된다", async () => {});

		it("Enter 선택 후 Options가 닫힌다", async () => {});
	});

	describe("Input 값 복원", () => {
		it("Escape 시 Input 값이 선택된 항목의 레이블로 복원된다", async () => {});

		it("선택 없이 외부 클릭 시 Input 값이 복원된다", async () => {});
	});

	describe("콜백", () => {
		it("열릴 때 onOpen이 호출된다", async () => {});

		it("닫힐 때 onClose가 호출된다", async () => {});
	});
});

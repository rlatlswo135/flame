import { Tooltip } from "@flame/ui";

export const DefaultExample = () => {
	return (
		<Tooltip>
			<Tooltip.Trigger>
				<button type="button">hover me</button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<div>툴팁 내용입니다</div>
			</Tooltip.Content>
		</Tooltip>
	);
};

export const WithPlacementExample = () => {
	return (
		<div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
			{(["top", "right", "bottom", "left"] as const).map((placement) => (
				<Tooltip key={placement} placement={placement}>
					<Tooltip.Trigger>
						<button type="button">{placement}</button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<div>{placement} 툴팁</div>
					</Tooltip.Content>
				</Tooltip>
			))}
		</div>
	);
};

export const WithDelayExample = () => {
	return (
		<Tooltip delay={{ open: 500, close: 200 }}>
			<Tooltip.Trigger>
				<button type="button">hover (delay 500ms)</button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<div>열림 지연 500ms, 닫힘 지연 200ms</div>
			</Tooltip.Content>
		</Tooltip>
	);
};

export const DisabledExample = () => {
	return (
		<Tooltip enabled={false}>
			<Tooltip.Trigger>
				<button type="button">hover me (disabled)</button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<div>이 툴팁은 표시되지 않습니다</div>
			</Tooltip.Content>
		</Tooltip>
	);
};

export const FullCustomExample = () => {
	return (
		<Tooltip>
			<Tooltip.Trigger>
				<button type="button">hover for custom tooltip</button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				{({ floating, interactions }) => (
					<div
						ref={floating.refs.setFloating}
						style={floating.floatingStyles}
						{...interactions.getFloatingProps()}
					>
						커스텀 툴팁
					</div>
				)}
			</Tooltip.Content>
		</Tooltip>
	);
};

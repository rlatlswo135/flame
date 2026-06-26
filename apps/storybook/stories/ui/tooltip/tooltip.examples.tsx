import { Tooltip } from "@flame/ui";

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

import { Popover } from "@flame/ui";

export const FullCustomExample = () => {
	return (
		<Popover>
			<Popover.Trigger>
				<button type="button">open popover</button>
			</Popover.Trigger>
			<Popover.Content>
				{({ floating, interactions }) => (
					<div
						ref={floating.refs.setFloating}
						style={floating.floatingStyles}
						{...interactions.getFloatingProps()}
					>
						<p>Full custom content</p>
					</div>
				)}
			</Popover.Content>
		</Popover>
	);
};

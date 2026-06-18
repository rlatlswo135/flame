import { Popover } from "@flame/ui";

export const DefaultExample = () => {
	return (
		<Popover>
			<Popover.Trigger>
				<button type="button">open popover</button>
			</Popover.Trigger>
			<Popover.Content>
				<p>Popover content</p>
			</Popover.Content>
		</Popover>
	);
};

export const WithTransitionExample = () => {
	return (
		<Popover transition>
			<Popover.Trigger>
				<button type="button">open popover</button>
			</Popover.Trigger>
			<Popover.Content>
				<p>Popover content</p>
			</Popover.Content>
		</Popover>
	);
};

export const WithCallbacksExample = () => {
	return (
		<Popover onOpen={() => alert("opened")} onClose={() => alert("closed")}>
			<Popover.Trigger>
				<button type="button">open popover</button>
			</Popover.Trigger>
			<Popover.Content>
				<p>Popover content</p>
			</Popover.Content>
		</Popover>
	);
};

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

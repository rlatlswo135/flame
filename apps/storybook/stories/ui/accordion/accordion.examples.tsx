import { Accordion } from "@flame/ui";

export const SingleExample = () => (
	<Accordion single>
		<Accordion.Item>
			<Accordion.Trigger>
				<button type="button">Item 1</button>
			</Accordion.Trigger>
			<Accordion.Content>
				<p>Only one item can be open at a time.</p>
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item>
			<Accordion.Trigger>
				<button type="button">Item 2</button>
			</Accordion.Trigger>
			<Accordion.Content>
				<p>Opening this will close Item 1.</p>
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item>
			<Accordion.Trigger>
				<button type="button">Item 3</button>
			</Accordion.Trigger>
			<Accordion.Content>
				<p>Accordion content for item 3.</p>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion>
);

export const InitialOpenExample = () => (
	<Accordion>
		<Accordion.Item initialOpen>
			<Accordion.Trigger>
				<button type="button">Initially Open</button>
			</Accordion.Trigger>
			<Accordion.Content>
				<p>This item is open by default.</p>
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item>
			<Accordion.Trigger>
				<button type="button">Collapsed</button>
			</Accordion.Trigger>
			<Accordion.Content>
				<p>This item starts collapsed.</p>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion>
);

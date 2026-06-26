import { Accordion } from "flame-ui";

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

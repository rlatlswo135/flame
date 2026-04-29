import { Accordion } from "@flame/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InitialOpenExample, SingleExample } from "./accordion.examples";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "ui/Accordion",
	component: Accordion,
	parameters: {
		docs: {
			description: {
				component:
					"A headless accordion with single and multi expand modes. Trigger receives `aria-controls` pointing to the Content `id`, and Content renders as a `<section>` element.",
			},
		},
	},
	argTypes: {
		single: {
			control: "boolean",
			description: "When true, only one item can be expanded at a time.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
	},
	render: (props) => (
		<Accordion {...props}>
			<Accordion.Item>
				<Accordion.Trigger>
					<button type="button">Item 1</button>
				</Accordion.Trigger>
				<Accordion.Content>
					<p>Accordion content for item 1.</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item>
				<Accordion.Trigger>
					<button type="button">Item 2</button>
				</Accordion.Trigger>
				<Accordion.Content>
					<p>Accordion content for item 2.</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion>
	),
} satisfies Meta<typeof Accordion>;

export const Default: Story = {};

export const Single: Story = {
	args: {
		single: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Only one item can be expanded at a time. Opening a new item automatically closes the previous one.",
			},
		},
	},
	render: () => <SingleExample />,
};

export const InitialOpen: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Use `initialOpen` on `Accordion.Item` to expand it by default on mount.",
			},
			source: {
				code: `
<Accordion>
  <Accordion.Item initialOpen>
    <Accordion.Trigger>
      <button>Initially Open</button>
    </Accordion.Trigger>
    <Accordion.Content>
      <p>This item is open by default.</p>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>`,
			},
		},
	},
	render: () => <InitialOpenExample />,
};

export const CustomControls: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Use render function children on `Accordion.Trigger` to inject custom toggle logic.",
			},
			source: {
				code: `
<Accordion>
  <Accordion.Item>
    <Accordion.Trigger>
      {({ toggle }) => (
        <button onClick={toggle}>Custom Toggle</button>
      )}
    </Accordion.Trigger>
    <Accordion.Content>
      <p>Content</p>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>`,
			},
		},
	},
	render: () => (
		<Accordion>
			<Accordion.Item>
				<Accordion.Trigger>
					{({ toggle }) => (
						<button
							type="button"
							onClick={() => {
								console.log("toggling");
								toggle();
							}}
						>
							Custom Toggle
						</button>
					)}
				</Accordion.Trigger>
				<Accordion.Content>
					<p>Content controlled by custom toggle.</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion>
	),
};

export default meta;

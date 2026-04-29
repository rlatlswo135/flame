import { Drawer } from "@flame/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DefaultExample, NestedExample } from "./drawer.examples";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "ui/Drawer",
	component: Drawer,
	parameters: {
		docs: {
			description: {
				component:
					"A headless drawer that slides in from any viewport edge. Rendered into a portal with a dim overlay, focus trap, ESC key handling, and automatic z-index stacking for nested drawers.",
			},
		},
	},
	argTypes: {
		placement: {
			control: "select",
			options: ["top", "right", "bottom", "left"],
			description: "Edge of the viewport the drawer slides in from.",
			table: {
				type: { summary: '"top" | "right" | "bottom" | "left"' },
				defaultValue: { summary: '"right"' },
			},
		},
		onOpen: {
			description: "Called when the drawer opens.",
			table: {
				type: { summary: "() => void" },
			},
		},
		onClose: {
			description: "Called when the drawer closes.",
			table: {
				type: { summary: "() => void" },
			},
		},
		contentId: {
			control: "text",
			description:
				"Custom id for the content element. Auto-generated if omitted.",
			table: {
				type: { summary: "string" },
			},
		},
	},
	render: (props) => (
		<Drawer {...props}>
			<Drawer.Trigger>
				<button type="button">open drawer</button>
			</Drawer.Trigger>
			<Drawer.Content
				style={{
					position: "fixed",
					top: 0,
					right: 0,
					height: "100%",
					width: "320px",
					background: "#fff",
					padding: "24px",
					boxShadow: "0 0 20px rgba(0,0,0,0.15)",
				}}
			>
				<h3>Drawer</h3>
				<p>Slide-in panel content goes here.</p>
				<Drawer.Closer>
					<button type="button">close drawer</button>
				</Drawer.Closer>
			</Drawer.Content>
		</Drawer>
	),
} satisfies Meta<typeof Drawer>;

export const Default: Story = {
	parameters: {
		docs: {
			source: {
				code: `
<Drawer placement="right">
  <Drawer.Trigger>
    <button type="button">open drawer</button>
  </Drawer.Trigger>
  <Drawer.Content>
    <h3>Drawer</h3>
    <p>Slide-in panel content goes here.</p>
    <Drawer.Closer>
      <button type="button">close drawer</button>
    </Drawer.Closer>
  </Drawer.Content>
</Drawer>`,
			},
		},
	},
};

export const Placement: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Drawers can slide in from any edge — `top`, `right`, `bottom`, or `left`.",
			},
			source: {
				code: `
<Drawer placement="left">
  <Drawer.Trigger>
    <button type="button">left</button>
  </Drawer.Trigger>
  <Drawer.Content>...</Drawer.Content>
</Drawer>`,
			},
		},
	},
	render: () => <DefaultExample />,
};

export const CustomControls: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Use render function children to inject custom logic into Trigger and Closer.",
			},
			source: {
				code: `
<Drawer>
  <Drawer.Trigger>
    {({ open }) => (
      <button type="button" onClick={() => { console.log("opening"); open(); }}>
        open drawer
      </button>
    )}
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Closer>
      {({ close }) => (
        <button type="button" onClick={() => { console.log("closing"); close(); }}>
          close drawer
        </button>
      )}
    </Drawer.Closer>
  </Drawer.Content>
</Drawer>`,
			},
		},
	},
	render: () => (
		<Drawer>
			<Drawer.Trigger>
				{({ open }) => (
					<button
						type="button"
						onClick={() => {
							console.log("opening");
							open();
						}}
					>
						open drawer
					</button>
				)}
			</Drawer.Trigger>
			<Drawer.Content
				style={{
					position: "fixed",
					top: 0,
					right: 0,
					height: "100%",
					width: "320px",
					background: "#fff",
					padding: "24px",
					boxShadow: "0 0 20px rgba(0,0,0,0.15)",
				}}
			>
				<h3>Custom Controls</h3>
				<Drawer.Closer>
					{({ close }) => (
						<button
							type="button"
							onClick={() => {
								console.log("closing");
								close();
							}}
						>
							close drawer
						</button>
					)}
				</Drawer.Closer>
			</Drawer.Content>
		</Drawer>
	),
};

export const Nested: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Nested drawers stack z-index automatically. ESC closes only the topmost drawer, and focus is trapped within the active drawer.",
			},
			source: {
				code: `
<Drawer>
  <Drawer.Trigger>
    <button>open outer</button>
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer>
      <Drawer.Trigger>
        <button>open inner</button>
      </Drawer.Trigger>
      <Drawer.Content>
        <p>Inner drawer</p>
        <Drawer.Closer><button>close</button></Drawer.Closer>
      </Drawer.Content>
    </Drawer>
    <Drawer.Closer><button>close outer</button></Drawer.Closer>
  </Drawer.Content>
</Drawer>`,
			},
		},
	},
	render: () => <NestedExample />,
};

export default meta;

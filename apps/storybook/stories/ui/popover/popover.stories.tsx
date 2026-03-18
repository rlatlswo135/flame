import { Popover } from "@flame/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "ui/Popover",
	component: Popover,
	parameters: {
		docs: {
			description: {
				component:
					"A floating content container built on `@floating-ui/react` (peer dependency). Supports click interaction, portal rendering, focus management, and transition animations. Use function children on `Popover.Content` for full custom rendering with direct access to Floating UI. See [Floating UI docs](https://floating-ui.com) for positioning options.",
			},
		},
	},
	argTypes: {
		portal: {
			control: "boolean",
			description:
				"Render content in a portal. Pass `true` for default or `FloatingPortalProps` for custom.",
			table: {
				type: { summary: "boolean | FloatingPortalProps" },
				defaultValue: { summary: "false" },
			},
		},
		focusTrap: {
			control: "boolean",
			description:
				"Enable focus trap and outside interaction blocking via `FloatingFocusManager` modal prop.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "true" },
			},
		},
		transition: {
			control: "boolean",
			description:
				"Enable transition. Pass `true` for default fade or `UseTransitionStylesProps` for custom.",
			table: {
				type: { summary: "boolean | UseTransitionStylesProps" },
				defaultValue: { summary: "false" },
			},
		},
		options: {
			description:
				"Forwarded to `useFloating()`. Controls placement, middleware, strategy, etc.",
			table: {
				type: { summary: "UseFloatingOptions" },
			},
		},
		click: {
			description: "Options for `useClick()` interaction hook.",
			table: {
				type: { summary: "UseClickProps" },
			},
		},
		dismiss: {
			description:
				"Options for `useDismiss()` interaction hook. Controls ESC key and outside click behavior.",
			table: {
				type: { summary: "UseDismissProps" },
			},
		},
		role: {
			description: "Options for `useRole()` interaction hook.",
			table: {
				type: { summary: "UseRoleProps" },
			},
		},
	},
	render: (props) => (
		<Popover {...props}>
			<Popover.Trigger>
				<button type="button">open popover</button>
			</Popover.Trigger>
			<Popover.Content>
				<p>Popover content</p>
			</Popover.Content>
		</Popover>
	),
} satisfies Meta<typeof Popover>;

export const Default: Story = {
	parameters: {
		docs: {
			source: {
				code: `
<Popover>
  <Popover.Trigger>
    <button type="button">open popover</button>
  </Popover.Trigger>
  <Popover.Content>
    <p>Popover content</p>
  </Popover.Content>
</Popover>`,
			},
		},
	},
};

export const WithTransition: Story = {
	args: {
		transition: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Enable default fade transition. Pass `UseTransitionStylesProps` to customize duration, initial styles, etc.",
			},
			source: {
				code: `
<Popover transition>
  <Popover.Trigger>
    <button type="button">open popover</button>
  </Popover.Trigger>
  <Popover.Content>
    <p>Popover content</p>
  </Popover.Content>
</Popover>`,
			},
		},
	},
};

export const Callbacks: Story = {
	args: {
		onOpen: () => {
			alert("opened");
		},
		onClose: () => {
			alert("closed");
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Use `onOpen` and `onClose` callbacks to respond to popover state changes.",
			},
			source: {
				code: `
<Popover
  onOpen={() => alert("opened")}
  onClose={() => alert("closed")}
>
  <Popover.Trigger>
    <button type="button">open popover</button>
  </Popover.Trigger>
  <Popover.Content>
    <p>Popover content</p>
  </Popover.Content>
</Popover>`,
			},
		},
	},
};

export const FullCustom: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Use function children on `Popover.Content` for full control over rendering. Receives `floating` and `interactions` from Floating UI, allowing direct use of `FloatingArrow`, custom styles, and any Floating UI component.",
			},
			source: {
				code: `
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
</Popover>`,
			},
		},
	},
	render: () => (
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
	),
};

export default meta;

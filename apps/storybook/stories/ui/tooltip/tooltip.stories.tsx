import { Tooltip } from "@flame/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FullCustomExample, WithPlacementExample } from "./tooltip.examples";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "ui/Tooltip",
	component: Tooltip,
	parameters: {
		docs: {
			description: {
				component:
					"A hover-triggered floating label built on `@floating-ui/react` (peer dependency). Supports hover/focus interactions, placement, flip/shift/offset middleware, and open delay. Use function children on `Tooltip.Content` for full custom rendering. See [Floating UI docs](https://floating-ui.com) for positioning options.",
			},
		},
	},
	argTypes: {
		enabled: {
			control: "boolean",
			description: "Toggle tooltip on or off without unmounting.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "true" },
			},
		},
		placement: {
			control: "select",
			options: [
				"top",
				"top-start",
				"top-end",
				"right",
				"right-start",
				"right-end",
				"bottom",
				"bottom-start",
				"bottom-end",
				"left",
				"left-start",
				"left-end",
			],
			description: "Preferred placement relative to the trigger.",
			table: {
				type: { summary: "Placement" },
				defaultValue: { summary: '"top"' },
			},
		},
		offset: {
			control: "number",
			description: "Distance (px) between trigger and tooltip.",
			table: {
				type: { summary: "OffsetOptions" },
				defaultValue: { summary: "8" },
			},
		},
		delay: {
			description:
				"Hover open/close delay in ms. Pass a number or `{ open, close }` object.",
			table: {
				type: { summary: "number | { open?: number; close?: number }" },
			},
		},
		flip: {
			description: "Options forwarded to the Floating UI `flip()` middleware.",
			table: {
				type: { summary: "FlipOptions" },
			},
		},
		shift: {
			description: "Options forwarded to the Floating UI `shift()` middleware.",
			table: {
				type: { summary: "ShiftOptions" },
			},
		},
		options: {
			description:
				"Forwarded to `useFloating()`. Controls placement, middleware, strategy, etc.",
			table: {
				type: { summary: "UseFloatingOptions" },
			},
		},
	},
	render: (props) => (
		<Tooltip {...props}>
			<Tooltip.Trigger>
				<button type="button">hover me</button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<div>툴팁 내용입니다</div>
			</Tooltip.Content>
		</Tooltip>
	),
} satisfies Meta<typeof Tooltip>;

export const Default: Story = {
	parameters: {
		docs: {
			source: {
				code: `
<Tooltip>
  <Tooltip.Trigger>
    <button type="button">hover me</button>
  </Tooltip.Trigger>
  <Tooltip.Content>
    <div>툴팁 내용입니다</div>
  </Tooltip.Content>
</Tooltip>`,
			},
		},
	},
};

export const WithPlacement: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Pass any Floating UI `Placement` value. The tooltip flips automatically when space is limited.",
			},
			source: {
				code: `
<Tooltip placement="right">
  <Tooltip.Trigger>
    <button type="button">right</button>
  </Tooltip.Trigger>
  <Tooltip.Content>
    <div>right 툴팁</div>
  </Tooltip.Content>
</Tooltip>`,
			},
		},
	},
	render: () => <WithPlacementExample />,
};

export const WithDelay: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Pass a number for a uniform delay, or `{ open, close }` for independent open/close delays.",
			},
			source: {
				code: `
<Tooltip delay={{ open: 500, close: 200 }}>
  <Tooltip.Trigger>
    <button type="button">hover (delay 500ms)</button>
  </Tooltip.Trigger>
  <Tooltip.Content>
    <div>열림 지연 500ms, 닫힘 지연 200ms</div>
  </Tooltip.Content>
</Tooltip>`,
			},
		},
	},
	args: {
		delay: { open: 500, close: 200 },
	},
};

export const Disabled: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Set `enabled={false}` to suppress the tooltip without removing it from the tree — useful for conditionally disabling tooltips.",
			},
			source: {
				code: `
<Tooltip enabled={false}>
  <Tooltip.Trigger>
    <button type="button">hover me (disabled)</button>
  </Tooltip.Trigger>
  <Tooltip.Content>
    <div>이 툴팁은 표시되지 않습니다</div>
  </Tooltip.Content>
</Tooltip>`,
			},
		},
	},
	args: {
		enabled: false,
	},
};

export const FullCustom: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Use function children on `Tooltip.Content` for full control over rendering. Receives `floating` and `interactions` from Floating UI.",
			},
			source: {
				code: `
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
</Tooltip>`,
			},
		},
	},
	render: () => <FullCustomExample />,
};

export default meta;

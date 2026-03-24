import { Select } from "@flame/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	DefaultExample,
	FullCustomExample,
	WithTransitionExample,
} from "./select.examples";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "ui/Select",
	component: Select,
	parameters: {
		docs: {
			description: {
				component:
					"A controlled select built on `@floating-ui/react` (peer dependency). Manages value selection with `value`/`onChange`, supports portal rendering, focus management, and transition animations. Use function children on `Select.Options` for full custom rendering. See [Floating UI docs](https://floating-ui.com) for positioning options.",
			},
		},
	},
	argTypes: {
		value: {
			control: "text",
			description: "Currently selected value.",
			table: {
				type: { summary: "string" },
			},
		},
		onChange: {
			description: "Callback fired when an option is selected.",
			table: {
				type: { summary: "(value: string) => void" },
			},
		},
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
	args: {
		value: "",
		onChange: () => {},
	},
} satisfies Meta<typeof Select>;

export const Default: Story = {
	parameters: {
		docs: {
			source: {
				code: `
const [value, setValue] = useState("");

<Select value={value} onChange={setValue}>
  <Select.Trigger>
    <button type="button">{value || "과일을 선택하세요"}</button>
  </Select.Trigger>
  <Select.Options>
    <Select.Option value="apple">사과</Select.Option>
    <Select.Option value="banana">바나나</Select.Option>
    <Select.Option value="cherry">체리</Select.Option>
  </Select.Options>
</Select>`,
			},
		},
	},
	render: () => <DefaultExample />,
};

export const WithTransition: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Enable default fade transition. Pass `UseTransitionStylesProps` to customize duration, initial styles, etc.",
			},
			source: {
				code: `
const [value, setValue] = useState("");

<Select value={value} onChange={setValue} transition>
  <Select.Trigger>
    <button type="button">{value || "과일을 선택하세요"}</button>
  </Select.Trigger>
  <Select.Options>
    <Select.Option value="apple">사과</Select.Option>
    <Select.Option value="banana">바나나</Select.Option>
    <Select.Option value="cherry">체리</Select.Option>
  </Select.Options>
</Select>`,
			},
		},
	},
	render: () => <WithTransitionExample />,
};

export const FullCustom: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Use function children on `Select.Options` for full control over rendering. Receives `floating` and `interactions` from Floating UI, allowing direct use of custom styles and any Floating UI component.",
			},
			source: {
				code: `
const [value, setValue] = useState("");

<Select value={value} onChange={setValue}>
  <Select.Trigger>
    <button type="button">{value || "과일을 선택하세요"}</button>
  </Select.Trigger>
  <Select.Options>
    {({ floating, interactions }) => (
      <ul
        ref={floating.refs.setFloating}
        style={floating.floatingStyles}
        {...interactions.getFloatingProps()}
      >
        <Select.Option value="apple">사과</Select.Option>
        <Select.Option value="banana">바나나</Select.Option>
        <Select.Option value="cherry">체리</Select.Option>
      </ul>
    )}
  </Select.Options>
</Select>`,
			},
		},
	},
	render: () => <FullCustomExample />,
};

export default meta;

import { Combobox } from "@flame/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
	DefaultExample,
	FullCustomExample,
	WithTransitionExample,
} from "./combobox.examples";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "ui/Combobox",
	component: Combobox,
	parameters: {
		docs: {
			description: {
				component:
					"A searchable select built on `@floating-ui/react` (peer dependency). Controlled for selection via `value`/`onChange`. The search input is managed internally — render `Combobox.Search` (which doubles as the floating anchor) as a direct child, then `Combobox.Options` containing `Combobox.Option`s. Each `Combobox.Option` self-filters by its `label` (or string children) as the user types, so no parent-side filtering is needed. Use function children on `Combobox.Options` for full custom rendering. See [Floating UI docs](https://floating-ui.com) for positioning options.",
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
	render: (props) => {
		const [value, setValue] = useState("");
		const fruits = [
			{ value: "apple", label: "사과" },
			{ value: "banana", label: "바나나" },
			{ value: "cherry", label: "체리" },
		];
		return (
			<Combobox {...props} value={value} onChange={setValue}>
				<Combobox.Search placeholder="검색..." />
				<Combobox.Options>
					{fruits.map((f) => (
						<Combobox.Option key={f.value} value={f.value} label={f.label}>
							{f.label}
						</Combobox.Option>
					))}
				</Combobox.Options>
			</Combobox>
		);
	},
} satisfies Meta<typeof Combobox>;

export const Default: Story = {
	parameters: {
		docs: {
			source: {
				code: `
const [value, setValue] = useState("");

<Combobox value={value} onChange={setValue}>
  <Combobox.Search placeholder="검색..." />
  <Combobox.Options>
    {FRUITS.map((f) => (
      <Combobox.Option key={f.value} value={f.value} label={f.label}>
        {f.label}
      </Combobox.Option>
    ))}
  </Combobox.Options>
</Combobox>`,
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

<Combobox value={value} onChange={setValue} transition>
  <Combobox.Search placeholder="검색..." />
  <Combobox.Options>
    {FRUITS.map((f) => (
      <Combobox.Option key={f.value} value={f.value} label={f.label}>
        {f.label}
      </Combobox.Option>
    ))}
  </Combobox.Options>
</Combobox>`,
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
					"Use function children on `Combobox.Options` for full control over rendering. Receives `floating` and `interactions` from Floating UI. Keep `Combobox.Search` outside `Combobox.Options` — it is the floating anchor.",
			},
			source: {
				code: `
const [value, setValue] = useState("");

<Combobox value={value} onChange={setValue}>
  <Combobox.Search placeholder="검색..." />
  <Combobox.Options>
    {({ floating, interactions }) => (
      <div
        ref={floating.refs.setFloating}
        style={floating.floatingStyles}
        {...interactions.getFloatingProps()}
      >
        {FRUITS.map((f) => (
          <Combobox.Option key={f.value} value={f.value} label={f.label}>
            {f.label}
          </Combobox.Option>
        ))}
      </div>
    )}
  </Combobox.Options>
</Combobox>`,
			},
		},
	},
	render: () => <FullCustomExample />,
};

export default meta;

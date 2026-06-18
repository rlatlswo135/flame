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
					"A searchable select built on `@floating-ui/react` (peer dependency). Fully controlled — manages `value`/`onChange` for selection and `search`/`onSearchChange` for the search input separately. Use `Combobox.Search` inside `Combobox.Options` to render the input. Filter options in the parent. Use function children on `Combobox.Options` for full custom rendering. See [Floating UI docs](https://floating-ui.com) for positioning options.",
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
		search: {
			control: "text",
			description: "Current search input value.",
			table: {
				type: { summary: "string" },
			},
		},
		onSearchChange: {
			description: "Callback fired when the search input changes.",
			table: {
				type: { summary: "(search: string) => void" },
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
		search: "",
		onSearchChange: () => {},
	},
	render: (props) => {
		const [value, setValue] = useState("");
		const [search, setSearch] = useState("");
		const fruits = [
			{ value: "apple", label: "사과" },
			{ value: "banana", label: "바나나" },
			{ value: "cherry", label: "체리" },
		];
		const filtered = fruits.filter((f) =>
			f.label.toLowerCase().includes(search.toLowerCase()),
		);
		const selectedLabel = fruits.find((f) => f.value === value)?.label;
		return (
			<Combobox
				{...props}
				value={value}
				onChange={setValue}
				search={search}
				onSearchChange={setSearch}
			>
				<Combobox.Trigger>
					<button type="button">{selectedLabel || "과일을 선택하세요"}</button>
				</Combobox.Trigger>
				<Combobox.Options>
					<Combobox.Search placeholder="검색..." />
					{filtered.map((f) => (
						<Combobox.Option key={f.value} value={f.value}>
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
const [search, setSearch] = useState("");

const filtered = FRUITS.filter((f) =>
  f.label.toLowerCase().includes(search.toLowerCase()),
);

<Combobox value={value} onChange={setValue} search={search} onSearchChange={setSearch}>
  <Combobox.Trigger>
    <button type="button">{selectedLabel || "과일을 선택하세요"}</button>
  </Combobox.Trigger>
  <Combobox.Options>
    <Combobox.Search placeholder="검색..." />
    {filtered.map((f) => (
      <Combobox.Option key={f.value} value={f.value}>
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
const [search, setSearch] = useState("");

<Combobox value={value} onChange={setValue} search={search} onSearchChange={setSearch} transition>
  <Combobox.Trigger>
    <button type="button">{selectedLabel || "과일을 선택하세요"}</button>
  </Combobox.Trigger>
  <Combobox.Options>
    <Combobox.Search placeholder="검색..." />
    {filtered.map((f) => (
      <Combobox.Option key={f.value} value={f.value}>
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
					"Use function children on `Combobox.Options` for full control over rendering. Receives `floating` and `interactions` from Floating UI.",
			},
			source: {
				code: `
const [value, setValue] = useState("");
const [search, setSearch] = useState("");

<Combobox value={value} onChange={setValue} search={search} onSearchChange={setSearch}>
  <Combobox.Trigger>
    <button type="button">{selectedLabel || "과일을 선택하세요"}</button>
  </Combobox.Trigger>
  <Combobox.Options>
    {({ floating, interactions }) => (
      <div
        ref={floating.refs.setFloating}
        style={floating.floatingStyles}
        {...interactions.getFloatingProps()}
      >
        <Combobox.Search placeholder="검색..." />
        {filtered.map((f) => (
          <Combobox.Option key={f.value} value={f.value}>
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

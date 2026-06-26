import { Tabs } from "@flame/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WithOnChangeExample } from "./tabs.examples";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "ui/Tabs",
	component: Tabs,
	parameters: {
		docs: {
			description: {
				component:
					'A tab bar using semantic HTML (`role="tablist"`, `role="tab"`, `aria-selected`). Manages selection state internally via `initialTab`; optionally notify the parent via `onChange`. Use `Tabs.Item` for each tab button.',
			},
		},
	},
	argTypes: {
		initialTab: {
			control: "text",
			description: "Initially selected tab `value`.",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: '""' },
			},
		},
		onChange: {
			description: "Callback fired when the selected tab changes.",
			table: {
				type: { summary: "(value: string) => void" },
			},
		},
	},
	args: {
		initialTab: "home",
	},
	render: (props) => (
		<Tabs {...props}>
			<Tabs.Item value="home">홈</Tabs.Item>
			<Tabs.Item value="profile">프로필</Tabs.Item>
			<Tabs.Item value="settings">설정</Tabs.Item>
		</Tabs>
	),
} satisfies Meta<typeof Tabs>;

export const Default: Story = {
	parameters: {
		docs: {
			source: {
				code: `
<Tabs initialTab="home">
  <Tabs.Item value="home">홈</Tabs.Item>
  <Tabs.Item value="profile">프로필</Tabs.Item>
  <Tabs.Item value="settings">설정</Tabs.Item>
</Tabs>`,
			},
		},
	},
};

export const WithOnChange: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Use `onChange` to track the selected tab value in parent state.",
			},
			source: {
				code: `
const [selected, setSelected] = useState("home");

<Tabs initialTab="home" onChange={setSelected}>
  <Tabs.Item value="home">홈</Tabs.Item>
  <Tabs.Item value="profile">프로필</Tabs.Item>
  <Tabs.Item value="settings">설정</Tabs.Item>
</Tabs>
<p>선택된 탭: {selected}</p>`,
			},
		},
	},
	render: () => <WithOnChangeExample />,
};

export default meta;

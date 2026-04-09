import { Toaster } from "@flame/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	ClickToDismissExample,
	CompoundExample,
	CustomTimeoutExample,
	DefaultExample,
} from "./toast.examples";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "ui/Toast",
	component: Toaster,
	parameters: {
		docs: {
			description: {
				component:
					"Imperative toast notification system. Call `toast()` to show a notification. Use `Toast` compound components (`Toast.Title`, `Toast.Description`) for structured, accessible content.",
			},
		},
	},
	argTypes: {
		placement: {
			control: "select",
			options: ["top-left", "top-right", "bottom-left", "bottom-right"],
			description: "Position of the toast container",
		},
	},
	args: {
		placement: "bottom-left",
	},
	decorators: [
		(Story, { args }) => (
			<>
				<Story />
				<Toaster placement={args.placement} />
			</>
		),
	],
	render: () => <DefaultExample />,
} satisfies Meta<typeof Toaster>;

export const Default: Story = {};

export const Compound: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Use `Toast.Title` and `Toast.Description` for accessible structured content with `aria-labelledby` and `aria-describedby`.",
			},
			source: {
				code: `
toast(
  <Toast>
    <Toast.Title>Saved</Toast.Title>
    <Toast.Description>Your changes have been saved.</Toast.Description>
  </Toast>
)
				`,
			},
		},
	},
	render: () => <CompoundExample />,
};

export const CustomTimeout: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Pass `{ timeout: ms }` as the second argument to control how long the toast stays visible.",
			},
			source: {
				code: `toast(<div>5 second toast</div>, { timeout: 5000 })`,
			},
		},
	},
	render: () => <CustomTimeoutExample />,
};

export const ClickToDismiss: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Click on any toast to dismiss it immediately. This behavior is injected automatically.",
			},
		},
	},
	render: () => <ClickToDismissExample />,
};

export const Placement: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Use the `placement` prop on `<Toaster>` to control where toasts appear. Change the placement via controls.",
			},
		},
	},
	args: {
		placement: "top-right",
	},
};

export default meta;

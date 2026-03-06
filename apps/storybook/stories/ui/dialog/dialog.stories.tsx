import { Dialog } from "@flame/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeepMountedExample } from "./dialog.examples";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "UI/Dialog",
	component: Dialog,
	argTypes: {
		keepMounted: {
			control: "boolean",
			description: "keep the dialog mounted even when it is not open",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		closeOutside: {
			control: "boolean",
			description: "close outside of the dialog",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
	},
} satisfies Meta<typeof Dialog>;

export const KeepMounted: Story = {
	args: {
		keepMounted: true,
		children: <KeepMountedExample />,
	},
};

export const CloseOutside: Story = {
	args: {
		closeOutside: true,
	},
	render: (props) => (
		<Dialog {...props}>
			<Dialog.Trigger>
				<button type="button">open dialog</button>
			</Dialog.Trigger>
			<Dialog.Content>
				<h3>Close Outside</h3>
			</Dialog.Content>
		</Dialog>
	),
};

export default meta;

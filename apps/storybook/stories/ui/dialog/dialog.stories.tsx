import { Dialog } from "@flame/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "UI/Dialog",
	component: Dialog,
	render: () => (
		<Dialog>
			<Dialog.Trigger>
				<button type="button">open dialog</button>
			</Dialog.Trigger>
			<Dialog.Content>
				<h1>Dialog Content</h1>
				<p>
					<em>This is the dialog content</em>
				</p>
				<Dialog.Closer>
					<button type="button">close dialog</button>
				</Dialog.Closer>
			</Dialog.Content>
		</Dialog>
	),
	tags: ["autodocs"],
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

export default meta;

type Story = StoryObj<typeof meta>;

export const KeepMounted: Story = {};

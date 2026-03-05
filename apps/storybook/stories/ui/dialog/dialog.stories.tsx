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
	render: (props) => (
		<Dialog {...props}>
			<Dialog.Trigger>
				<button type="button">open dialog</button>
			</Dialog.Trigger>
			<Dialog.Content
				style={{ width: "300px", height: "300px" }}
				className="dialog-content"
			>
				<h1>This is a dialog</h1>
				<p>This is a dialog content</p>
				<Dialog.Closer>
					<button type="button">close dialog</button>
				</Dialog.Closer>
			</Dialog.Content>
		</Dialog>
	),
	parameters: {
		docs: {
			description: {
				component:
					"A wrapper around the HTML dialog element. `Dialog.Content` accepts `DialogHTMLAttributes<HTMLDialogElement>`.",
			},
		},
	},
} satisfies Meta<typeof Dialog>;

export const Default: Story = {};

export const KeepMounted: Story = {
	args: {
		keepMounted: true,
	},
	render: (props) => (
		<Dialog {...props}>
			<Dialog.Trigger>
				<button type="button">open dialog</button>
			</Dialog.Trigger>
			<Dialog.Content>
				<KeepMountedExample />
				<Dialog.Closer>
					<button type="button">close dialog</button>
				</Dialog.Closer>
			</Dialog.Content>
		</Dialog>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Keep the dialog mounted even when it is not open. Preserves internal state (e.g. form inputs, counters) across open/close cycles.",
			},
		},
	},
};

export const CloseOutside: Story = {
	args: {
		closeOutside: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Close the dialog when clicking outside the backdrop area.",
			},
		},
	},
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
				<Dialog>
					<Dialog.Trigger>
						{({ open }) => (
							<button
								type="button"
								onClick={() => {
									alert("custom-open");
									open();
								}}
							>
								open dialog
							</button>
						)}
					</Dialog.Trigger>
					<Dialog.Content>
						<h3>Custom Open</h3>
						<Dialog.Closer>
							{({ close }) => (
								<button
									type="button"
									onClick={() => {
										alert("custom-close");
										close();
									}}
								>
									close dialog
								</button>
							)}
						</Dialog.Closer>
					</Dialog.Content>
				</Dialog>
			`,
			},
		},
	},
	render: (props) => (
		<Dialog {...props}>
			<Dialog.Trigger>
				{({ open }) => (
					<button
						type="button"
						onClick={() => {
							alert("custom-open");
							open();
						}}
					>
						open dialog
					</button>
				)}
			</Dialog.Trigger>
			<Dialog.Content>
				<h3>Custom Open</h3>
				<Dialog.Closer>
					{({ close }) => (
						<button
							type="button"
							onClick={() => {
								alert("custom-close");
								close();
							}}
						>
							close dialog
						</button>
					)}
				</Dialog.Closer>
			</Dialog.Content>
		</Dialog>
	),
};

export default meta;

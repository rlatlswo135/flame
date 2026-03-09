import { Funnel } from "@flame/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FormExample } from "./funnel.examples";

type Story = StoryObj<typeof meta>;

const meta = {
	title: "ui/Funnel",
	component: Funnel,
	parameters: {
		docs: {
			description: {
				component:
					"A step-based navigation component. Renders only the active `Funnel.Step` child based on internal step index.",
			},
		},
	},
	render: () => (
		<Funnel>
			<Funnel.Step>
				<h3>Step 1</h3>
				<p>First step content</p>
				<Funnel.Next>
					<button type="button">Next</button>
				</Funnel.Next>
			</Funnel.Step>
			<Funnel.Step>
				<h3>Step 2</h3>
				<p>Second step content</p>
				<Funnel.Prev>
					<button type="button">Prev</button>
				</Funnel.Prev>
				<Funnel.Next>
					<button type="button">Next</button>
				</Funnel.Next>
			</Funnel.Step>
			<Funnel.Step>
				<h3>Step 3</h3>
				<p>Last step content</p>
				<Funnel.Prev>
					<button type="button">Prev</button>
				</Funnel.Prev>
			</Funnel.Step>
		</Funnel>
	),
} satisfies Meta<typeof Funnel>;

export const Default: Story = {};

export const WithJump: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Use render function children on `Funnel.Step` to access `jump` for direct step navigation.",
			},
		},
	},
	render: () => (
		<Funnel>
			<Funnel.Step>
				{({ jump }) => (
					<div>
						<h3>Step 1</h3>
						<button type="button" onClick={() => jump(2)}>
							Jump to Step 3
						</button>
						<Funnel.Next>
							<button type="button">Next</button>
						</Funnel.Next>
					</div>
				)}
			</Funnel.Step>
			<Funnel.Step>
				<h3>Step 2</h3>
				<Funnel.Prev>
					<button type="button">Prev</button>
				</Funnel.Prev>
				<Funnel.Next>
					<button type="button">Next</button>
				</Funnel.Next>
			</Funnel.Step>
			<Funnel.Step>
				{({ jump }) => (
					<div>
						<h3>Step 3</h3>
						<button type="button" onClick={() => jump(0)}>
							Jump to Step 1
						</button>
						<Funnel.Prev>
							<button type="button">Prev</button>
						</Funnel.Prev>
					</div>
				)}
			</Funnel.Step>
		</Funnel>
	),
};

export const CustomNavigation: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Use render function children on `Funnel.Next` and `Funnel.Prev` to inject custom logic into navigation controls.",
			},
		},
	},
	render: () => (
		<Funnel>
			<Funnel.Step>
				<h3>Step 1</h3>
				<Funnel.Next>
					{({ next }) => (
						<button
							type="button"
							onClick={() => {
								alert("moving to step 2");
								next();
							}}
						>
							Next (with alert)
						</button>
					)}
				</Funnel.Next>
			</Funnel.Step>
			<Funnel.Step>
				<h3>Step 2</h3>
				<Funnel.Prev>
					{({ prev }) => (
						<button
							type="button"
							onClick={() => {
								alert("going back to step 1");
								prev();
							}}
						>
							Prev (with alert)
						</button>
					)}
				</Funnel.Prev>
			</Funnel.Step>
		</Funnel>
	),
};

export const WithFormState: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Each step unmounts when navigating away, so internal state is lost. Use this to verify state reset behavior.",
			},
		},
	},
	render: () => (
		<Funnel>
			<Funnel.Step>
				<div>
					<h3>Step 1</h3>
					<FormExample />
					<Funnel.Next>
						<button type="button">Next</button>
					</Funnel.Next>
				</div>
			</Funnel.Step>
			<Funnel.Step>
				<h3>Step 2</h3>
				<Funnel.Prev>
					<button type="button">Prev</button>
				</Funnel.Prev>
			</Funnel.Step>
		</Funnel>
	),
};

export const ConditionalStep: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Toggle a conditional step to verify that `Children.toArray` index-based rendering handles dynamic children correctly. When the optional step is hidden, step indices shift.",
			},
		},
	},
	render: () => {
		const [showOptional, setShowOptional] = useState(true);
		return (
			<div>
				<label>
					<input
						type="checkbox"
						checked={showOptional}
						onChange={(e) => setShowOptional(e.target.checked)}
					/>
					Show optional step
				</label>
				<Funnel>
					<Funnel.Step>
						<h3>Step 1</h3>
						<Funnel.Next>
							<button type="button">Next</button>
						</Funnel.Next>
					</Funnel.Step>
					{showOptional && (
						<Funnel.Step>
							<h3>Step 2 (Optional)</h3>
							<Funnel.Prev>
								<button type="button">Prev</button>
							</Funnel.Prev>
							<Funnel.Next>
								<button type="button">Next</button>
							</Funnel.Next>
						</Funnel.Step>
					)}
					<Funnel.Step>
						<h3>Step 3 (Final)</h3>
						<Funnel.Prev>
							<button type="button">Prev</button>
						</Funnel.Prev>
					</Funnel.Step>
				</Funnel>
			</div>
		);
	},
};

export default meta;

import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
			sort: "requiredFirst",
		},
		layout: "centered",
		docs: {
			source: {
				type: "dynamic",
			},
			codePanel: true,
		},
	},
	argTypes: {
		children: { control: false },
	},
	tags: ["autodocs"],
};

export default preview;

import type { Preview } from "@storybook/react-vite";

const COMPOUND_PARTS = [
	"Trigger",
	"Content",
	"Closer",
	"Item",
	"Header",
	"Footer",
];
const compoundPattern = new RegExp(
	`<(\\/?)(${COMPOUND_PARTS.join("|")})(\\s|>|\\/)`,
	"g",
);

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
				transform: (code: string, storyContext: { title: string }) => {
					const component = storyContext.title.split("/").pop();
					if (!component) return code;
					return code.replace(compoundPattern, `<$1${component}.$2$3`);
				},
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

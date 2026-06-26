import { Tabs } from "@flame/ui";
import { useState } from "react";
import { ComponentDemo } from "../component-demo";

function TabsDemo({ t }: { t: Record<string, string> }) {
	const [activeTab, setActiveTab] = useState("overview");

	const tabs = [
		{ value: "overview", label: t.overview },
		{ value: "usage", label: t.usage },
		{ value: "api", label: t.api },
	] as const;

	const content: Record<string, string> = {
		overview: t.overviewContent,
		usage: t.usageContent,
		api: t.apiContent,
	};

	return (
		<div className="w-full max-w-md">
			<Tabs initialTab="overview" onChange={setActiveTab}>
				<div className="flex border-b border-flame-border mb-4">
					{tabs.map((tab) => (
						<Tabs.Item
							key={tab.value}
							value={tab.value}
							className="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px data-[selected=true]:border-flame-accent data-[selected=true]:text-flame-accent border-transparent text-flame-text-secondary hover:text-flame-text"
						>
							{tab.label}
						</Tabs.Item>
					))}
				</div>
			</Tabs>
			<p className="text-sm text-flame-text-secondary">{content[activeTab]}</p>
		</div>
	);
}

function TabsSection({
	t,
	code,
	codeHtml,
}: {
	t: Record<string, string>;
	code: string;
	codeHtml: string;
}) {
	return (
		<ComponentDemo code={code} codeHtml={codeHtml}>
			<TabsDemo t={t} />
		</ComponentDemo>
	);
}

export { TabsSection };

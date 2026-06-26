import { useState } from "react";
import { CopyButton } from "./copy-button";

const MANAGERS = [
	{ id: "npm", label: "npm", prefix: "npm install" },
	{ id: "pnpm", label: "pnpm", prefix: "pnpm add" },
	{ id: "yarn", label: "yarn", prefix: "yarn add" },
] as const;

type ManagerId = (typeof MANAGERS)[number]["id"];

function InstallTabs({ packages }: { packages: string }) {
	const [active, setActive] = useState<ManagerId>("pnpm");
	const current = MANAGERS.find((m) => m.id === active) ?? MANAGERS[1];
	const command = `${current.prefix} ${packages}`;

	return (
		<div className="rounded-lg border border-flame-border overflow-hidden bg-flame-bg-secondary">
			<div className="flex items-center justify-between border-b border-flame-border">
				<div className="flex">
					{MANAGERS.map((m) => (
						<button
							key={m.id}
							type="button"
							onClick={() => setActive(m.id)}
							className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
								m.id === active
									? "border-flame-accent text-flame-accent"
									: "border-transparent text-flame-text-secondary hover:text-flame-text"
							}`}
						>
							{m.label}
						</button>
					))}
				</div>
				<div className="px-4">
					<CopyButton code={command} />
				</div>
			</div>
			<pre className="px-4 py-3 text-sm font-mono overflow-x-auto text-flame-text">
				<code>{command}</code>
			</pre>
		</div>
	);
}

export { InstallTabs };

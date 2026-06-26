import { Drawer } from "flame-ui";
import { ComponentDemo } from "../component-demo";

function DrawerDemo({ t }: { t: Record<string, string> }) {
	return (
		<div className="flex items-center gap-3">
			{(["right", "left", "top", "bottom"] as const).map((placement) => (
				<Drawer key={placement} placement={placement}>
					<Drawer.Trigger>
						<button
							type="button"
							className="px-4 py-2 rounded-lg text-sm font-medium bg-flame-accent text-white hover:opacity-90 transition-opacity"
						>
							{placement}
						</button>
					</Drawer.Trigger>
					<Drawer.Content
						className={`bg-flame-bg border border-flame-border shadow-2xl ${
							placement === "right" || placement === "left" ? "w-80" : "h-48"
						}`}
					>
						<div className="p-6">
							<h2 className="text-lg font-semibold text-flame-text mb-2">
								{t.title}
							</h2>
							<p className="text-sm text-flame-text-secondary mb-6">
								{t.description}
							</p>
							<Drawer.Closer>
								<button
									type="button"
									className="px-4 py-2 rounded-lg text-sm font-medium border border-flame-border text-flame-text hover:bg-flame-bg-secondary transition-colors"
								>
									{t.close}
								</button>
							</Drawer.Closer>
						</div>
					</Drawer.Content>
				</Drawer>
			))}
		</div>
	);
}

function DrawerSection({
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
			<DrawerDemo t={t} />
		</ComponentDemo>
	);
}

export { DrawerSection };

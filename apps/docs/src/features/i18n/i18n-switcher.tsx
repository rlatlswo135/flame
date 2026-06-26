import { Popover } from "flame-ui";

const LOCALES = [
	{ code: "ko", label: "한국어" },
	{ code: "en", label: "English" },
] as const;

function I18nSwitcher({
	locale,
	currentPath,
}: {
	locale: string;
	currentPath: string;
}) {
	function buildHref(targetLocale: string) {
		return currentPath.replace(`/${locale}`, `/${targetLocale}`);
	}

	return (
		<Popover hover={{ enabled: true }} transition>
			<Popover.Trigger>
				<button
					type="button"
					className="p-2 rounded-lg hover:bg-flame-bg-tertiary transition-colors"
					aria-label="Switch language"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="M2 12h20" />
						<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
					</svg>
				</button>
			</Popover.Trigger>
			<Popover.Content className="rounded-xl border border-flame-border shadow-lg bg-flame-bg p-1 min-w-30">
				{LOCALES.map(({ code, label }) => (
					<a
						key={code}
						href={buildHref(code)}
						className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
							code === locale
								? "bg-flame-accent-soft text-flame-accent font-medium"
								: "hover:bg-flame-bg-tertiary"
						}`}
					>
						{label}
					</a>
				))}
			</Popover.Content>
		</Popover>
	);
}

export { I18nSwitcher };

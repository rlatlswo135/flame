import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export const usePrefersReducedMotion = () => {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;

		const mediaQuery = window.matchMedia(QUERY);
		setPrefersReducedMotion(mediaQuery.matches);

		const onChange = (event: MediaQueryListEvent) =>
			setPrefersReducedMotion(event.matches);

		mediaQuery.addEventListener("change", onChange);
		return () => mediaQuery.removeEventListener("change", onChange);
	}, []);

	return prefersReducedMotion;
};

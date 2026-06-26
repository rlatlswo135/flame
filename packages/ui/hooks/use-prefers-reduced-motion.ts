import { useEffect, useState } from "react";

// TODO: 필요여부 체크 -> utils내 중복이 어느정도 있어보임
export const usePrefersReducedMotion = () => {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;

		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		setPrefersReducedMotion(mediaQuery.matches);

		const onChange = (event: MediaQueryListEvent) =>
			setPrefersReducedMotion(event.matches);

		mediaQuery.addEventListener("change", onChange);
		return () => mediaQuery.removeEventListener("change", onChange);
	}, []);

	return prefersReducedMotion;
};

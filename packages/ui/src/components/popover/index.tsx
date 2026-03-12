import {
	autoUpdate,
	FloatingFocusManager,
	flip,
	offset,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { useState } from "react";

export type PopoverProps = {};

export const Popover = () => {
	const [isOpen, setIsOpen] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		middleware: [offset(10), flip(), shift()],
		whileElementsMounted: autoUpdate,
	});

	const click = useClick(context);
	const dismiss = useDismiss(context);
	const role = useRole(context);

	// Merge all the interactions into prop getters
	const { getReferenceProps, getFloatingProps } = useInteractions([
		click,
		dismiss,
		role,
	]);

	return (
		<div>
			<h1>Floating UI Popover</h1>
			<button ref={refs.setReference} {...getReferenceProps()}>
				Reference element
			</button>
			{isOpen && (
				<FloatingFocusManager context={context} modal={false}>
					<div
						ref={refs.setFloating}
						style={floatingStyles}
						{...getFloatingProps()}
						className="Popover"
					>
						Popover element
					</div>
				</FloatingFocusManager>
			)}
		</div>
	);
};

import {
	type UseFloatingOptions,
	type UseFloatingReturn,
	type UseInteractionsReturn,
	useClick,
	useFloating,
	useInteractions,
} from "@floating-ui/react";
import {
	type ComponentPropsWithoutRef,
	type PropsWithChildren,
	useState,
} from "react";
import { useCtx } from "@/src/hooks/use-ctx";
import type { FnChildren } from "@/src/types";
import { PopoverContext } from "./context";

type PopoverProps = {
	onClose?: () => void;
	onOpen?: () => void;
	options?: UseFloatingOptions;
};

type ContentProps = FnChildren<{
	interactions: UseInteractionsReturn;
	floating: UseFloatingReturn;
}> &
	Omit<ComponentPropsWithoutRef<"section">, "style" | "children">;

const Popover = ({
	children,
	options,
	onClose,
	onOpen,
}: PropsWithChildren<PopoverProps>) => {
	const [isOpen, setIsOpen] = useState(false);

	const floating = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		...options,
	});

	const click = useClick(floating.context);

	const interactions = useInteractions([click]);

	return (
		<PopoverContext value={{ floating, onClose, onOpen, interactions }}>
			{children}
		</PopoverContext>
	);
};

const Trigger = ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
	const { floating, interactions } = useCtx(PopoverContext);

	return (
		<div
			ref={floating.refs.setReference}
			{...interactions.getReferenceProps()}
			{...props}
		>
			{children}
		</div>
	);
};

const Content = ({ children, ...props }: ContentProps) => {
	const { floating, interactions } = useCtx(PopoverContext);

	if (typeof children === "function")
		return children({ floating, interactions });

	return (
		<section
			ref={floating.refs.setFloating}
			style={floating.floatingStyles}
			{...interactions.getFloatingProps()}
			{...props}
		>
			{children}
		</section>
	);
};

const Closer = () => {
	return <button type="button">Closer</button>;
};

Popover.Trigger = Trigger;
Popover.Content = Content;
Popover.Closer = Closer;

export { Popover, type PopoverProps };

/*
TODO - storybook

1. controlled -> open + onOpenChange

*/

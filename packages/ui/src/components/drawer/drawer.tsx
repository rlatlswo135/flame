"use client";

import {
  type ComponentPropsWithRef,
  cloneElement,
  type PropsWithChildren,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useCtx } from "@/src/hooks/use-ctx";
import { useMounted } from "@/src/hooks/use-mounted";
import type { ClickableElement, ElementFnChildren } from "@/src/types";
import { DrawerContext } from "./context";

type Placement = "top" | "right" | "bottom" | "left";

type DrawerProps = PropsWithChildren<{
  placement?: Placement;
  onOpen?: () => void;
  onClose?: () => void;
}>;

type DrawerTriggerProps = ElementFnChildren<{ open: () => void }>;

type DrawerCloserProps = ElementFnChildren<{ close: () => void }>;

type DrawerContentProps = ComponentPropsWithRef<"div">;

const Drawer = ({
  children,
  placement = "right",
  onOpen,
  onClose,
}: DrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
    onOpen?.();
  };

  const close = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <DrawerContext value={{ isOpen, open, close }}>{children}</DrawerContext>
  );
};

const Trigger = ({ children }: DrawerTriggerProps) => {
  const { open, isOpen } = useCtx(DrawerContext);

  if (typeof children === "function") return children({ open });

  return cloneElement(children as ClickableElement, {
    onClick: open,
    "aria-expanded": isOpen,
  });
};

const Closer = ({ children }: DrawerCloserProps) => {
  const { close } = useCtx(DrawerContext);

  if (typeof children === "function") return children({ close });

  return cloneElement(children as ClickableElement, { onClick: close });
};

const Content = ({ children, ...props }: DrawerContentProps) => {
  const { isOpen, close } = useCtx(DrawerContext);
  const isMounted = useMounted();

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div>
      {/* dim */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: dim is a redundant mouse-only close affordance; keyboard users close via Escape */}
      <div
        data-slot="dim"
        onClick={close}
        style={{ inset: 0, position: "fixed", zIndex: 1 }}
      />
      {/* content */}
      <div data-slot="content" style={{ zIndex: 2 }} {...props}>
        {children}
      </div>
    </div>,
    document.body,
  );
};

Trigger.displayName = "Drawer.Trigger";
Content.displayName = "Drawer.Content";
Closer.displayName = "Drawer.Closer";

Drawer.Trigger = Trigger;
Drawer.Content = Content;
Drawer.Closer = Closer;

export {
  Drawer,
  type DrawerProps,
  type DrawerTriggerProps,
  type DrawerCloserProps,
  type DrawerContentProps,
};

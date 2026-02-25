import {
  cloneElement,
  useMemo,
  useRef,
  type DialogHTMLAttributes,
  type PropsWithChildren,
} from "react";
import { DialogContext, type DialogContextType } from "./context";
import type { ClickableElement, RenderChildrenProps } from "@/src/types";
import { useCtx } from "@/src/hooks/use-ctx";

const Dialog = ({
  children,
  closeOutside = false,
}: PropsWithChildren<{ closeOutside?: boolean }>) => {
  const ref = useRef<HTMLDialogElement>(null);

  const contextValue: DialogContextType = useMemo(
    () => ({
      dialog: ref,
      open: () => ref.current?.showModal(),
      close: () => ref.current?.close(),
      closeOutside,
    }),
    [closeOutside],
  );

  return <DialogContext value={contextValue}>{children}</DialogContext>;
};

const Trigger = ({ children }: RenderChildrenProps<{ open: () => void }>) => {
  const { open } = useCtx(DialogContext);

  if (typeof children === "function") return children({ open });

  return cloneElement(children as ClickableElement, { onClick: open });
};

const Closer = ({ children }: RenderChildrenProps<{ close: () => void }>) => {
  const { close } = useCtx(DialogContext);

  if (typeof children === "function") return children({ close });

  return cloneElement(children as ClickableElement, { onClick: close });
};

const Content = ({
  children,
  ...props
}: PropsWithChildren<DialogHTMLAttributes<HTMLDialogElement>>) => {
  const { dialog, close, closeOutside } = useCtx(DialogContext);

  return (
    <dialog ref={dialog} onClick={closeOutside ? close : undefined} {...props}>
      <section onClick={(e) => e.stopPropagation()}>{children}</section>
    </dialog>
  );
};

Dialog.Trigger = Trigger;
Dialog.Content = Content;
Dialog.Closer = Closer;

export { Dialog };

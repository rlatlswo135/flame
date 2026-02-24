import { useRef } from "react";

export type ModalProps = {
  foo?: boolean;
};

export const Modal = () => {
  const ref = useRef<HTMLDialogElement>(null);

  const onClickOpen = () => {
    ref.current?.showModal();
  };

  const onClickClose = () => {
    ref.current?.close();
  };

  return (
    <>
      <dialog ref={ref}>
        안녕 나는 dialog 입니다.<button onClick={onClickClose}>close</button>
      </dialog>
      <div>
        <button onClick={onClickOpen}>open</button>
      </div>
    </>
  );
};

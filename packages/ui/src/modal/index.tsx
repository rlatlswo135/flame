import { Select } from "@/src/select";

export type ModalProps = {
  foo?: boolean;
};

export const Modal = () => {
  console.log("Select", Select);
  return <div>modal</div>;
};

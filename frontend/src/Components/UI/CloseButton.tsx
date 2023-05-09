import React from "react";
import { MdClose } from "react-icons/md";

type Props = {
  onTouch: () => void;
  color: string;
};

const CloseButton = (props: Props) => {
  return (
    <button
      type="button"
      onClick={props.onTouch}
      className={`bg-${props.color}  flex justify-center items-center absolute rounded-full w-6 h-6 font-semibold right-1 top-1 aspect-square hover:rotate-180 duration-300 `}
    >
      <MdClose  />
    </button>
  );
};

export default CloseButton;

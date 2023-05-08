import React from "react";

type Props = {
  onTouch: () => void;
  color: string;
};

const CloseButton = (props: Props) => {
  return (
    <button
      type="button"
      onClick={props.onTouch}
      className={`absolute bg-${props.color} rounded-full w-6 font-semibold right-1 top-1 aspect-square `}
    >
      X
    </button>
  );
};

export default CloseButton;

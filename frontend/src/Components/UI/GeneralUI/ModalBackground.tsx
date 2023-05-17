type Props = {
  onClose: () => void;
  darkness: number;
};

const ModalBackground = (props: Props) => {
  return (
    <div
      onClick={props.onClose}
      className={`bg-[rgba(0,0,0,${props.darkness})] w-[100svw] z-40  h-[100svh] absolute inset-0 m-auto backdrop-blur-sm `}
    ></div>
  );
};

export default ModalBackground;

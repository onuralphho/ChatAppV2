const Modal = (props: any) => {
  return (
    <>
      <div
        onClick={props.closeModal}
        className="w-[100svw] z-10  h-[100svh] absolute left-0 top-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm "
      ></div>
      <div className="bg-white text-black  font-semibold rounded-md p-2 absolute z-20 w-[clamp(20rem,20vw,30rem)] flex flex-col gap-5 m-auto inset-0 h-max">
        <h2 className="text-3xl">{props.title}</h2>

        <div className="flex gap-2">
          <button
            onClick={props.confirm}
            className="flex-1 bg-green-500 rounded text-xl text-white"
          >
            Confirm
          </button>
          <button
            onClick={props.cancel}
            className="flex-1 bg-[rgb(255,0,0)] rounded text-xl text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;

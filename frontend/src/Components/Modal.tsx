const Modal = (props: any) => {
  if (props.type === "logout") {
    return (
      <>
        <div
          onClick={props.closeModal}
          className="w-[100svw] z-10 cursor-pointer h-[100svh] absolute left-0 top-0 bg-[rgba(0,0,0,0.4)]"
        ></div>
        <div className="bg-white font-semibold rounded-xl p-2 absolute z-20 w-[clamp(20rem,20vw,30rem)] flex flex-col gap-5 m-auto inset-0 h-max">
          <h2 className="text-3xl">Logout</h2>

          <div className="flex gap-2">
            <button
              onClick={props.logout}
              className="flex-1 bg-green-500 rounded text-xl text-white"
            >
              Confirm
            </button>
            <button
              onClick={props.closeModal}
              className="flex-1 bg-[rgb(255,0,0)] rounded text-xl text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          onClick={props.closeModal}
          className="w-[100svw] z-10 cursor-pointer h-[100svh] absolute left-0 top-0 bg-[rgba(0,0,0,0.4)]"
        ></div>
        <div></div>
      </>
    );
  }
};

export default Modal;

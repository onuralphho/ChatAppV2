
const AlertBox = (props: any) => {
  return (
    <div
      onClick={() => {
        props.closeBox({ shown: false, type: props.message });
      }}
      className={`${
        props.isShown
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-24"
      }  cursor-pointer transition-all bg-green-500 text-[#efefef] duration-700 ease-in-out absolute  z-40 top-0 left-0 right-0 m-auto  px-4 py-2 rounded-md `}
    >
      <div className="flex gap-1 items-center text-2xl  ">
        {props.message}
      </div>
    </div>
  );
};

export default AlertBox;

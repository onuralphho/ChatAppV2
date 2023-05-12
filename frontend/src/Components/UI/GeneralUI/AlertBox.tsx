import { useAlertContext } from "../../../Context/AlertProvider";

type Props = {
  message: string;
  isShown: boolean;
  
};

const AlertBox = (props: Props) => {

  const alertCtx = useAlertContext()



  return (
    <div
      className={`${
        props.isShown
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-24"
      }  cursor-pointer transition-all bg-green-500 text-[#efefef] duration-700 ease-in-out absolute  z-[999] top-0 left-0 right-0 m-auto  px-4 py-2 rounded-md `}
    >
      <div className="flex items-center gap-1 text-2xl ">{alertCtx?.alert.type}</div>
    </div>
  );
};

export default AlertBox;

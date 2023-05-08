import { useTranslation } from "react-i18next";
import ModalBackground from "./ModalBackground";

type Props = {
  title: string;
  cancel: () => void;
  confirm: () => void;
};

const Modal = (props: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <ModalBackground darkness={0.3} onClose={props.cancel} />
      <div className="bg-white text-black  font-semibold rounded-md p-2 absolute z-50 w-[clamp(20rem,20vw,30rem)] flex flex-col gap-5 m-auto inset-0 h-max">
        <h2 className="text-3xl">{props.title}?</h2>

        <div className="flex gap-2">
          <button
            onClick={props.confirm}
            className="flex-1 text-xl text-white bg-green-500 rounded"
          >
            {t("confirm")}
          </button>
          <button
            onClick={props.cancel}
            className="flex-1 bg-[rgb(255,0,0)] rounded text-xl text-white"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;
